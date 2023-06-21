import {
  DocumentNode,
  FetchResult,
  MutationFunctionOptions,
  MutationHookOptions,
  useMutation,
} from '@apollo/client';
import { FieldNode, OperationDefinitionNode } from 'graphql';
import { useCallback, useMemo } from 'react';

import { useRestrictedAccessContext } from '@core/contexts/restrictedAccess';
import { useSentryContext } from '@core/contexts/sentry';
import { Level, useSnackNotificationContext } from '@core/contexts/snackNotification';

import MutationError from '../../errors/mutation';
import NetworkError from '../../errors/network';

export interface Error {
  message: string;
  code?: number;
}

type Options<T, V> = {
  showErrorsWithSnackNotification?: boolean;
  showErrorsInForm?: boolean;
  sendErrors?: boolean;
  warnIfNoErrorHandling?: boolean;
} & MutationHookOptions<T, V>;

export const errorCodes = {
  unverifiedEmail: 20000,
  unverifiedPhoneNumber: 20010,
};

export default <T, V>(mutation: DocumentNode, opts: Options<T, V> = {}) => {
  const {
    showErrorsWithSnackNotification,
    showErrorsInForm,
    sendErrors,
    warnIfNoErrorHandling = true,
    ...mutationOptions
  } = opts;

  const [mutate, { loading }] = useMutation<T, V>(mutation, mutationOptions);
  const { showNotification } = useSnackNotificationContext();
  const { setShowRestrictedAccess } = useRestrictedAccessContext();
  const { sendSafeError } = useSentryContext();

  const mutationName = useMemo(
    () =>
      (
        (
          mutation.definitions.find(
            d => d.kind === 'OperationDefinition' && d.operation === 'mutation'
          ) as OperationDefinitionNode
        ).selectionSet.selections[0] as FieldNode
      ).name.value,
    [mutation.definitions]
  );

  const handleErrors = useCallback(
    (errors: readonly Error[], networkError?: boolean) => {
      if (errors.length === 0) return;
      if (errors.some(({ code }) => code === errorCodes.unverifiedEmail)) {
        setShowRestrictedAccess('email');
      } else if (
        errors.some(({ code }) => code === errorCodes.unverifiedPhoneNumber)
      ) {
        setShowRestrictedAccess('phone');
      }
      const message = errors.map(e => e.message).join(', ');
      if (showErrorsWithSnackNotification) {
        showNotification('errors', { errors: message }, { level: Level.ERROR });
        return;
      }
      if (sendErrors) {
        sendSafeError(new Error(`Errors in graphql mutation: ${message}`));
        return;
      }
      if (showErrorsInForm) {
        return;
      }

      if (networkError) {
        throw new NetworkError(message);
      } else {
        throw new MutationError(message);
      }
    },
    [
      showErrorsWithSnackNotification,
      showErrorsInForm,
      sendErrors,
      showNotification,
      sendSafeError,
      setShowRestrictedAccess,
    ]
  );

  return [
    useCallback(
      async (options?: MutationFunctionOptions<T, V>) => {
        const errors: { message: string }[] = [];
        let data: FetchResult<T>['data'];
        try {
          ({ data } = await mutate(options));
          const mutationData = (data as unknown as any)[mutationName];
          if (Array.isArray(mutationData?.errors)) {
            errors.push(...mutationData.errors);
            handleErrors(mutationData.errors);
          }
        } catch ({ graphQLErrors, networkError }) {
          // networkError is NOT an array
          if (networkError) {
            errors.push(networkError);
            handleErrors([networkError], true);
          }
          if (graphQLErrors) {
            errors.push(...graphQLErrors);
            handleErrors(graphQLErrors);
          }
          if (
            !graphQLErrors &&
            !networkError &&
            warnIfNoErrorHandling &&
            import.meta.env.MODE !== 'production'
          ) {
            // eslint-disable-next-line no-console
            console.warn(`${mutationName} doesn't request errors`);
          }
        }
        return { data, errors, success: errors.length === 0 };
      },
      [handleErrors, mutate, mutationName, warnIfNoErrorHandling]
    ),
    { loading },
  ] as const;
};

import { gql, useMutation } from '@apollo/client';

import { Level, useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { formatGqlErrors } from '@sorare/core/src/lib/gql';

import {
  DetachPaymentMethodMutation,
  DetachPaymentMethodMutationVariables,
} from './__generated__/useDetachPaymentMethod.graphql';

const DETACH_PAYMENT_METHOD_MUTATION = gql`
  mutation DetachPaymentMethodMutation($input: detachPaymentMethodInput!) {
    detachPaymentMethod(input: $input) {
      currentUser {
        slug
        paymentMethods {
          id
        }
      }
      errors {
        path
        message
        code
      }
    }
  }
`;

export default () => {
  const [detachPaymentMethod] = useMutation<
    DetachPaymentMethodMutation,
    DetachPaymentMethodMutationVariables
  >(DETACH_PAYMENT_METHOD_MUTATION);
  const { showNotification } = useSnackNotificationContext();

  return async (paymentMethod: string) => {
    const result = await detachPaymentMethod({
      variables: { input: { paymentMethod } },
    });

    const errors = result.data?.detachPaymentMethod?.errors || [];

    if (errors.length) {
      showNotification(
        'errors',
        { errors: formatGqlErrors(errors) },
        { level: Level.WARN }
      );
      return errors;
    }
    showNotification('paymentMethodDetached');
    return null;
  };
};

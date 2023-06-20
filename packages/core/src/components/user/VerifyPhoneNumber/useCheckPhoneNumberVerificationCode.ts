import { gql, useMutation } from '@apollo/client';

import { PrivateKeyRecovery } from '@sorare/wallet-shared';
import { Level, useSnackNotificationContext } from 'contexts/snackNotification';
import { formatGqlErrors } from '@sorare/core/src/lib/gql';

import {
  CheckPhoneNumberMutation,
  CheckPhoneNumberMutationVariables,
} from './__generated__/useCheckPhoneNumberVerificationCode.graphql';

export const MISSING_PHONE_VERIFICATION_REQUEST = 10_000;
export const PHONE_VERIFICATION_REQUEST_EXPIRED = 10_001;
export const INVALID_PHONE_VERIFICATION_CODE = 10_002;
export const WRONG_CODE_PROVIDED_TOO_MANY_TIMES = 10_003;
export const TOO_MANY_ATTEMPTS = 10_007;

export const CHECK_PHONE_NUMBER_MUTATION = gql`
  mutation CheckPhoneNumberMutation(
    $input: checkPhoneNumberVerificationCodeInput!
  ) {
    checkPhoneNumberVerificationCode(input: $input) {
      currentUser {
        slug
        phoneNumber
        phoneNumberVerified
        phoneNumberVerificationRequested
        unverifiedPhoneNumber
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
  const [checkPhoneNumberVerificationCode] = useMutation<
    CheckPhoneNumberMutation,
    CheckPhoneNumberMutationVariables
  >(CHECK_PHONE_NUMBER_MUTATION);
  const { showNotification } = useSnackNotificationContext();

  return async (code: string, privateKeyRecovery?: PrivateKeyRecovery) => {
    const result = await checkPhoneNumberVerificationCode({
      variables: {
        input: {
          code,
          privateKeyRecovery,
        },
      },
    });

    const errors = result.data?.checkPhoneNumberVerificationCode?.errors || [];

    if (errors.length) {
      showNotification(
        'errors',
        { errors: formatGqlErrors(errors) },
        { level: Level.WARN }
      );
      return errors;
    }
    return null;
  };
};

import { gql } from '@apollo/client';
import { useCallback } from 'react';

import useMutation from '@core/hooks/graphql/useMutation';

import {
  ResendVerifationCodeForRecoveryEmailMutation,
  ResendVerifationCodeForRecoveryEmailMutationVariables,
} from './__generated__/useResendVerificationCodeForRecoveryEmail.graphql';

const RESEND_VERIFICATION_CODE_FOR_RECOVERY_EMAIL = gql`
  mutation ResendVerifationCodeForRecoveryEmailMutation(
    $input: resendVerificationCodeInput!
  ) {
    resendVerificationCode(input: $input) {
      errors {
        path
        message
        code
      }
    }
  }
`;

export const useResendVerificationCodeForRecoveryEmail = () => {
  const [mutate, { loading }] = useMutation<
    ResendVerifationCodeForRecoveryEmailMutation,
    ResendVerifationCodeForRecoveryEmailMutationVariables
  >(RESEND_VERIFICATION_CODE_FOR_RECOVERY_EMAIL, {
    showErrorsWithSnackNotification: true,
  });

  const resendVerificationCodeForRecoveryEmail = useCallback(
    async (reference: string) => {
      const input = {
        reference,
      };
      const result = await mutate({
        variables: {
          input,
        },
      });
      return result;
    },
    [mutate]
  );

  return {
    resendVerificationCodeForRecoveryEmail,
    loading,
  };
};

export default useResendVerificationCodeForRecoveryEmail;

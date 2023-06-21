import { gql } from '@apollo/client';
import { useCallback } from 'react';

import { PrivateKeyRecoveryOptionMethodEnum } from '@core/__generated__/globalTypes';
import { walletRecovery } from '@core/contexts/currentUser/queries';
import useMutation from '@core/hooks/graphql/useMutation';

import {
  ActivateWalletRecoveryEmailMutation,
  ActivateWalletRecoveryEmailMutationVariables,
} from './__generated__/useActivateWalletRecoveryEmail.graphql';

const ACTIVATE_WALLET_RECOVERY_EMAIL = gql`
  mutation ActivateWalletRecoveryEmailMutation(
    $input: activateWalletRecoveryInput!
  ) {
    activateWalletRecovery(input: $input) {
      currentUser {
        slug
        ...CurrentUserProvider_walletRecovery
      }
      errors {
        path
        message
        code
      }
    }
  }
  ${walletRecovery}
`;

export const useActivateWalletRecoveryEmail = () => {
  const [mutate, { loading }] = useMutation<
    ActivateWalletRecoveryEmailMutation,
    ActivateWalletRecoveryEmailMutationVariables
  >(ACTIVATE_WALLET_RECOVERY_EMAIL, { showErrorsInForm: true });

  const activateWalletRecoveryEmail = useCallback(
    async ({
      verificationCode,
      destination,
    }: {
      verificationCode: string;
      destination: string;
    }) => {
      const input = {
        verificationCode,
        destination,
        method: PrivateKeyRecoveryOptionMethodEnum.EMAIL,
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
    activateWalletRecoveryEmail,
    loading,
  };
};

export default useActivateWalletRecoveryEmail;

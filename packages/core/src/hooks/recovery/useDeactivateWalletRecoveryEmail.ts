import { gql } from '@apollo/client';
import { useCallback } from 'react';

import { PrivateKeyRecoveryOptionMethodEnum } from '__generated__/globalTypes';
import { walletRecovery } from '@core/contexts/currentUser/queries';
import useMutation from '@core/hooks/graphql/useMutation';

import {
  DeactivateWalletRecoveryEmailMutation,
  DeactivateWalletRecoveryEmailMutationVariables,
} from './__generated__/useDeactivateWalletRecoveryEmail.graphql';

const DEACTIVATE_WALLET_RECOVERY_EMAIL = gql`
  mutation DeactivateWalletRecoveryEmailMutation(
    $input: deactivateWalletRecoveryInput!
  ) {
    deactivateWalletRecovery(input: $input) {
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

export const useDeactivateWalletRecoveryEmail = () => {
  const [mutate, { loading }] = useMutation<
    DeactivateWalletRecoveryEmailMutation,
    DeactivateWalletRecoveryEmailMutationVariables
  >(DEACTIVATE_WALLET_RECOVERY_EMAIL, {
    showErrorsWithSnackNotification: true,
  });

  const deactivateWalletRecoveryEmail = useCallback(
    async (destination: string) => {
      const input = {
        method: PrivateKeyRecoveryOptionMethodEnum.EMAIL,
        destination,
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
    deactivateWalletRecoveryEmail,
    loading,
  };
};

export default useDeactivateWalletRecoveryEmail;

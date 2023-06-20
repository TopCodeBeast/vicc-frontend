import { gql } from '@apollo/client';
import { useCallback } from 'react';

import { PrivateKeyRecoveryInput } from '__generated__/globalTypes';
import { walletRecovery } from 'contexts/currentUser/queries';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import {
  AddWalletRecoveryEmailMutation,
  AddWalletRecoveryEmailMutationVariables,
} from './__generated__/useAddWalletRecoveryEmail.graphql';

const ADD_WALLET_RECOVERY_EMAIL = gql`
  mutation AddWalletRecoveryEmailMutation($input: addWalletRecoveryInput!) {
    addWalletRecovery(input: $input) {
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

export const useAddWalletRecoveryEmail = () => {
  const [mutate, { loading }] = useMutation<
    AddWalletRecoveryEmailMutation,
    AddWalletRecoveryEmailMutationVariables
  >(ADD_WALLET_RECOVERY_EMAIL, { showErrorsInForm: true });

  const addWalletRecoveryEmail = useCallback(
    async ({
      privateKeyRecovery,
      otpAttempt,
    }: {
      privateKeyRecovery: PrivateKeyRecoveryInput;
      otpAttempt?: string;
    }) => {
      const input = {
        privateKeyRecovery,
        ...(otpAttempt && { otpAttempt }),
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
    addWalletRecoveryEmail,
    loading,
  };
};

export default useAddWalletRecoveryEmail;

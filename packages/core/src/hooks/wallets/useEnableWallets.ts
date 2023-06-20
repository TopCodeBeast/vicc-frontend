import { gql } from '@apollo/client';

import { EnabledWallet } from '__generated__/globalTypes';
import { useCurrentUserContext } from 'contexts/currentUser';
import { useSnackNotificationContext } from 'contexts/snackNotification';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import {
  EnableWalletsMutation,
  EnableWalletsMutationVariables,
} from './__generated__/useEnableWallets.graphql';

const ENABLE_WALLETS_MUTATION = gql`
  mutation EnableWalletsMutation($input: updateUserProfileInput!) {
    updateUserProfile(input: $input) {
      userProfile {
        id
        enabledWallets
      }
      errors {
        path
        message
        code
      }
    }
  }
`;

const useEnableWallets = () => {
  const { showNotification } = useSnackNotificationContext();
  const { currentUser } = useCurrentUserContext();
  const [mutate, { loading }] = useMutation<
    EnableWalletsMutation,
    EnableWalletsMutationVariables
  >(ENABLE_WALLETS_MUTATION);

  return {
    enableWallets: async (wallets: EnabledWallet[]) => {
      const { data, errors } = await mutate({
        variables: {
          input: {
            enabledWallets: wallets,
          },
        },
        optimisticResponse: {
          updateUserProfile: {
            __typename: 'updateUserProfilePayload',
            userProfile: {
              __typename: 'UserProfile',
              id: currentUser!.profile.id,
              enabledWallets: wallets,
            },
            errors: [],
          },
        },
      });

      if (data) {
        return data.updateUserProfile?.userProfile?.enabledWallets;
      }
      showNotification('errors', errors);
      return null;
    },
    loading,
  };
};
export default useEnableWallets;

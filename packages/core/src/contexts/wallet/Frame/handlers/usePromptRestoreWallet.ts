import { gql, useLazyQuery } from '@apollo/client';
import { useContext, useEffect } from 'react';

import { MessagingContext, PromptRestoreWallet } from '@sorare/wallet-shared';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import useQueryString from '@core/hooks/useQueryString';

import {
  RestoreWalletQuery,
  RestoreWalletQueryVariables,
} from './__generated__/usePromptRestoreWallet.graphql';

const RESTORE_WALLET_QUERY = gql`
  query RestoreWalletQuery($id: String!) {
    currentUser {
      slug
      wallet {
        privateKeyRecoveryPayload(id: $id) {
          iv
          ivTemp
          encryptionKey
          payload
        }
      }
    }
  }
`;

export default () => {
  const { sendRequest } = useContext(MessagingContext)!;
  const { currentUser } = useCurrentUserContext();
  const { showNotification } = useSnackNotificationContext();
  const { showWallet, mounted, setCurrentTab } = useWalletDrawerContext();
  const action = useQueryString('action');
  const id = useQueryString('id');

  const [query, { data, loading }] = useLazyQuery<
    RestoreWalletQuery,
    RestoreWalletQueryVariables
  >(RESTORE_WALLET_QUERY, { fetchPolicy: 'network-only' });

  useEffect(() => {
    const doPrompt = async () => {
      if (action === 'restoreWallet' && id && !data) {
        query({ variables: { id } });
      }

      if (
        action !== 'restoreWallet' ||
        !id ||
        loading ||
        !data ||
        !mounted ||
        !currentUser
      ) {
        return;
      }

      const privateKeyRecoveryPayload =
        data?.currentUser?.wallet?.privateKeyRecoveryPayload;

      if (privateKeyRecoveryPayload) {
        await sendRequest<PromptRestoreWallet>('promptRestoreWallet', {
          privateKeyRecoveryPayload,
        });
        setCurrentTab(WalletTab.RESTORE_WALLET);
        showWallet();
      } else {
        showNotification(
          'nullSorarePrivateKeyRecovery',
          {},
          { autoHideDuration: null }
        );
      }
    };

    doPrompt();
  }, [
    action,
    currentUser,
    sendRequest,
    showNotification,
    showWallet,
    mounted,
    setCurrentTab,
    query,
    id,
    data,
    loading,
  ]);
};

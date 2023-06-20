import { useContext, useEffect } from 'react';

import { MessagingContext, PromptRecoverKey } from '@sorare/wallet-shared';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { WalletTab, useWalletDrawerContext } from '@sorare/core/src/contexts/walletDrawer';
import useQueryString from '@sorare/core/src/hooks/useQueryString';

export default () => {
  const { sendRequest } = useContext(MessagingContext)!;
  const { currentUser } = useCurrentUserContext();
  const { showNotification } = useSnackNotificationContext();
  const { showWallet, mounted, setCurrentTab } = useWalletDrawerContext();
  const action = useQueryString('action');

  useEffect(() => {
    const doPrompt = async () => {
      if (action !== 'recoverKey' || !mounted || !currentUser) {
        return;
      }

      if (currentUser.sorarePrivateKeyRecovery) {
        await sendRequest<PromptRecoverKey>('promptRecoverKey', {
          userPrivateKeyRecovery: currentUser.sorarePrivateKeyRecovery,
        });
        setCurrentTab(WalletTab.RECOVER_KEY);
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
  ]);
};

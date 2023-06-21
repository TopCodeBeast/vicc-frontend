import { useContext, useEffect } from 'react';

import { MessagingContext, PromptRecoverKey } from '@sorare/wallet-shared';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import useQueryString from '@core/hooks/useQueryString';

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

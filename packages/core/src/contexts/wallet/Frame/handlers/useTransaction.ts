import { useContext, useEffect } from 'react';

import { MessagingContext, Transaction } from '@sorare/wallet-shared';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import { WalletTab, useWalletDrawerContext } from '@sorare/core/src/contexts/walletDrawer';
import { txLink } from '@sorare/core/src/lib/etherscan';

export default () => {
  const { setCurrentTab, hideWallet } = useWalletDrawerContext();
  const { registerHandler } = useContext(MessagingContext)!;
  const { showNotification } = useSnackNotificationContext();

  useEffect(
    () =>
      registerHandler<Transaction>('transaction', async ({ hash }) => {
        setCurrentTab(WalletTab.HOME);
        hideWallet();
        if (hash) {
          showNotification('txSent', {}, { link: txLink(hash) });
        }
        return {};
      }),
    [hideWallet, registerHandler, setCurrentTab, showNotification]
  );
};

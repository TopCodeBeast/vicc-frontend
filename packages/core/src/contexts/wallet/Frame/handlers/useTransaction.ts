import { useContext, useEffect } from 'react';

import { MessagingContext, Transaction } from '@sorare/wallet-shared';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';
import { WalletTab, useWalletDrawerContext } from '@core/contexts/walletDrawer';
import { txLink } from '@core/lib/etherscan';

import useUpdateExternalEthDeposit from './useUpdateExternalEthDeposit';

export default () => {
  const { setCurrentTab, hideWallet } = useWalletDrawerContext();
  const [updateExternalDeposit] = useUpdateExternalEthDeposit();
  const { registerHandler } = useContext(MessagingContext)!;
  const { showNotification } = useSnackNotificationContext();

  useEffect(
    () =>
      registerHandler<Transaction>(
        'transaction',
        async ({ hash, depositId }) => {
          setCurrentTab(WalletTab.HOME);
          hideWallet();
          if (hash && depositId) {
            await updateExternalDeposit({
              variables: {
                input: {
                  id: depositId,
                  transactionHash: hash,
                },
              },
            });
            showNotification('txSent', {}, { link: txLink(hash) });
          }
          return {};
        }
      ),
    [
      hideWallet,
      registerHandler,
      setCurrentTab,
      showNotification,
      updateExternalDeposit,
    ]
  );
};

import { useCallback, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { AccountData } from '@core/contexts/blockchain';
import usePrepareEthDeposit from '@core/contexts/blockchain/usePrepareEthDeposit';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { EventStep } from '@core/contexts/events/types';
import { useSentryContext } from '@core/contexts/sentry';
import { useWeb3Context } from '@core/contexts/web3';
import useDepositEthEvent from '@core/hooks/events/useDeposithEthEvent';
import { Wallet } from '@core/lib/web3';
import { toWei } from '@core/lib/wei';

import useCreatePendingDeposit from './useCreatePendingDeposit';

const userRejectedRequestErrorCode = 4001;

const messages = defineMessages({
  userRejectedRequestError: {
    id: 'useDepositEth.userRejectedRequestError',
    defaultMessage: 'You rejected the deposit',
  },
  pendingDepositError: {
    id: 'useDepositEth.pendingDepositError',
    defaultMessage:
      'A deposit intent is being processed, open your wallet extension to confirm the deposit.',
  },
});

export const useDepositEth = (accountData: AccountData | null) => {
  const trackDepositEthEvent = useDepositEthEvent();
  const { currentUser } = useCurrentUserContext();
  const { wallet: browserWallet } = useWeb3Context();
  const { sendSafeError } = useSentryContext();
  const prepareEthDeposit = usePrepareEthDeposit();
  const createPendingDeposit = useCreatePendingDeposit();
  const [loading, setLoading] = useState(false);
  const starkKey = currentUser?.starkKey || null;
  const { formatMessage } = useIntl();
  const deposit = useCallback(
    async (amountInEth: number) => {
      const { ethAccount, ethereum: ethereumInstance } = accountData!;
      if (!currentUser) throw new Error('No current user');
      if (!ethereumInstance.starkExchangeManager)
        throw new Error('No stark exchange manager');
      if (!starkKey) throw new Error('No stark key');

      const ethDeposit = await prepareEthDeposit(toWei(amountInEth));
      if (!ethDeposit) return null;

      const { assetType, vaultId, weiAmount } = ethDeposit;

      const result =
        await ethereumInstance.starkExchangeManager?.depositEthAsync(
          ethAccount!,
          starkKey,
          assetType,
          vaultId,
          Number(weiAmount)
        );

      trackDepositEthEvent(EventStep.FULFILLED, {
        ethAmount: amountInEth,
        wallet: browserWallet,
      });

      await createPendingDeposit(result, weiAmount);

      return result;
    },
    [
      accountData,
      currentUser,
      starkKey,
      prepareEthDeposit,
      trackDepositEthEvent,
      browserWallet,
      createPendingDeposit,
    ]
  );

  return useCallback(
    async (amountInEth: number) => {
      if (!accountData) return null;
      if (loading)
        return {
          err: {
            message: formatMessage(messages.pendingDepositError),
          },
        };
      try {
        trackDepositEthEvent(EventStep.STARTED, {
          ethAmount: amountInEth,
          wallet: browserWallet,
        });

        if (!currentUser) throw new Error('No current user');

        setLoading(true);
        const result = await deposit(amountInEth);
        setLoading(false);

        return { result };
      } catch (err: any) {
        setLoading(false);

        if (browserWallet === Wallet.TRUST) {
          // Hide Trust errors as it does not support eth_subscribe until we find a solution
          sendSafeError(err);

          return { err: undefined };
        }
        if (err.code === userRejectedRequestErrorCode) {
          return {
            err: {
              message: formatMessage(messages.userRejectedRequestError),
            },
          };
        }
        return { err };
      }
    },
    [
      accountData,
      browserWallet,
      currentUser,
      deposit,
      trackDepositEthEvent,
      formatMessage,
      loading,
      sendSafeError,
    ]
  );
};

export default useDepositEth;

import Big from 'bignumber.js';
import { useCallback, useMemo } from 'react';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useCurrencyConverters from '@sorare/core/src/hooks/useCurrencyConverters';
import { useFiatBalance } from '@sorare/core/src/hooks/wallets/useFiatBalance';

export const useHasInsufficientFundsInWallets = () => {
  const { currentUser } = useCurrentUserContext();
  const { convertToWei } = useCurrencyConverters();
  const { availableBalance: availableBalanceInFiat, fiatCurrency } =
    useFiatBalance();
  const availableBalance = useMemo(
    () => new Big(currentUser?.availableBalance || '0'),
    [currentUser]
  );

  const diffInWei = (balance: Big, weiAmountToPay: string | Big) =>
    balance.minus(weiAmountToPay).multipliedBy(-1);

  const bigAvailableFiatBalanceInWei = useMemo(
    () =>
      new Big(
        (fiatCurrency &&
          convertToWei(availableBalanceInFiat.toString(), fiatCurrency)) ||
          '0'
      ),
    [availableBalanceInFiat, convertToWei, fiatCurrency]
  );

  return useCallback(
    (weiAmountToPay: string | Big) => {
      const insufficientFundsInEthWallet = availableBalance.lt(weiAmountToPay);
      const diffInWeiForEthWallet =
        insufficientFundsInEthWallet &&
        diffInWei(availableBalance, weiAmountToPay);
      const insufficientFundsInFiatWallet =
        bigAvailableFiatBalanceInWei.lt(weiAmountToPay);
      const diffInWeiForFiatWallet =
        insufficientFundsInFiatWallet &&
        diffInWei(bigAvailableFiatBalanceInWei, weiAmountToPay);
      return {
        insufficientFundsInEthWallet,
        diffInWeiForEthWallet,
        insufficientFundsInFiatWallet,
        diffInWeiForFiatWallet,
      };
    },
    [availableBalance, bigAvailableFiatBalanceInWei]
  );
};

export default useHasInsufficientFundsInWallets;

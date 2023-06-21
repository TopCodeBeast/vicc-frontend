import Big from 'bignumber.js';
import { useCallback, useMemo } from 'react';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { MonetaryAmountOutput } from '@sorare/core/src/hooks/useMonetaryAmount';
import { useFiatBalance } from '@sorare/core/src/hooks/wallets/useFiatBalance';
import { getMonetaryAmountIndex } from '@sorare/core/src/lib/monetaryAmount';

export const useHasInsufficientFundsInWallets = () => {
  const { currentUser } = useCurrentUserContext();
  const { availableBalanceInCents, fiatCurrency } = useFiatBalance();

  const availableBalance = useMemo(
    () => new Big(currentUser?.availableBalance || '0'),
    [currentUser]
  );

  const diff = (balance: Big, weiAmountToPay: string | number) =>
    balance.minus(weiAmountToPay).multipliedBy(-1);

  const bigAvailableFiatCentsBalance = useMemo(
    () => new Big(availableBalanceInCents || '0'),
    [availableBalanceInCents]
  );

  return useCallback(
    (monetaryAmountToPay: MonetaryAmountOutput) => {
      const insufficientFundsInEthWallet = availableBalance.lt(
        monetaryAmountToPay.wei
      );
      const diffInWeiForEthWallet =
        (insufficientFundsInEthWallet &&
          diff(availableBalance, monetaryAmountToPay.wei)) ||
        undefined;
      const insufficientFundsInFiatWallet = bigAvailableFiatCentsBalance.lt(
        monetaryAmountToPay[getMonetaryAmountIndex(fiatCurrency)]
      );
      const diffInFiatCentsForFiatWallet =
        (insufficientFundsInFiatWallet &&
          diff(
            bigAvailableFiatCentsBalance,
            monetaryAmountToPay[getMonetaryAmountIndex(fiatCurrency)]
          ).toNumber()) ||
        undefined;
      return {
        insufficientFundsInEthWallet,
        diffInWeiForEthWallet,
        insufficientFundsInFiatWallet,
        diffInFiatCentsForFiatWallet,
      };
    },
    [availableBalance, bigAvailableFiatCentsBalance, fiatCurrency]
  );
};

export default useHasInsufficientFundsInWallets;

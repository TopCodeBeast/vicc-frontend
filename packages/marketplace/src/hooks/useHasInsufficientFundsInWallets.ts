import Big from 'bignumber.js';
import { useCallback, useMemo } from 'react';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { MonetaryAmountOutput } from '@sorare/core/src/hooks/useMonetaryAmount';
import { useFiatBalance } from '@sorare/core/src/hooks/wallets/useFiatBalance';
import { getMonetaryAmountIndex } from '@sorare/core/src/lib/monetaryAmount';

type Args =
  | {
      monetaryAmountToPayWithFiatWallet: MonetaryAmountOutput;
      monetaryAmountToPayWithEthWallet: MonetaryAmountOutput;
    }
  | MonetaryAmountOutput;

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
    (args: Args) => {
      const monetaryAmountToPayWithEthWallet =
        'monetaryAmountToPayWithEthWallet' in args
          ? args.monetaryAmountToPayWithEthWallet
          : args;
      const monetaryAmountToPayWithFiatWallet =
        'monetaryAmountToPayWithFiatWallet' in args
          ? args.monetaryAmountToPayWithFiatWallet
          : args;

      const insufficientFundsInEthWallet = availableBalance.lt(
        monetaryAmountToPayWithEthWallet.wei
      );
      const diffInWeiForEthWallet =
        (insufficientFundsInEthWallet &&
          diff(availableBalance, monetaryAmountToPayWithEthWallet.wei)) ||
        undefined;
      const insufficientFundsInFiatWallet = bigAvailableFiatCentsBalance.lt(
        monetaryAmountToPayWithFiatWallet[getMonetaryAmountIndex(fiatCurrency)]
      );
      const diffInFiatCentsForFiatWallet =
        (insufficientFundsInFiatWallet &&
          diff(
            bigAvailableFiatCentsBalance,
            monetaryAmountToPayWithFiatWallet[
              getMonetaryAmountIndex(fiatCurrency)
            ]
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

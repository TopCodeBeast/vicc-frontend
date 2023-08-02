import Big from 'bignumber.js';
import { useMemo } from 'react';

import {
  Currency,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useMonetaryAmount, {
  MonetaryAmountOutput,
} from '@sorare/core/src/hooks/useMonetaryAmount';
import { useFiatBalance } from '@sorare/core/src/hooks/wallets/useFiatBalance';
import { getMonetaryAmountIndex } from '@sorare/core/src/lib/monetaryAmount';

import { PaymentProvider_auction } from './__generated__/fragments.graphql';

type Props = {
  monetaryAmount: MonetaryAmountOutput;
  currencies: Currency[];
  setPaymentCurrency: (c: Currency) => void;
  paymentCurrency: Currency | null;
  auction?: PaymentProvider_auction;
};

export const usePresetCurrency = ({
  monetaryAmount,
  currencies,
  setPaymentCurrency,
  paymentCurrency,
  auction,
}: Props) => {
  const { toMonetaryAmount } = useMonetaryAmount();
  const {
    currentUser,
    walletPreferences: { showEthWallet },
  } = useCurrentUserContext();
  const { availableBalanceInCents, fiatCurrency: userFiatCurrency } =
    useFiatBalance();

  const monetaryAmountToPayWithFiatWallet = useMemo(() => {
    if (auction?.myBestBid) {
      if (
        !auction.myBestBid.fiatPayment &&
        auction.myBestBid.maximumAmounts &&
        auction.myBestBid.maximumAmounts.referenceCurrency !==
          SupportedCurrency.WEI
      ) {
        const { maximumAmounts } = auction.myBestBid;
        const { referenceCurrency } = maximumAmounts;
        const referenceCurrencyIndex =
          getMonetaryAmountIndex(referenceCurrency);
        return toMonetaryAmount({
          referenceCurrency,
          [referenceCurrencyIndex]: new Big(
            monetaryAmount[referenceCurrencyIndex]
          ).minus(maximumAmounts[referenceCurrencyIndex]!),
        });
      }
    }
    return monetaryAmount;
  }, [auction?.myBestBid, monetaryAmount, toMonetaryAmount]);

  const monetaryAmountToPayWithEthWallet = useMemo(() => {
    if (auction?.myBestBid) {
      if (
        !auction.myBestBid.fiatPayment &&
        auction.myBestBid.maximumAmounts &&
        auction.myBestBid.maximumAmounts.referenceCurrency ===
          SupportedCurrency.WEI
      ) {
        const { maximumAmounts } = auction.myBestBid;
        const { referenceCurrency } = maximumAmounts;

        const referenceCurrencyIndex =
          getMonetaryAmountIndex(referenceCurrency);

        return toMonetaryAmount({
          referenceCurrency,
          [referenceCurrencyIndex]: new Big(
            monetaryAmount[referenceCurrencyIndex]
          ).minus(maximumAmounts[referenceCurrencyIndex]!),
        });
      }
    }
    return monetaryAmount;
  }, [auction?.myBestBid, monetaryAmount, toMonetaryAmount]);

  const availableBalance = useMemo(
    () => new Big(currentUser?.availableBalance || '0'),
    [currentUser]
  );

  const bigAvailableFiatBalance = useMemo(
    () => new Big(availableBalanceInCents || 0),
    [availableBalanceInCents]
  );

  if (!paymentCurrency) {
    if (
      currencies.includes(Currency.FIAT) &&
      bigAvailableFiatBalance.gte(
        monetaryAmountToPayWithFiatWallet[
          getMonetaryAmountIndex(userFiatCurrency)
        ]
      )
    ) {
      setPaymentCurrency(Currency.FIAT);
    } else {
      setPaymentCurrency(
        (currencies.includes(Currency.ETH) &&
          showEthWallet &&
          availableBalance.gte(monetaryAmountToPayWithEthWallet.wei)) ||
          !currencies.includes(Currency.FIAT)
          ? Currency.ETH
          : Currency.FIAT
      );
    }
  }

  return {
    monetaryAmountToPayWithFiatWallet,
    monetaryAmountToPayWithEthWallet,
  };
};

export default usePresetCurrency;

import { useCallback } from 'react';

import { MonetaryAmount } from '__generated__/globalTypes';
import { useConfigContext } from '@core/contexts/config';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import MonetaryAmountClass, {
  MonetaryAmountParams,
  getFiatMonetaryAmountIndex,
} from '@core/lib/monetaryAmount';

type NonNullableObj<T> = { [K in keyof T]: NonNullable<T[K]> };

export type MonetaryAmountOutput = Omit<
  NonNullableObj<Required<MonetaryAmount>>,
  '__typename' | 'referenceCurrency'
>;

export const zeroMonetaryAmount: MonetaryAmountOutput = {
  eur: 0,
  usd: 0,
  gbp: 0,
  wei: '0',
};

const useMonetaryAmount = () => {
  const { exchangeRate } = useConfigContext();
  const {
    fiatCurrency: { code },
  } = useCurrentUserContext();

  const toMonetaryAmount = useCallback(
    (params: MonetaryAmountParams): MonetaryAmountOutput => {
      const monetaryAmount = new MonetaryAmountClass(params);

      return monetaryAmount.inCurrencies(exchangeRate.rates.eth);
    },
    [exchangeRate.rates.eth]
  );

  const getUserFiatAmount = useCallback(
    (monetaryAmount: MonetaryAmountOutput) =>
      monetaryAmount[getFiatMonetaryAmountIndex(code)],
    [code]
  );

  return { toMonetaryAmount, getUserFiatAmount };
};

export default useMonetaryAmount;

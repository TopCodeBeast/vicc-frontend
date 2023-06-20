import { useCallback } from 'react';

import useCurrencyConverters from '@sorare/core/src/hooks/useCurrencyConverters';
import { Currency } from '@sorare/core/src/lib/currency';
import { CurrencyCode } from '@sorare/core/src/lib/fiat';

export type Callback = (ethAmount: number, fiatAmount: number) => void;

export default (cb: Callback, currencyCode: CurrencyCode) => {
  const { convertFromEth, convertToEth } = useCurrencyConverters();

  return useCallback(
    (currency: Currency, amount: number) => {
      if (currency === Currency.ETH) {
        cb(amount, convertFromEth(amount, currencyCode));
      } else {
        cb(convertToEth(amount.toString(), currencyCode), amount);
      }
    },
    [cb, convertFromEth, convertToEth, currencyCode]
  );
};

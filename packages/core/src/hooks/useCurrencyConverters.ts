import Big from 'bignumber.js';
import { useCallback } from 'react';

import { useConfigContext } from '@core/contexts/config';
import { CurrencyCode } from '@core/lib/fiat';
import { asObject } from '@core/lib/json';
import { ETH_DECIMAL_PLACES } from '@core/lib/wei';

export default () => {
  const { exchangeRate } = useConfigContext();

  const convertFromWei = useCallback(
    (amountInWei: string | number, currencyCode: CurrencyCode) =>
      exchangeRate?.rates
        ? new Big(amountInWei)
            .multipliedBy(
              asObject(exchangeRate?.rates).wei[currencyCode.toLowerCase()]
            )
            .toNumber()
        : 0,
    [exchangeRate?.rates]
  );

  const convertFromEth = useCallback(
    (amountInEth: string | number, currencyCode: CurrencyCode) =>
      new Big(amountInEth)
        .multipliedBy(
          asObject(exchangeRate.rates).eth[currencyCode.toLowerCase()]
        )
        .toNumber(),
    [exchangeRate?.rates]
  );

  const convertToEth = useCallback(
    (amountInEur: string, currencyCode: CurrencyCode) =>
      new Big(
        Number.parseFloat(amountInEur) /
          Number.parseFloat(
            asObject(exchangeRate.rates).eth[currencyCode.toLowerCase()]
          )
      )
        .decimalPlaces(ETH_DECIMAL_PLACES)
        .toNumber(),
    [exchangeRate?.rates]
  );

  const convertToWei = useCallback(
    (amountInEur: string, currencyCode: CurrencyCode) =>
      new Big(amountInEur)
        .dividedBy(asObject(exchangeRate.rates).wei[currencyCode.toLowerCase()])
        .decimalPlaces(0),
    [exchangeRate?.rates]
  );

  return {
    convertFromWei,
    convertFromEth,
    convertToEth,
    convertToWei,
  };
};

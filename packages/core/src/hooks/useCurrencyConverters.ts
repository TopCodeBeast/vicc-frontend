import Big from 'bignumber.js';
import { useCallback } from 'react';

import { useConfigContext } from '@core/contexts/config';
import { CurrencyCode } from '@core/lib/fiat';
import { asObject } from '@core/lib/json';
import { ETH_DECIMAL_PLACES, WEI_DECIMAL_PLACES } from '@core/lib/wei';

export default () => {
  const { exchangeRate } = useConfigContext();

  //TODO**************
  const convertFromWei = useCallback(
    (amountInWei: string | number, currencyCode: CurrencyCode) =>
      0,
      // exchangeRate?.rates
      //   ? new Big(amountInWei)
      //       .multipliedBy(
      //         asObject(exchangeRate?.rates).wei[currencyCode.toLowerCase()]
      //       )
      //       .toNumber()
      //   : 0,
    [exchangeRate?.rates]
  );

  const convertFromEth = useCallback(
    (amountInEth: string | number, currencyCode: CurrencyCode) =>
      0,
      // new Big(amountInEth)
      //   .multipliedBy(
      //     asObject(exchangeRate.rates).eth[currencyCode.toLowerCase()]
      //   )
      //   .toNumber(),
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

  //TODO*************
  const convertToWei = useCallback(
    (amountInEur: string, currencyCode: CurrencyCode) =>
      new Big('0'),
      // new Big(amountInEur)
      //   .dividedBy(asObject(exchangeRate.rates).wei[currencyCode.toLowerCase()])
      //   .decimalPlaces(WEI_DECIMAL_PLACES),
    [exchangeRate?.rates]
  );

  return {
    convertFromWei,
    convertFromEth,
    convertToEth,
    convertToWei,
  };
};

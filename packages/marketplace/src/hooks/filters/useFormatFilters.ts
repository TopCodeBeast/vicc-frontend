import Big from 'bignumber.js';
import { useCallback } from 'react';

import { Currency } from '@sorare/core/src/__generated__/globalTypes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useCurrencyConverters from '@sorare/core/src/hooks/useCurrencyConverters';
import { fromWei, toWei } from '@sorare/core/src/lib/wei';

const algoliaWeiFactor = new Big(10).pow(13);

type ReturnedProps = {
  algoliaWeiFactor: Big;
  formatPrice: (value: number, maxReachesEnd?: boolean) => string;
  sliderToPrice: (value: number) => string;
  priceToSlider: (value: number) => number;
};

const useFormatFilters = (): ReturnedProps => {
  const { currency, fiatCurrency } = useCurrentUserContext();

  const { convertFromWei, convertToWei } = useCurrencyConverters();
  const { formatEth, formatNumber } = useIntlContext();

  const sliderToPrice = useCallback(
    (value: number): string => {
      const wei = new Big(value).multipliedBy(algoliaWeiFactor).toString();

      let number;
      if (currency === Currency.FIAT) {
        number = convertFromWei(wei, fiatCurrency.code).toFixed(2);
      } else {
        number = fromWei(wei).toString();
      }

      return number;
    },
    [currency, fiatCurrency.code, convertFromWei]
  );

  const formatPrice = useCallback(
    (value: number, maxReachesEnd?: boolean) => {
      const price = sliderToPrice(value);

      let formattedNumber;
      if (currency === Currency.FIAT) {
        formattedNumber = formatNumber(Number(price), {
          style: 'currency',
          currency: fiatCurrency.code,
        });
      } else {
        formattedNumber = formatEth(price);
      }

      return `${formattedNumber}${maxReachesEnd ? '+' : ''}`;
    },
    [currency, fiatCurrency.code, formatEth, formatNumber, sliderToPrice]
  );

  const priceToSlider = useCallback(
    (value: number): number => {
      let wei;
      if (currency === Currency.FIAT) {
        wei = convertToWei(value.toString(), fiatCurrency.code);
      } else {
        wei = toWei(value);
      }

      return new Big(wei).dividedBy(algoliaWeiFactor).toNumber();
    },
    [currency, fiatCurrency.code, convertToWei]
  );

  return {
    algoliaWeiFactor,
    formatPrice,
    sliderToPrice,
    priceToSlider,
  };
};

export default useFormatFilters;

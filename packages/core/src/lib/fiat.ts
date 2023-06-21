import {
  faDollar,
  faEuroSign,
  faSterlingSign,
} from '@fortawesome/pro-solid-svg-icons';

import { Fiat, FiatCurrency } from '@core/__generated__/globalTypes';

export type CurrencyCode = 'USD' | 'GBP' | 'EUR';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
}

const euro: Currency = {
  code: 'EUR',
  symbol: '€',
};

export const currencies: { [locale: string]: Currency } = {
  usd: {
    code: 'USD',
    symbol: '$',
  },
  gbp: {
    code: 'GBP',
    symbol: '£',
  },
  eur: euro,
};

export const currencySymbol = (code: string) =>
  currencies[code.toLowerCase()].symbol;

export const currency = (c: FiatCurrency | undefined): Currency => {
  if (!c) return currencies.eur;
  switch (c) {
    case FiatCurrency.EUR:
      return currencies.eur;
    case FiatCurrency.GBP:
      return currencies.gbp;
    default:
      return currencies.usd;
  }
};

export const divideFiat = (fiat: Fiat, divider: number) => {
  return {
    ...fiat,
    eur: fiat.eur / divider,
    usd: fiat.usd / divider,
    gbp: fiat.gbp / divider,
  };
};

export const multiplyFiat = (fiat: Fiat, multiplier: number) => {
  return {
    ...fiat,
    eur: fiat.eur * multiplier,
    usd: fiat.usd * multiplier,
    gbp: fiat.gbp * multiplier,
  };
};

export const getFaCurrencySymbol = (fiatCurrency?: FiatCurrency) => {
  switch (fiatCurrency) {
    case FiatCurrency.EUR:
      return faEuroSign;
    case FiatCurrency.USD:
      return faDollar;
    case FiatCurrency.GBP:
      return faSterlingSign;
    default:
      return faDollar;
  }
};

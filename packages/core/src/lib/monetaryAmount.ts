import { TypedDocumentNode, gql } from '@apollo/client';
import BigNumber from 'bignumber.js';

import { FiatCurrency, SupportedCurrency } from '__generated__/globalTypes';

import { MonetaryAmountFragment_monetaryAmount } from './__generated__/monetaryAmount.graphql';
import { CurrencyCode } from './fiat';

const ETH_IN_WEI = new BigNumber('1000000000000000000');
const ETH_PRECISION = 4;

const currencies = ['eur', 'usd', 'gbp', 'wei'] as const;
export type MonetaryAmountCurrency = (typeof currencies)[number];

const fiatCurrencies = ['eur', 'usd', 'gbp'] as const;
export type MonetaryAmountFiatCurrency = (typeof fiatCurrencies)[number];

type Rates = {
  eur: number;
  usd: number;
  gbp: number;
};

export interface MonetaryAmountParams {
  referenceCurrency: SupportedCurrency;
  eur?: number | string | null;
  usd?: number | string | null;
  gbp?: number | string | null;
  wei?: string | null;
}

export const getMonetaryAmountIndex = (
  currency: SupportedCurrency | FiatCurrency | CurrencyCode
) => {
  return currency.toLowerCase() as MonetaryAmountCurrency;
};

export const getFiatMonetaryAmountIndex = (
  currency: FiatCurrency | CurrencyCode
) => {
  return currency.toLowerCase() as MonetaryAmountFiatCurrency;
};

class MonetaryAmount {
  public static convert(
    referenceCurrency: MonetaryAmountCurrency,
    referenceAmount: BigNumber,
    currency: MonetaryAmountCurrency,
    rates: Rates
  ): BigNumber {
    if (referenceCurrency === currency) return referenceAmount;

    if (referenceCurrency === 'wei') {
      return referenceAmount
        .dividedBy(ETH_IN_WEI)
        .multipliedBy(MonetaryAmount.rate(referenceCurrency, currency, rates))
        .decimalPlaces(0, BigNumber.ROUND_HALF_UP);
    }
    if (currency === 'wei') {
      return referenceAmount
        .multipliedBy(MonetaryAmount.rate(referenceCurrency, currency, rates))
        .decimalPlaces(ETH_PRECISION, BigNumber.ROUND_HALF_UP)
        .multipliedBy(ETH_IN_WEI);
    }

    return referenceAmount
      .multipliedBy(MonetaryAmount.rate(referenceCurrency, currency, rates))
      .decimalPlaces(0, BigNumber.ROUND_HALF_UP);
  }

  public static rate(
    referenceCurrency: MonetaryAmountCurrency,
    currency: MonetaryAmountCurrency,
    rates: Rates
  ) {
    if (referenceCurrency === 'wei') {
      return new BigNumber(rates[currency as keyof Rates]).multipliedBy(100);
    }
    if (currency === 'wei') {
      return new BigNumber(1)
        .dividedBy(rates[referenceCurrency])
        .dividedBy(100);
    }

    return new BigNumber(rates[currency] / rates[referenceCurrency]);
  }

  private referenceCurrency: MonetaryAmountCurrency;

  private eur: BigNumber | null;

  private usd: BigNumber | null;

  private gbp: BigNumber | null;

  private wei: BigNumber | null;

  constructor(params: MonetaryAmountParams) {
    this.referenceCurrency =
      params.referenceCurrency.toLowerCase() as MonetaryAmountCurrency;
    this.eur = params.eur != null ? new BigNumber(params.eur) : null;
    this.usd = params.usd != null ? new BigNumber(params.usd) : null;
    this.gbp = params.gbp != null ? new BigNumber(params.gbp) : null;
    this.wei = !params.wei ? null : new BigNumber(params.wei);

    if (!this.referenceValue) {
      throw new Error('Reference currency is required');
    }

    currencies.forEach(currency => {
      if (this[currency]?.isNaN()) {
        throw new Error(
          `Invalid ${currency} value (received: ${params[currency]})`
        );
      }
    });
  }

  public inCurrencies(rates: Rates) {
    return {
      eur: this.inCurrency('eur', rates) as number,
      usd: this.inCurrency('usd', rates) as number,
      gbp: this.inCurrency('gbp', rates) as number,
      wei: this.inCurrency('wei', rates) as string,
    };
  }

  public inCurrency(
    currency: MonetaryAmountCurrency,
    rates: Rates
  ): string | number {
    if (this[currency]) {
      if (currency === 'wei') return this[currency]!.toString();

      return this[currency]!.toNumber();
    }

    const value = this.bigValueAbove(currency, rates);

    return currency === 'wei' ? value.toString() : value.toNumber();
  }

  private bigValueAbove(
    currency: MonetaryAmountCurrency,
    rates: Rates,
    value?: BigNumber
  ): BigNumber {
    const bigValue = value || this.convert(currency, rates);
    const bigValueInReferenceCurrency = MonetaryAmount.convert(
      currency,
      bigValue,
      this.referenceCurrency,
      rates
    );

    if (
      bigValueInReferenceCurrency.isGreaterThanOrEqualTo(this.referenceValue)
    ) {
      return bigValue;
    }

    const step =
      currency === 'wei'
        ? new BigNumber(ETH_IN_WEI).dividedBy(10 ** ETH_PRECISION)
        : 1;

    const bigValuePlus = bigValue.plus(step);

    return this.bigValueAbove(currency, rates, bigValuePlus);
  }

  private convert(currency: MonetaryAmountCurrency, rates: Rates) {
    return MonetaryAmount.convert(
      this.referenceCurrency,
      this.referenceValue,
      currency,
      rates
    );
  }

  private get referenceValue() {
    return this[this.referenceCurrency]!;
  }
}

export const monetaryAmountFragment = gql`
  fragment MonetaryAmountFragment_monetaryAmount on MonetaryAmount {
    eur
    usd
    gbp
    wei
    referenceCurrency
  }
` as TypedDocumentNode<MonetaryAmountFragment_monetaryAmount>;

export default MonetaryAmount;

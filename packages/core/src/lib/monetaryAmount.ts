import BigNumber from 'bignumber.js';

import { SupportedCurrency } from '__generated__/globalTypes';

const ETH_IN_WEI = new BigNumber('1000000000000000000');
const ETH_PRECISION = 4;

type Currency = 'eur' | 'usd' | 'gbp' | 'wei';

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

class MonetaryAmount {
  public static convert(
    referenceCurrency: Currency,
    referenceAmount: BigNumber,
    currency: Currency,
    rates: Rates
  ): BigNumber {
    if (referenceCurrency === currency) return referenceAmount;

    if (referenceCurrency === 'wei') {
      return referenceAmount
        .dividedBy(ETH_IN_WEI)
        .multipliedBy(MonetaryAmount.rate(referenceCurrency, currency, rates))
        .decimalPlaces(0);
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
    referenceCurrency: Currency,
    currency: Currency,
    rates: Rates
  ) {
    if (referenceCurrency === 'wei') {
      return new BigNumber(
        rates[currency as 'eur' | 'usd' | 'gbp']
      ).multipliedBy(100);
    }
    if (currency === 'wei') {
      return new BigNumber(1)
        .dividedBy(rates[referenceCurrency])
        .dividedBy(100);
    }

    return new BigNumber(rates[currency] / rates[referenceCurrency]);
  }

  private referenceCurrency: Currency;

  private eur: BigNumber | null;

  private usd: BigNumber | null;

  private gbp: BigNumber | null;

  private wei: BigNumber | null;

  constructor(params: MonetaryAmountParams) {
    this.referenceCurrency = params.referenceCurrency.toLowerCase() as Currency;
    this.eur = !params.eur ? null : new BigNumber(params.eur);
    this.usd = !params.usd ? null : new BigNumber(params.usd);
    this.gbp = !params.gbp ? null : new BigNumber(params.gbp);
    this.wei = !params.wei ? null : new BigNumber(params.wei);

    if (!this.referenceValue) {
      throw new Error('Reference currency is required');
    }
  }

  public inCurrencies(rates: Rates) {
    return {
      eur: this.inCurrency('eur', rates) as number,
      usd: this.inCurrency('usd', rates) as number,
      gbp: this.inCurrency('gbp', rates) as number,
      wei: this.inCurrency('wei', rates) as string,
    };
  }

  public inCurrency(currency: Currency, rates: Rates): string | number {
    if (this[currency]) {
      if (currency === 'wei') return this[currency]!.toString();

      return this[currency]!.toNumber();
    }

    const value = this.bigValueAbove(currency, rates);

    return currency === 'wei' ? value.toString() : value.toNumber();
  }

  private bigValueAbove(
    currency: Currency,
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

  private convert(currency: Currency, rates: Rates) {
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

export default MonetaryAmount;

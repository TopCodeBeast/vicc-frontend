import Big from 'bignumber.js';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import { MonetaryAmountOutput } from '@sorare/core/src/hooks/useMonetaryAmount';

type Props = {
  monetaryAmount: MonetaryAmountOutput;
  referenceCurrency: SupportedCurrency;
  feesRate: number;
};
export const useCalculateFees = ({ monetaryAmount, feesRate }: Props) => {
  const feesMonetaryAmount = {
    eur: monetaryAmount.eur * feesRate,
    usd: monetaryAmount.usd * feesRate,
    gbp: monetaryAmount.gbp * feesRate,
    wei: new Big(monetaryAmount.wei).multipliedBy(feesRate).toString(),
  };
  const youReceiveMonetaryAmount = {
    eur: monetaryAmount.eur - feesMonetaryAmount.eur,
    usd: monetaryAmount.usd - feesMonetaryAmount.usd,
    gbp: monetaryAmount.gbp - feesMonetaryAmount.gbp,
    wei: new Big(monetaryAmount.wei).minus(feesMonetaryAmount.wei).toString(),
  };

  return {
    feesMonetaryAmount,
    youReceiveMonetaryAmount,
  };
};

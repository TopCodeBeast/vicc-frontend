import Big from 'bignumber.js';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import useMonetaryAmount, {
  MonetaryAmountOutput,
} from '@sorare/core/src/hooks/useMonetaryAmount';
import { getMonetaryAmountIndex } from '@sorare/core/src/lib/monetaryAmount';

import FeesTooltipFromProps from '../FeesTooltipFromProps';

interface Props {
  monetaryAmount: MonetaryAmountOutput;
  referenceCurrency: SupportedCurrency;
  feesRate: number;
}

const CalculatedFeesTooltip = ({
  monetaryAmount,
  referenceCurrency,
  feesRate,
}: Props) => {
  const { toMonetaryAmount } = useMonetaryAmount();
  const indexRefCurrency = getMonetaryAmountIndex(referenceCurrency);

  const marketFeeAmount = new Big(
    monetaryAmount[indexRefCurrency]
  ).multipliedBy(feesRate);

  const marketFeeMonetaryAmount = toMonetaryAmount({
    [indexRefCurrency]: marketFeeAmount.toString(),
    referenceCurrency,
  });
  return (
    <FeesTooltipFromProps
      monetaryAmount={monetaryAmount}
      marketFeeMonetaryAmount={marketFeeMonetaryAmount}
      referenceCurrency={referenceCurrency}
    />
  );
};

export default CalculatedFeesTooltip;

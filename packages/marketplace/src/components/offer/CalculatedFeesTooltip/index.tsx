import { Currency, Fiat } from '@sorare/core/src/__generated__/globalTypes';

import useFormatWithCurrency from '@sorare/marketplace/src/hooks/useFormatWithCurrency';

import FeesTooltipFromProps from '../FeesTooltipFromProps';

interface Props {
  priceWei: string;
  priceFiat?: Fiat;
  feesRate: number;
  forceEthDisplay?: boolean;
}

const CalculatedFeesTooltip = ({
  priceWei,
  feesRate,
  priceFiat,
  forceEthDisplay,
}: Props) => {
  const {
    amountToDisplay,
    currencySymbol,
    minimumFractionDigits,
    maximumFractionDigits,
  } = useFormatWithCurrency(
    priceWei,
    priceFiat,
    forceEthDisplay ? Currency.ETH : undefined
  );
  const feesToDisplay = amountToDisplay * feesRate;

  return (
    <FeesTooltipFromProps
      amount={amountToDisplay}
      fees={feesToDisplay}
      currencySymbol={currencySymbol}
      minimumFractionDigits={minimumFractionDigits}
      maximumFractionDigits={maximumFractionDigits}
    />
  );
};

export default CalculatedFeesTooltip;

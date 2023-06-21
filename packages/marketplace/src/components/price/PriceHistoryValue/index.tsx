import { FormattedNumber } from 'react-intl';

import { Currency, Fiat } from '@sorare/core/src/__generated__/globalTypes';

import useFormatWithCurrency from '@marketplace/hooks/useFormatWithCurrency';

const PriceHistoryValue = ({
  amount,
  amountInFiat,
  currency,
}: {
  amount: string;
  amountInFiat: Fiat;
  currency?: Currency;
}) => {
  const {
    amountToDisplay,
    currencySymbol,
    minimumFractionDigits,
    maximumFractionDigits,
  } = useFormatWithCurrency(amount, amountInFiat, currency);
  return (
    <FormattedNumber
      value={amountToDisplay}
      // eslint-disable-next-line react/style-prop-object
      style="currency"
      currency={currencySymbol}
      maximumFractionDigits={maximumFractionDigits}
      minimumFractionDigits={minimumFractionDigits}
    />
  );
};

export default PriceHistoryValue;

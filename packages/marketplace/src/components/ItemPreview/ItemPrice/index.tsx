import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import { AmountWithConversion } from '@sorare/core/src/components/buyActions/AmountWithConversion';

const ItemPrice = ({
  amount,
  referenceCurrency,
}: {
  amount: string | number;
  referenceCurrency: SupportedCurrency;
}) => {
  return (
    <AmountWithConversion
      monetaryAmount={{
        referenceCurrency,
        [referenceCurrency.toLowerCase()]: amount,
      }}
    />
  );
};

export default ItemPrice;

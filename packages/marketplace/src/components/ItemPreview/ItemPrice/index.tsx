import AmountWithConversion from '@sorare/core/src/components/buyActions/AmountWithConversion';

const ItemPrice = ({ wei }: { wei: string }) => {
  return <AmountWithConversion context="ItemPrice" amount={wei} unit="wei" />;
};

export default ItemPrice;

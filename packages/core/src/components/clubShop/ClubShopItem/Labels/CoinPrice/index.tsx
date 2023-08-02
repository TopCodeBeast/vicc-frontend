import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Text14 } from '@core/atoms/typography';
import CoinAmount from '@core/components/clubShop/CoinAmount';

const FlexContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--unit);
`;

const Text = styled(Text14)`
  text-decoration: line-through;
`;

const OldCoinPrice = ({ value }: { value: number }) => {
  const { formatNumber } = useIntl();
  return <Text color="var(--c-neutral-500)">{formatNumber(value)}</Text>;
};

type Props = {
  price: number;
  salePrice: number | null;
};

export const CoinPrice = ({ price, salePrice }: Props) => {
  const currentPrice = salePrice ?? price;
  return (
    <FlexContainer>
      <CoinAmount amount={currentPrice} />
      {currentPrice !== price && <OldCoinPrice value={price} />}
    </FlexContainer>
  );
};

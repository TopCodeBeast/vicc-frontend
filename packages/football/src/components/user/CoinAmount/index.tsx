import { useIntl } from 'react-intl';
import styled from 'styled-components';

import Coin from '@sorare/core/src/atoms/icons/Coin';
import { Text14 } from '@sorare/core/src/atoms/typography';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;
const Amount = styled(Text14)`
  color: var(--c-neutral-600);
  font-weight: bold;
`;

type Props = {
  amount: number;
  color?: 'white' | 'black';
};
export const CoinAmount = (props: Props) => {
  const { formatNumber } = useIntl();
  const { amount, color } = props;

  return (
    <Root className={color}>
      <Coin />
      <Amount>{formatNumber(amount)}</Amount>
    </Root>
  );
};

export default CoinAmount;

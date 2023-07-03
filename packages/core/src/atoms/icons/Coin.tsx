import styled from 'styled-components';

import coin from '@core/assets/coin.png';

const Img = styled.img`
  width: var(--double-unit);
  height: var(--double-unit);
`;
const Coin = () => {
  return <Img src={coin} alt="Coin" />;
};

export default Coin;

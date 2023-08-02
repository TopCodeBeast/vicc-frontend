import styled from 'styled-components';

import { FiatWalletIcon } from '@core/components/fiatWallet/FiatWalletIcon';

const Wrapper = styled.div`
  width: 120px;
  padding-bottom: var(--quadruple-unit);
  position: relative;

  &:after {
    content: '';
    width: 80%;
    left: 10%;
    position: absolute;
    bottom: 0;
    box-shadow: 0px 0px 20px 4px rgba(0, 0, 0, 1);
  }

  img {
    max-width: 100%;
  }
`;

export const StaticCashBalance = () => {
  return (
    <Wrapper>
      <FiatWalletIcon />
    </Wrapper>
  );
};

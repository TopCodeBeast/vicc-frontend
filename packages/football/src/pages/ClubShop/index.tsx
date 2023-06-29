import styled from 'styled-components';

import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import Header from './Header';
import Tabs from './Tabs';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
  flex: 1;
  overflow: hidden;
  background: var(--c-neutral-100);
  @media ${laptopAndAbove} {
    gap: 0;
  }
`;

export const ClubShop = () => {
  return (
    <Root>
      <Header />
      <Tabs />
    </Root>
  );
};

export default ClubShop;

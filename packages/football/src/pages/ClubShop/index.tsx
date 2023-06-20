import styled from 'styled-components';

import { theme } from '@sorare/core/src/style/theme';

import Header from './Header';
import Tabs from './Tabs';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
  flex: 1;
  overflow: hidden;
  background: var(--c-neutral-100);
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
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

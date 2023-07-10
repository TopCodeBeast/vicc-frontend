import { FC } from 'react';
import styled from 'styled-components';

import HandledErrorBoundary from '@sorare/core/src/routing/HandledErrorBoundary';
import MultiSportAppBar from '@sorare/core/src/routing/MultiSportAppBar';
import MultiSportBottomNavBar from '@sorare/core/src/routing/MultiSportBottomNavBar';
import MultiSportFooter from '@sorare/core/src/routing/MultiSportFooter';

// import UnclaimedRewards from '@football/routing/AppBar/UnclaimedRewards';

const Root = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;
const Body = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  background-color: var(--c-neutral-100);
`;

export const Layout: FC = ({ children }) => {
  return (
    <Root>
      <MultiSportAppBar unclaimedRewards={<>UnclaimedRewards555</>} />
      <HandledErrorBoundary>
        <Body>{children}</Body>
      </HandledErrorBoundary>
      <MultiSportFooter />
      <MultiSportBottomNavBar />
    </Root>
  );
};

export default Layout;

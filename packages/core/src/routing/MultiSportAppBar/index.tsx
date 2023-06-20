import { ReactNode } from 'react';
import styled from 'styled-components';

import { Container } from '@sorare/core/src/atoms/container';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { lazy } from '@sorare/core/src/lib/retry';

// eslint-disable-next-line import/no-useless-path-segments
import AppBarProvider from '../MultiSportAppBar/context/Provider';
import AppBarAtom from './AppBar';
import LoggedOutAppBar from './LoggedOutAppBar';
import { useAppBarContext } from './context';

const LoggedInAppBar = lazy(async () => import('./LoggedInAppBar'));

const AppBarAtomWrapper = styled(AppBarAtom)`
  display: flex;
  flex-direction: column;
  flex-direction: column-reverse;
`;

type Props = {
  unclaimedRewards?: ReactNode;
  color?: 'transparent';
};
const Root = ({ color, unclaimedRewards }: Props) => {
  const { currentUser } = useCurrentUserContext();
  const { closeMenu } = useAppBarContext();

  return (
    <AppBarAtomWrapper color={color} onMouseLeave={closeMenu}>
      <div id="substicky-bar-portal" />
      <Container>
        {currentUser ? (
          <LoggedInAppBar unclaimedReward={unclaimedRewards} />
        ) : (
          <LoggedOutAppBar />
        )}
      </Container>
    </AppBarAtomWrapper>
  );
};

const MultiSportAppBar = (props: Props) => (
  <AppBarProvider>
    <Root {...props} />
  </AppBarProvider>
);

export default MultiSportAppBar;

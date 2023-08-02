import classNames from 'classnames';
import { ReactNode, Suspense } from 'react';
import styled from 'styled-components';

import { FootballField } from '@core/atoms/icons/FootballField';
import { Jersey } from '@core/atoms/icons/Jersey';
import { Market } from '@core/atoms/icons/Market';
import {
  APP_BAR_DESKTOP_WIDTH,
  AppNavigation,
} from '@core/components/navigation//AppNavigation';
import { AppHeader } from '@core/components/navigation/AppHeader';
import Avatar from '@core/components/user/Avatar';
import {
  FOOTBALL_LIVE,
  FOOTBALL_MARKET,
  FOOTBALL_MY_CLUB,
  FOOTBALL_PLAY,
} from '@core/constants/routes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import useIsLoggedIn from '@core/hooks/auth/useIsLoggedIn';
import toLayoutRouteComponent from '@core/lib/navigation/toLayoutRouteComponent';
import { tabletAndAbove } from '@core/style/mediaQuery';

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column-reverse;
  @media ${tabletAndAbove} {
    flex-direction: row;
  }
`;

const MainWrapper = styled.div`
  flex: 1;
  @media ${tabletAndAbove} {
    &.isLoggedIn {
      max-width: calc(100vw - ${APP_BAR_DESKTOP_WIDTH}px);
      overflow: hidden;
    }
  }
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  background-color: var(--c-neutral-100);
  z-index: 3;
`;

export const Content = styled.main`
  flex: 1;
`;

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useCurrentUserContext();
  const isLoggedIn = useIsLoggedIn();
  const { unclaimedSo5Rewards } = currentUser || {};
  return (
    <Wrapper>
      {isLoggedIn && (
        <AppNavigation
          navItems={[
            {
              label: 'Play',
              to: FOOTBALL_PLAY,
              icon: <FootballField />,
            },
            {
              label: 'Market',
              to: FOOTBALL_MARKET,
              icon: <Market />,
            },
            { label: 'Live', to: FOOTBALL_LIVE, icon: <Jersey /> },
            {
              label: 'My Club',
              to: FOOTBALL_MY_CLUB,
              icon: currentUser && (
                <Avatar user={currentUser} rounded variant="small" />
              ),
              badge: unclaimedSo5Rewards?.length,
            },
          ]}
        />
      )}
      <MainWrapper className={classNames({ isLoggedIn })}>
        <Header>
          <AppHeader />
        </Header>
        <Content>
          <Suspense fallback={null}>{children}</Suspense>
        </Content>
      </MainWrapper>
    </Wrapper>
  );
};

export const AppLayoutRouteComponent = toLayoutRouteComponent(AppLayout);

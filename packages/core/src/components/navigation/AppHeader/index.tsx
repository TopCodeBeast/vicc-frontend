import { useIntl } from 'react-intl';
import styled from 'styled-components';

import Coin from '@core/atoms/icons/Coin';
import { Text14 } from '@core/atoms/typography';
import Notifications from '@core/components/notification/Notifications';
import ResponsiveSearchBar from '@core/components/search/ResponsiveSearchBar';
import { FOOTBALL_CLUB_SHOP } from '@core/constants/routes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import useIsLoggedIn from '@core/hooks/auth/useIsLoggedIn';
import { useIsDesktop } from '@core/hooks/device/useIsDesktop';
import { Link } from '@core/routing/Link';
import { Balances } from '@core/routing/MultiSportAppBar/Balances';
import AppBarProvider from '@core/routing/MultiSportAppBar/context/Provider';
import { tabletAndAbove } from '@core/style/mediaQuery';

import { AppContent } from '../AppContent';
import { ProfileDrawer } from '../ProfileDrawer';
import { LoggedOutAppHeader } from './LoggedOutAppHeader';

const Wrapper = styled(AppContent)`
  height: 100%;
  gap: var(--unit);
  padding: var(--unit) var(--double-unit);
  display: grid;
  grid-template-areas:
    'profile-button icon-buttons'
    'title title';
  grid-template-columns: 1fr max-content;
  @media ${tabletAndAbove} {
    grid-template-areas: 'title icon-buttons';
  }
`;

const IconButtons = styled.div`
  grid-area: icon-buttons;
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

const PageHeaderTitle = styled.div`
  grid-area: title;
`;

const ProfileButton = styled.div`
  grid-area: profile-button;
`;

const CoinAmountWrapper = styled(Link)`
  border-radius: var(--triple-unit);
  background: var(--c-neutral-300);
  padding: var(--unit) var(--intermediate-unit);
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;

const Amount = styled(Text14)`
  font-weight: bold;
`;

export const AppHeader = () => {
  const isLoggedIn = useIsLoggedIn();
  const isDesktop = useIsDesktop();
  const { currentUser } = useCurrentUserContext();
  const { formatNumber } = useIntl();

  return isLoggedIn ? (
    <Wrapper>
      <PageHeaderTitle id="page-header-title" />
      {!isDesktop && (
        <ProfileButton>
          <ProfileDrawer />
        </ProfileButton>
      )}
      <IconButtons>
        <CoinAmountWrapper to={FOOTBALL_CLUB_SHOP}>
          <Coin />
          <Amount>{formatNumber(currentUser?.coinBalance || 0)}</Amount>
        </CoinAmountWrapper>
        <Balances medium compact={!isDesktop} />
        <AppBarProvider>
          <ResponsiveSearchBar />
          <Notifications />
        </AppBarProvider>
      </IconButtons>
    </Wrapper>
  ) : (
    <LoggedOutAppHeader />
  );
};

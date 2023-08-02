import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Button } from '@core/atoms/buttons/Button';
import { HomeLink } from '@core/atoms/navigation/HomeLink';
import ResponsiveSearchBar from '@core/components/search/ResponsiveSearchBar';
import { useConnectionContext } from '@core/contexts/connection';
import useEvents from '@core/lib/events/useEvents';
import { glossary } from '@core/lib/glossary';
import AppBarProvider from '@core/routing/MultiSportAppBar/context/Provider';
import { tabletAndAbove } from '@core/style/mediaQuery';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  gap: var(--unit);
  padding: var(--unit) var(--double-unit);
  @media ${tabletAndAbove} {
    padding: var(--unit) var(--quadruple-unit);
  }
`;

const LogoWrapper = styled.div`
  flex: 1;
`;

export const LoggedOutAppHeader = () => {
  const track = useEvents();
  const { signIn, signUp } = useConnectionContext();
  const onSignUpClick = useCallback(() => {
    track('Click Sign Up', {});
    signUp();
  }, [signUp, track]);
  return (
    <Wrapper>
      <LogoWrapper>
        <HomeLink withStarball />
      </LogoWrapper>
      <AppBarProvider>
        <ResponsiveSearchBar />
      </AppBarProvider>
      <Button medium color="white" onClick={onSignUpClick}>
        <FormattedMessage {...glossary.signup} />
      </Button>
      <Button medium color="blue" onClick={signIn}>
        <FormattedMessage {...glossary.signin} />
      </Button>
    </Wrapper>
  );
};

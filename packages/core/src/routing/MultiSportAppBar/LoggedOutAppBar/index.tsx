import { useCallback } from 'react';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { HomeLink } from '@sorare/core/src/atoms/navigation/HomeLink';
import ResponsiveSearchBar from 'components/search/ResponsiveSearchBar';
import { useConnectionContext } from 'contexts/connection';
import { useIntlContext } from 'contexts/intl';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { glossary } from '@sorare/core/src/lib/glossary';
import { theme } from '@sorare/core/src/style/theme';

const Wrapper = styled.div`
  height: var(--navbar-height-mobile);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--unit);

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    padding: 0;
    height: var(--navbar-height-desktop);
  }
`;

const Actions = styled.div`
  display: flex;
  gap: var(--unit);
`;

const LoggedOutAppBar = () => {
  const track = useEvents();
  const { signIn, signUp } = useConnectionContext();
  const { formatMessage } = useIntlContext();

  const onSignUpClick = useCallback(() => {
    track('Click Sign Up', {});
    signUp();
  }, [signUp, track]);

  return (
    <Wrapper>
      <HomeLink withStarball />
      <Actions>
        <ResponsiveSearchBar />
        <Button medium color="white" onClick={onSignUpClick}>
          {formatMessage(glossary.signup)}
        </Button>
        <Button medium color="blue" onClick={signIn}>
          {formatMessage(glossary.signin)}
        </Button>
      </Actions>
    </Wrapper>
  );
};

export default LoggedOutAppBar;

import { useCallback } from 'react';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { HomeLink } from '@core/atoms/navigation/HomeLink';
import ResponsiveSearchBar from '@core/components/search/ResponsiveSearchBar';
// import { useConnectionContext } from '@core/contexts/connection';
import { useIntlContext } from '@core/contexts/intl';
import useEvents from '@core/lib/events/useEvents';
import { glossary } from '@core/lib/glossary';
import { tabletAndAbove } from '@core/style/mediaQuery';

const Wrapper = styled.div`
  height: var(--navbar-height-mobile);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--unit);

  @media ${tabletAndAbove} {
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
  // const { signIn, signUp } = useConnectionContext();
  const { formatMessage } = useIntlContext();

  const onSignUpClick = useCallback(() => {
    track('Click Sign Up', {});
    // signUp();
  }, [/*signUp,*/ track]);

  return (
    <Wrapper>
      <HomeLink withStarball />
      <Actions>
        <ResponsiveSearchBar />
        <Button medium color="white" onClick={onSignUpClick}>
          {formatMessage(glossary.signup)}
        </Button>
        <Button medium color="blue" onClick={() => console.log('signIn5555555555555')}>
          {formatMessage(glossary.signin)}
        </Button>
      </Actions>
    </Wrapper>
  );
};

export default LoggedOutAppBar;

import { ReactNode, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { SorareLogo } from '@sorare/core/src/atoms/icons/SorareLogo';
import Container from '@sorare/core/src/atoms/layout/Container';
import SmallerStarBall from '@sorare/core/src/atoms/navigation/SmallerStarBall';
import { LANDING } from '@sorare/core/src/constants/routes';
import { useConnectionContext } from 'contexts/connection';
import { useEventsContext } from 'contexts/events';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { glossary } from '@sorare/core/src/lib/glossary';

const Wrapper = styled.div`
  display: flex;
  height: 80px;
  justify-content: space-between;
  align-items: center;
  padding: var(--double-unit) 0;
  border-bottom: 1px solid var(--c-static-neutral-400);
`;

const Actions = styled.div`
  display: flex;
  gap: var(--unit);
`;

const Logo = styled(Link)`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;

const Divider = styled.div`
  width: 1px;
  height: 1em;
  margin: 0 var(--unit);
  background-color: var(--c-static-neutral-100);
`;

interface Props {
  title: string;
  logo: ReactNode;
  hideSorareLogo?: boolean;
}

const LoggedOutAppBarWithLogo = ({ title, logo, hideSorareLogo }: Props) => {
  const { track } = useEventsContext();
  const { signIn, signUp } = useConnectionContext();
  const { up: isTablet } = useScreenSize('tablet');

  const onSignUpClick = useCallback(() => {
    track('Click Sign Up');
    signUp();
  }, [signUp, track]);

  return (
    <Container>
      <Wrapper>
        <Logo to={LANDING} title={title}>
          {(!hideSorareLogo || !isTablet) && <SmallerStarBall />}
          {isTablet && (
            <>
              {!hideSorareLogo && (
                <>
                  <SorareLogo />
                  <Divider />
                </>
              )}
              {logo}
            </>
          )}
        </Logo>
        <Actions>
          <Button medium color="dark" onClick={onSignUpClick}>
            <FormattedMessage {...glossary.signup} />
          </Button>
          <Button medium color="transparent" onClick={signIn}>
            <FormattedMessage {...glossary.signin} />
          </Button>
        </Actions>
      </Wrapper>
    </Container>
  );
};

export default LoggedOutAppBarWithLogo;

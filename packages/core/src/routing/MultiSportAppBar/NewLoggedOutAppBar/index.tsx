import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { animated, useSpring } from '@react-spring/web';
import styled from 'styled-components';

import footballLogo from '@core/assets/logos/football/main.svg';
import mlbLogo from '@core/assets/logos/mlb/mlb.svg';
import nbaLogo from '@core/assets/logos/nba/nba.svg';
import Button from '@core/atoms/buttons/Button';
import { SorareLogo } from '@core/atoms/icons/SorareLogo';
import { LinkOther } from '@core/atoms/navigation/Box';
import SmallerStarBall from '@core/atoms/navigation/SmallerStarBall';
import { useHeroAnimationTimings } from '@core/components/landing/NewLandingMultiSport/utils';
// import ResponsiveSearchBar from '@core/components/search/ResponsiveSearchBar';
import { FOOTBALL_PATH, LANDING, MLB_PATH, NBA_PATH } from '@core/constants/routes';
// import { useConnectionContext } from '@core/contexts/connection';
// import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useIntlContext } from '@core/contexts/intl';
import useScreenSize from '@core/hooks/device/useScreenSize';
// import useEvents from '@core/lib/events/useEvents';
import { glossary, sportsLabelsMessages } from '@core/lib/glossary';
import { laptopAndAbove, tabletAndAbove } from '@core/style/mediaQuery';

export const Container = styled.div`
  z-index: 2;
  width: 100vw;
  position: fixed;
  isolation: isolate;
  height: var(--navbar-height-mobile);
`;

const DarkBackground = styled.div`
  z-index: 1;
  height: 100%;
  position: relative;
  background-color: transparent;

  transition: background-color 0.75s ease-in-out;

  &.bgBlack {
    background-color: black;
  }
`;

const Wrapper = styled.div`
  z-index: 1;
  position: relative;
  margin: auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: min(calc(var(--unit) * 165), 100%);
  padding: 0 var(--double-unit);

  background-color: transparent;
  transition: background-color 0.75s ease-in-out;
`;

const SportsLinks = styled.div`
  display: flex;
  gap: var(--triple-unit);
`;

const Actions = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;

const ResponsiveSorareLogo = styled(SorareLogo)`
  display: none;
  @media ${tabletAndAbove} {
    display: block;
  }
`;

const Logo = styled(Link)`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;

const ButtonWrapper = styled(animated.div)`
  display: flex;
  gap: var(--unit);
`;

const SportButton = styled.a`
  display: flex;
  font-weight: bold;
  gap: var(--unit);
  align-items: center;
  padding: var(--unit) var(--unit) var(--unit) var(--double-unit);
  cursor: pointer;
  border-radius: var(--unit);
  background-color: transparent;

  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: var(--c-neutral-800);
  }

  & > img {
    width: var(--logo-width);
  }

  @media ${laptopAndAbove} {
    padding: var(--half-unit) var(--unit) var(--half-unit) var(--double-unit);

    & > img {
      width: 0;
      opacity: 0;
      transition: width 0.25s ease-in-out, opacity 0.25s ease-in-out;
    }

    &:hover {
      & > img {
        opacity: 1;
        width: var(--logo-width);
        margin-right: var(--unit);
      }
    }
  }
`;

const AnimatedButton = styled(Button)`
  transition: all 0.75s ease-in-out;
  /* Need to define a default value for the animation to work */
  border: 1px solid transparent;
`;

const MobileSportsBanner = styled.div`
  bottom: 0;
  width: 100vw;
  display: flex;
  position: absolute;
  background-color: black;
  transform: translateY(0%);
  justify-content: space-evenly;
  grid-template-columns: repeat(3, 1fr);
  will-change: transform;

  transition: all 0.5s ease-in-out;
  opacity: 0;

  @media ${tabletAndAbove} {
    justify-content: center;
    gap: calc(var(--unit) * 7);
  }

  &.translate {
    opacity: 1;
    transform: translateY(100%);
  }
`;

const LoggedOutAppBar = () => {
  // const track = useEvents();
  const currentUser = undefined;// const { currentUser } = useCurrentUserContext();
  // const { signIn, signUp } = useConnectionContext();
  const { formatMessage } = useIntlContext();
  const { secondBatch } = useHeroAnimationTimings();
  const { up: isDesktop } = useScreenSize('laptop');
  const [isVisible, setIsVisible] = useState(true);
  const prevScrollPos = useRef(0); // use useRef instead of useState

  // const onSignUpClick = useCallback(() => {
  //   track('Click Sign Up', {});
  //   signUp();
  // }, [signUp, track]);

  // const onSignInClick = useCallback(() => {
  //   track('Click Sign In');
  //   signIn();
  // }, [signIn, track]);

  const logoFadeIn = useSpring({
    opacity: secondBatch ? 1 : 0,
    config: { duration: 750 },
  });

  const buttonsSlide = useSpring({
    x: secondBatch ? 0 : -100,
    config: { duration: 500 },
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const visible = prevScrollPos.current > currentScrollPos;

      if (visible !== isVisible) setIsVisible(visible);
      prevScrollPos.current = currentScrollPos;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible]);

  const SportsButtons = () => {
    return (
      <>
        <LinkOther
          as={SportButton}
          href={FOOTBALL_PATH}
          style={{ '--logo-width': '20px' }}
        >
          {formatMessage(sportsLabelsMessages.CRICKET)}
          <img
            src={footballLogo}
            alt={formatMessage(sportsLabelsMessages.CRICKET)}
          />
        </LinkOther>
        <LinkOther
          as={SportButton}
          href={NBA_PATH}
          style={{ '--logo-width': '10px' }}
        >
          {formatMessage(sportsLabelsMessages.NBA)}
          <img src={nbaLogo} alt={formatMessage(sportsLabelsMessages.NBA)} />
        </LinkOther>
        <LinkOther
          as={SportButton}
          href={MLB_PATH}
          style={{ '--logo-width': '30px' }}
        >
          {formatMessage(sportsLabelsMessages.BASEBALL)}
          <img
            src={mlbLogo}
            alt={formatMessage(sportsLabelsMessages.BASEBALL)}
          />
        </LinkOther>
      </>
    );
  };

  return (
    <Container>
      <DarkBackground className={classNames({ bgBlack: secondBatch })}>
        <Wrapper>
          <SportsLinks>
            <Logo to={LANDING} title="Sorare">
              <SmallerStarBall />
              <animated.div style={logoFadeIn}>
                <ResponsiveSorareLogo />
              </animated.div>
            </Logo>
            {isDesktop && (
              <ButtonWrapper style={buttonsSlide}>
                <SportsButtons />
              </ButtonWrapper>
            )}
          </SportsLinks>
          <Actions>
            {/* <ResponsiveSearchBar /> */}
            <AnimatedButton
              small
              color={secondBatch ? 'blue' : 'transparent'}
              onClick={() => console.log('onSignUpClick')}
            >
              {formatMessage(glossary.signup)}
            </AnimatedButton>
            <AnimatedButton
              small
              color={secondBatch ? 'white' : 'transparent'}
              stroke={secondBatch}
              onClick={() => console.log('onSignInClick')}
            >
              {formatMessage(glossary.signin)}
            </AnimatedButton>
          </Actions>
        </Wrapper>
      </DarkBackground>
      {!isDesktop && !currentUser && (
        <MobileSportsBanner
          className={classNames({
            translate: secondBatch && isVisible,
          })}
        >
          <SportsButtons />
        </MobileSportsBanner>
      )}
    </Container>
  );
};

export default LoggedOutAppBar;

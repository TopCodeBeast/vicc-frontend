import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { animated, config, useSpring } from 'react-spring';
import shuffle from 'shuffle-array';
import styled from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import { BackgroundAnimation } from '@sorare/core/src/atoms/animations/Background';
import Container from '@sorare/core/src/atoms/layout/Container';
import { useDefaultSportPages } from '@sorare/core/src/constants/routes';
import { useConfigContext } from 'contexts/config';
import { useConnectionContext } from 'contexts/connection';
import { useCurrentUserContext } from 'contexts/currentUser';
import MultiSportAppBar from 'routing/MultiSportAppBar';
import { theme } from '@sorare/core/src/style/theme';

import PlayNowButton from '../PlayNowButton';
import footballCards from './footballCards';
import mlbCards from './mlbCards';
import nbaCards from './nbaCards';

const Background = styled.div`
  position: relative;
  width: 100%;
`;

const AnimationContainer = styled.div`
  width: 100%;
  max-width: 1680px;
  height: 100%;
  margin: auto;
  z-index: 0;
`;
const AnimatedBackground = styled(BackgroundAnimation)`
  width: 100%;
  max-width: 1680px;
  height: 100%;
  position: absolute;
  isolation: isolate;
`;
const Fade = styled.div`
  width: 100%;
  max-width: 1680px;
  height: 100%;
  position: absolute;

  background: linear-gradient(
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0) 10%,
      rgba(0, 0, 0, 0) 90%,
      rgba(0, 0, 0, 1) 100%
    ),
    linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 90%),
    linear-gradient(-90deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 30%);
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  z-index: 1;
  padding: var(--double-unit) var(--unit) calc(3 * var(--unit));
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    justify-content: center;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: calc(5 * var(--unit));
  }
`;

const Title = styled(animated.h1)`
  ${theme.styledFonts.drukWideSuper}
  text-transform: uppercase;
  line-height: 100%;
  letter-spacing: normal;
  color: var(--c-static-neutral-100);
  margin: 0 0 var(--double-unit);
  span {
    display: block;
  }

  /* min: 32px - max: 64px */
  font-size: clamp(2rem, 4vw + 1rem, 4rem);
`;

const Subtitle = styled.h2`
  font-family: 'apercu-pro';
  color: var(--c-static-neutral-100);
  font-weight: 400;
  font-size: 20px;
  line-height: 30px;
  font-style: normal;
  margin: var(--double-unit) 0;
`;

const Ctas = styled.div`
  display: flex;
  gap: var(--double-unit);

  && {
    margin-top: var(--unit);
    @media (min-width: ${theme.breakpoints.values.tablet}px) {
      margin-top: var(--double-unit);
    }
  }
`;

const Box = styled.div`
  max-width: ${theme.breakpoints.values.mobile}px;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    max-width: calc(${theme.breakpoints.values.tablet}px - 100px);
  }
`;

export const OwnYourGame = () => {
  const { currentUser } = useCurrentUserContext();
  const { signIn } = useConnectionContext();
  const { landingTheme } = useConfigContext();

  const titleAnimation = useSpring({
    config: config.slow,
    delay: 250,
    from: { opacity: 0 },
    to: { opacity: 1 },
  });
  const subtitleAnimation = useSpring({
    config: config.slow,
    delay: 1000,
    from: { opacity: 0, y: -100 },
    to: { opacity: 1, y: 0 },
  });
  const defaultSportPages = useDefaultSportPages();

  const cta = currentUser
    ? { to: defaultSportPages[Sport.FOOTBALL] }
    : { onClick: signIn };

  const animatedCards = useMemo(() => {
    if (landingTheme && landingTheme.cards.length > 0) {
      const cardsA = shuffle([...landingTheme.cards]);
      const cardsB = shuffle([...landingTheme.cards]);
      const cardsC = cardsA;
      return { cardsA, cardsB, cardsC };
    }
    return {
      cardsA: footballCards,
      cardsB: nbaCards,
      cardsC: mlbCards,
    };
  }, [landingTheme]);

  let subtitle;
  if (landingTheme?.subtitle) {
    subtitle = landingTheme.subtitle;
  } else {
    subtitle = (
      <FormattedMessage
        id="Landing.OwnYourGame.subtitleNBA"
        defaultMessage="Sorare is a fantasy sports game and marketplace transforming fans into owners. Collect, buy, sell, and compete with officially licensed digital cards – featuring the best MLB, NBA, and global football players – to win amazing rewards. Win or lose, you still own your cards."
      />
    );
  }

  const mainBlockText = (
    <Wrapper>
      <Box>
        <Title style={titleAnimation}>
          <FormattedMessage
            id="Landing.OwnYourGame.title"
            defaultMessage="Build{br}Your{br}Legacy"
            values={{
              br: <br />,
            }}
          />
        </Title>
        <animated.div style={subtitleAnimation}>
          <Subtitle>{subtitle}</Subtitle>
          <Ctas>
            <PlayNowButton {...cta}>
              <FormattedMessage
                id="OwnYourGame.cta"
                defaultMessage="Play Now"
              />
            </PlayNowButton>
          </Ctas>
        </animated.div>
      </Box>
    </Wrapper>
  );

  return (
    <Background>
      <AnimationContainer>
        <AnimatedBackground {...animatedCards} nbCardsPerColumns={9} />
        <Fade />
      </AnimationContainer>
      <MultiSportAppBar color="transparent" />
      <Container>{mainBlockText}</Container>
    </Background>
  );
};

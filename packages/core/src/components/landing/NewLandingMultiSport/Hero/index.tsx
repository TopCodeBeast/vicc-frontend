import { faArrowDownLong } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { animated, useSpring, useTransition } from '@react-spring/web';
import styled from 'styled-components';

import { SorareLogo } from '@sorare/core/src/atoms/icons/SorareLogo';
import { Text16, Text18 } from '@sorare/core/src/atoms/typography';
import { ContentContainer } from 'components/landing/NewLandingMultiSport/ui';
import {
  messages as globalMessages,
  useHeroAnimationTimings,
} from 'components/landing/NewLandingMultiSport/utils';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { theme } from '@sorare/core/src/style/theme';

import heroBackgroundVideo from './assets/heroBackgroundVideo.webm';
import heroVideoPoster from './assets/heroVideoPoster.jpg';
import slideShow1 from './assets/slideShow_1.jpg';
import slideShow2 from './assets/slideShow_2.jpg';
import slideShow3 from './assets/slideShow_3.jpg';
import slideShow4 from './assets/slideShow_4.jpg';

const messages = defineMessages({
  title: {
    id: 'MultiSport.Landing.Hero.title',
    defaultMessage: 'Fantasy sports.{br}Re-imagined.',
  },
  subtitle: {
    id: 'MultiSport.Landing.Hero.subtitle',
    defaultMessage:
      'Sorare is a next-level fantasy sports game where you collect and compete with ownable digital player cards to win epic prizes. Win or lose, you still own your cards.',
  },
  scroll: {
    id: 'MultiSport.Landing.Hero.scroll',
    defaultMessage: 'Scroll down',
  },
});

const Ratio16by9 = styled.div`
  width: 100vw;
  isolation: isolate;
  overflow: hidden;
  position: relative;
  padding-bottom: 100vh;

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    padding-bottom: min(100vh, calc(100% / (1400 / 900)));
  }
`;

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  padding-bottom: var(--double-and-a-half-unit);
  align-items: flex-end;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    padding-bottom: calc(var(--unit) * 5);
  }

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    padding-bottom: 0;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.5),
      transparent calc(var(--navbar-height-mobile) * 2),
      transparent 65%,
      black
    );
    z-index: 1;
  }

  & > div {
    z-index: 2;
  }
`;

const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SlideShow = styled(animated.span)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  object-fit: cover;
  will-change: opacity;
`;

const BigLogoWrapper = styled(animated.div)`
  width: 100%;
  position: absolute;
  top: 50%;
  transform: translateY(-100%);
`;

const BigLogo = styled(SorareLogo)`
  width: 100%;
  height: auto;
`;

const TextContent = styled(animated.div)`
  display: flex;
  flex-direction: column;
  gap: var(--double-and-a-half-unit);

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    gap: calc(var(--unit) * 5);
  }
`;

const Title = styled.h1`
  line-height: 1;
  font-weight: 400;
  font-size: 28px;

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    font-size: 40px;
  }

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    font-size: 48px;
  }
`;

const SubTitle = styled(Text16)`
  max-width: 455px;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    font-size: 18px;
  }
`;

const CTAWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--intermediate-unit) 0;
  padding-bottom: var(--double-unit);
  position: relative;
  border-bottom: 1px solid var(--c-neutral-700);

  --border-size: 1px;
  border-bottom: var(--border-size) solid var(--c-neutral-700);

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    &::after {
      content: '';
      top: 0;
      right: 0;
      bottom: calc(-1 * var(--border-size));
      position: absolute;
      z-index: -1;
      background-color: black;
      width: calc((100vw - 100%) / 2 + 100%);
      transform: translateY(100%);
      transition: transform 0.75s ease-in-out;
      overflow: hidden;
    }

    &.animated::after {
      overflow: auto;
      transform: translateY(0);
    }
  }
`;

const ScrollDown = styled.div`
  display: flex;
  align-items: center;
  gap: var(--double-unit);
  padding-right: var(--quadruple-unit);
`;

export const Hero = () => {
  const { formatMessage } = useIntl();
  const { firstBatch, secondBatch } = useHeroAnimationTimings();
  const { up: isDesktop } = useScreenSize('laptop');
  const { up: isTabletOrDesktop } = useScreenSize('tablet');
  const [index, setIndex] = useState(0);

  const slides = [slideShow1, slideShow2, slideShow3, slideShow4];

  let animationValues;

  // Determine the animation values based on the toggle and logoFadeOut states:
  // If logoFadeOut is true, the logo should slide up off the screen and become fully transparent.
  // If logoFadeOut is false but toggle is true, the logo should slide up but only partially, and it should remain fully opaque.
  // If both logoFadeOut and toggle are false, the logo should remain in its original position and fully opaque.
  if (secondBatch) {
    animationValues = {
      transform: 'translateY(-100%)',
      opacity: 0,
    };
  } else if (firstBatch) {
    animationValues = {
      transform: 'translateY(-75%)',
      opacity: 1,
    };
  } else {
    animationValues = {
      transform: 'translateY(-50%)',
      opacity: 1,
    };
  }

  const animation = useSpring({
    ...animationValues,
    config: { duration: 500 },
  });

  const textContentAnimation = useSpring({
    opacity: firstBatch ? 1 : 0,
    transform: firstBatch ? 'translateY(0%)' : 'translateY(50%)',
    config: { duration: 500 },
  });

  const bounce = useSpring({
    from: { y: 4 },
    to: [{ y: 4 }, { y: -4 }],
    config: { duration: 800 },
    loop: { reverse: true },
  });

  const transitions = useTransition(slides[index], {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 1000 },
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex(state => (state + 1) % slides.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(intervalId);
  }, [slides.length]);

  return (
    <Ratio16by9>
      <Wrapper>
        {isDesktop ? (
          <Video autoPlay loop muted playsInline poster={heroVideoPoster}>
            <source src={heroBackgroundVideo} type="video/webm" />
          </Video>
        ) : (
          transitions((props, item) => (
            <SlideShow style={{ ...props, backgroundImage: `url(${item})` }} />
          ))
        )}
        <BigLogoWrapper style={isDesktop ? animation : {}}>
          <BigLogo />
        </BigLogoWrapper>
        <ContentContainer>
          <TextContent style={textContentAnimation}>
            <Title>{formatMessage(messages.title, { br: <br /> })}</Title>
            <SubTitle>{formatMessage(messages.subtitle)}</SubTitle>
            {isTabletOrDesktop && (
              <CTAWrapper
                className={classNames({ animated: isDesktop && secondBatch })}
              >
                <Text18>{formatMessage(globalMessages.ScrollDownCTA)}</Text18>
                <ScrollDown>
                  <Text18>{formatMessage(messages.scroll)}</Text18>
                  <animated.div
                    style={{
                      transform: bounce.y.to(y => `translateY(${y}px)`),
                    }}
                  >
                    <FontAwesomeIcon icon={faArrowDownLong} />
                  </animated.div>
                </ScrollDown>
              </CTAWrapper>
            )}
          </TextContent>
        </ContentContainer>
      </Wrapper>
    </Ratio16by9>
  );
};

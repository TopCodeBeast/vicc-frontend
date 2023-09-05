import { faArrowDownLong } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { ReactNode, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { animated, useSpring, useTransition } from '@react-spring/web';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { ViccLogo } from '@core/atoms/icons/SorareLogo';
import { Text16, Text18 } from '@core/atoms/typography';
import { ContentContainer } from '@core/components/landing/NewLandingMultiSport/ui';
import {
  messages as globalMessages,
  useHeroAnimationTimings,
} from '@core/components/landing/NewLandingMultiSport/utils';
import { useConnectionContext } from '@core/contexts/connection';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import useScreenSize from '@core/hooks/device/useScreenSize';
import { glossary } from '@core/lib/glossary';
import { laptopAndAbove, tabletAndAbove } from '@core/style/mediaQuery';

import { PlayNowSportsButtons } from './PlayNowSportsButtons';

const Ratio16by9 = styled.div`
  width: 100vw;
  isolation: isolate;
  overflow: hidden;
  position: relative;
  padding-bottom: 100vh;

  @media ${laptopAndAbove} {
    padding-bottom: max(
      750px,
      min(
        calc(100vh - var(--navbar-height-mobile)),
        calc(100% / (1400 / 900) - var(--navbar-height-mobile))
      )
    );
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
  flex-direction: column;

  @media ${tabletAndAbove} {
    padding-bottom: calc(var(--unit) * 5);
  }

  @media ${laptopAndAbove} {
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

const LogoContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  margin-top: var(--navbar-height-mobile);
`;

const BigLogoWrapper = styled(animated.div)`
  width: 100%;
  bottom: var(--triple-unit);
  position: absolute;

  padding-inline: var(--double-unit);
  @media ${laptopAndAbove} {
    top: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    transform: translateY(-100%);
    padding: 0;
  }
`;

const BigLogo = styled(ViccLogo)`
  width: 100%;
  height: auto;
  max-height: 80%;
`;

const TextContent = styled(animated.div)`
  display: flex;
  flex-direction: column;
  gap: var(--double-and-a-half-unit);

  @media ${laptopAndAbove} {
    gap: calc(var(--unit) * 5);
  }
`;

const Title = styled.h1`
  line-height: 1;
  font-weight: 400;
  font-size: 28px;

  @media ${laptopAndAbove} {
    font-size: 40px;
  }

  @media ${laptopAndAbove} {
    font-size: 48px;
  }
`;

const SubTitle = styled(Text16)`
  max-width: 455px;
  margin-bottom: var(--double-unit);

  @media ${tabletAndAbove} {
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

  @media ${laptopAndAbove} {
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

const MainContent = styled.div`
  width: 100%;
`;

const ScrollDown = styled.div`
  display: flex;
  align-items: center;
  gap: var(--double-unit);
  padding-right: var(--quadruple-unit);
`;

type Props = {
  title: string | ReactNode;
  poster: string;
  subtitle: string;
  videoSrc: string;
  mobileSlides: string[];
};

export const HeroBlock = ({
  title,
  poster,
  subtitle,
  videoSrc,
  mobileSlides,
}: Props) => {
  const { formatMessage } = useIntl();
  const { signUp } = useConnectionContext();
  const { currentUser } = useCurrentUserContext();
  const { firstBatch, secondBatch } = useHeroAnimationTimings();
  const { up: isLaptop } = useScreenSize('laptop');
  const { up: isTabletOrDesktop } = useScreenSize('tablet');
  const [index, setIndex] = useState(0);

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
      transform: 'translateY(-50%)',
      opacity: 1,
    };
  } else {
    animationValues = {
      transform: 'translateY(0%)',
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

  const transitions = useTransition(mobileSlides[index], {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 1000 },
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex(state => (state + 1) % mobileSlides.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(intervalId);
  }, [mobileSlides.length]);

  return (
    <Ratio16by9>
      <Wrapper>
        {isLaptop ? (
          <Video autoPlay loop muted playsInline poster={poster}>
            <source src={videoSrc} type="video/webm" />
          </Video>
        ) : (
          transitions((props, item) => (
            <SlideShow style={{ ...props, backgroundImage: `url(${item})` }} />
          ))
        )}
        <LogoContainer>
          <BigLogoWrapper style={isLaptop ? animation : {}}>
            <BigLogo />
          </BigLogoWrapper>
        </LogoContainer>
        <MainContent>
          <ContentContainer>
            <TextContent style={textContentAnimation}>
              <Title>{title}</Title>
              <div>
                <SubTitle>{subtitle}</SubTitle>
                <Button color="white" small onClick={signUp}>
                  {formatMessage(glossary.playNow)}
                </Button>
              </div>
              {isTabletOrDesktop && !currentUser && (
                <CTAWrapper
                  className={classNames({
                    animated: isLaptop && secondBatch,
                  })}
                >
                  <ScrollDown>
                    <animated.div
                      style={{
                        transform: bounce.y.to(y => `translateY(${y}px)`),
                      }}
                    >
                      <FontAwesomeIcon icon={faArrowDownLong} />
                    </animated.div>
                    <Text18>
                      {formatMessage(globalMessages.ScrollDownCTA)}
                    </Text18>
                  </ScrollDown>
                </CTAWrapper>
              )}
            </TextContent>
          </ContentContainer>
          {currentUser && <PlayNowSportsButtons />}
        </MainContent>
      </Wrapper>
    </Ratio16by9>
  );
};

import { useLayoutEffect, useRef, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { animated, config, useSpring } from '@react-spring/web';
import styled from 'styled-components';

import useFontFaceObserver from '@sorare/use-font-face-observer';
import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text18 } from '@sorare/core/src/atoms/typography';
import { RotatingStarball } from 'components/RotatingStarball';
import { useConfigContext } from '@sorare/core/src/contexts/config';
import { useConnectionContext } from '@sorare/core/src/contexts/connection';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useIsVisibleInViewport from '@sorare/core/src/hooks/useIsVisibleInViewport';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { theme } from '@sorare/core/src/style/theme';
import { hideScrollbar } from '@sorare/core/src/style/utils';

import 'style/drukFontFaces.css';

import { ContentContainer } from '../ui';
import {
  BaseballPastWinners,
  FootballPastWinners,
  NBAPastWinners,
} from './PastWinners';

const messages = defineMessages({
  title: {
    id: 'Landing.CommunityBlock.title',
    defaultMessage: 'Join the community',
  },
  users: {
    id: 'Landing.CommunityBlock.users',
    defaultMessage: 'Sorare Managers',
  },
  playing: {
    id: 'Landing.CommunityBlock.playing',
    defaultMessage: 'Playing',
  },
  winners: {
    id: 'Landing.CommunityBlock.winners',
    defaultMessage: 'Recent competition winners',
  },
  cta: {
    id: 'Landing.CommunityBlock.cta',
    defaultMessage: 'See all upcoming competitions',
  },
});

const Content = styled.div`
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    padding: 0 var(--double-and-a-half-unit);
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: var(--intermediate-unit);
  align-items: center;
  margin-top: calc(var(--unit) * 8);
  flex-direction: row-reverse;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    flex-direction: row;
    margin-top: calc(var(--unit) * 15);
  }

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    gap: var(--unit);
  }
`;

const SmallStarball = styled(RotatingStarball)`
  width: 45px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-family: 'Druk Wide';
  text-transform: uppercase;

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    font-size: 28px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--double-and-a-half-unit);
  margin-top: calc(var(--unit) * 9);
  justify-content: space-between;

  &.pastWinners {
    margin-top: var(--double-unit);
  }

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    padding-inline: var(--double-and-a-half-unit);
  }

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    justify-content: flex-start;
  }
`;

const SectionText = styled(Text18)`
  white-space: nowrap;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    font-size: 24px;
  }
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: var(--c-static-neutral-100);
`;

const Druk = styled.div`
  line-height: 1;
  font-family: 'Druk Wide';
`;

const Measure = styled.div`
  position: absolute;
  visibility: hidden;
  pointer-events: none;
`;

const WinnersList = styled(ContentContainer)`
  display: grid;
  margin-top: var(--double-and-a-half-unit);
  gap: var(--double-and-a-half-unit);

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    ${hideScrollbar}
    overflow: auto;
    grid-auto-flow: column;
    gap: var(--intermediate-unit);
    margin-top: calc(var(--unit) * 7);
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CTAWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: var(--double-and-a-half-unit) 0;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    margin: calc(var(--unit) * 7) 0;
  }
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    margin: var(--double-and-a-half-unit) 0;
  }
`;

const useAutoLayout = (ready: boolean) => {
  const [fontSize, setFontSize] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    if (ref.current && ready) {
      const maxWidth = Math.min(ref.current.offsetWidth, 1320);

      setFontSize(
        maxWidth /
          (Array.from(ref.current.children)[0] as HTMLDivElement).offsetWidth
      );
    }
  }, [ready]);
  return { ref, fontSize };
};

export const CommunityBlock = () => {
  const track = useEvents();
  const { counts } = useConfigContext();
  const { signUp } = useConnectionContext();
  const { up: isDesktop } = useScreenSize('laptop');
  const { formatMessage, formatNumber } = useIntl();
  const fontStatus = useFontFaceObserver(
    [{ family: 'Druk Wide', weight: 'normal' }],
    {
      timeout: 1000,
    }
  );
  const { ref: userNbRef, fontSize } = useAutoLayout(
    fontStatus !== 'initial' && !!counts.usersCount
  );
  const isVisible = useIsVisibleInViewport({ element: userNbRef });
  const { number } = useSpring({
    number: counts.usersCount,
    from: { number: 0 },
    pause: !isVisible,
    config: isDesktop ? config.molasses : config.gentle,
  });

  return (
    <Content>
      <ContentContainer>
        <TitleWrapper>
          <SmallStarball />
          <Title>{formatMessage(messages.title)}</Title>
        </TitleWrapper>
        <SectionHeader>
          <SectionText>{formatMessage(messages.users)}</SectionText>
          {isDesktop && <Line />}
          <SectionText>{formatMessage(messages.playing)}</SectionText>
        </SectionHeader>
        <div>
          {counts.usersCount && (
            <Druk ref={userNbRef}>
              <Measure>
                {formatNumber(counts.usersCount, {
                  ...(isDesktop
                    ? {}
                    : {
                        notation: 'compact',
                        compactDisplay: 'short',
                        maximumFractionDigits: 1,
                      }),
                })}
              </Measure>
              <animated.span
                style={{
                  fontSize: `${fontSize}em`,
                }}
              >
                {number.to(n =>
                  formatNumber(Math.floor(n), {
                    ...(isDesktop
                      ? {}
                      : {
                          notation: 'compact',
                          compactDisplay: 'short',
                          maximumFractionDigits: 1,
                        }),
                  })
                )}
              </animated.span>
            </Druk>
          )}
        </div>
        <SectionHeader className="pastWinners">
          <SectionText>{formatMessage(messages.winners)}</SectionText>
          {isDesktop && <Line />}
        </SectionHeader>
      </ContentContainer>
      <WinnersList>
        <BaseballPastWinners leaderboardSlug="rare-all-star" />
        <FootballPastWinners leaderboardSlug="global-cap-division" />
        <NBAPastWinners leaderboardSlug="limited-contender" />
      </WinnersList>
      <CTAWrapper>
        <Button
          medium
          color="white"
          onClick={() => {
            track('Click See all competitions');
            signUp();
          }}
        >
          {formatMessage(messages.cta)}
        </Button>
      </CTAWrapper>
    </Content>
  );
};

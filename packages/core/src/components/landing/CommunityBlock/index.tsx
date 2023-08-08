import { ReactNode, useRef } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { animated, config, useSpring } from '@react-spring/web';
import styled from 'styled-components';

import useFontFaceObserver from '@sorare/use-font-face-observer';
import Button from '@core/atoms/buttons/Button';
import { Text18 } from '@core/atoms/typography';
import { RotatingStarball } from '@core/components/RotatingStarball';
import { ContentContainer } from '@core/components/landing/NewLandingMultiSport/ui';
import { useConnectionContext } from '@core/contexts/connection';
import useUsersCount from '@core/hooks/config/useUsersCount';
import useScreenSize from '@core/hooks/device/useScreenSize';
import useIsVisibleInViewport from '@core/hooks/useIsVisibleInViewport';
import useEvents from '@core/lib/events/useEvents';
import { laptopAndAbove, tabletAndAbove } from '@core/style/mediaQuery';
import { hideScrollbar } from '@core/style/utils';

import '@core/style/drukFontFaces.css';

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
  margin-bottom: calc(var(--unit) * 10);
  @media ${laptopAndAbove} {
    margin-bottom: calc(var(--unit) * 12);
    padding: 0 var(--double-and-a-half-unit);
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: var(--intermediate-unit);
  align-items: center;
  margin-top: calc(var(--unit) * 8);
  flex-direction: row-reverse;

  @media ${tabletAndAbove} {
    flex-direction: row;
    margin-top: calc(var(--unit) * 15);
  }

  @media ${laptopAndAbove} {
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

  @media ${laptopAndAbove} {
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

  @media ${tabletAndAbove} {
    padding-inline: var(--double-and-a-half-unit);
  }

  @media ${laptopAndAbove} {
    justify-content: flex-start;
  }
`;

const SectionText = styled(Text18)`
  white-space: nowrap;

  @media ${tabletAndAbove} {
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
  font-weight: 900;
  font-family: Druk Wide;
  color: var(--c-static-neutral-100);
  &:not(.active) {
    font-family: verdana;
  }
`;

const WinnersList = styled(ContentContainer)`
  display: grid;
  margin-top: var(--double-and-a-half-unit);
  gap: var(--double-and-a-half-unit);

  @media ${tabletAndAbove} {
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

  @media ${tabletAndAbove} {
    margin: calc(var(--unit) * 7) 0;
  }
  @media ${laptopAndAbove} {
    margin: var(--double-and-a-half-unit) 0;
  }
`;

function getTextWidth(text: string, font?: string) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    context.font = `900 16px ${font || 'Druk Wide'}`;
    const metrics = context.measureText(text);
    return metrics.width;
  }
  return 0;
}

type Props = {
  children: ReactNode;
};

export const CommunityBlock = ({ children }: Props) => {
  const track = useEvents();
  const { counts } = useUsersCount();
  const { signUp } = useConnectionContext();
  const { up: isDesktop } = useScreenSize('laptop');
  const { formatMessage, formatNumber } = useIntl();
  const fontStatus = useFontFaceObserver(
    [{ family: 'Druk Wide', weight: 'normal' }],
    {
      timeout: 1000,
    }
  );
  const userNbRef = useRef<HTMLDivElement | null>(null);
  const numberFormat = isDesktop
    ? undefined
    : {
        notation: 'compact' as const,
        compactDisplay: 'short' as const,
        maximumFractionDigits: 1,
      };
  const viewPortSize = getTextWidth(
    `${formatNumber(counts.usersCount, numberFormat)}`,
    fontStatus !== 'active' ? 'verdana' : undefined
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
            <Druk ref={userNbRef} className={fontStatus}>
              <svg viewBox={`0 0 ${viewPortSize} 16`}>
                <animated.text x="0" y="14" fill="currentColor">
                  {number.to(n => formatNumber(Math.floor(n), numberFormat))}
                </animated.text>
              </svg>
            </Druk>
          )}
        </div>
        <SectionHeader className="pastWinners">
          <SectionText>{formatMessage(messages.winners)}</SectionText>
          {isDesktop && <Line />}
        </SectionHeader>
      </ContentContainer>
      <WinnersList>{children}</WinnersList>
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

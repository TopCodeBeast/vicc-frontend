import { Fragment } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import mlbLogoSrc from 'assets/logos/mlb/mlb.svg';
import mlbpaLogoSrc from 'assets/logos/mlb/mlbpa.svg';
import nbaLogoSrc from 'assets/logos/nba/nba.svg';
import Button from '@sorare/core/src/atoms/buttons/Button';
import { SorareLogo } from '@sorare/core/src/atoms/icons/SorareLogo';
import SmallerStarBall from '@sorare/core/src/atoms/navigation/SmallerStarBall';
import { Text16, Text20 } from '@sorare/core/src/atoms/typography';
import ResponsiveImg from '@sorare/core/src/atoms/ui/ResponsiveImg';
import { useConnectionContext } from 'contexts/connection';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { sportsLabelsMessages } from '@sorare/core/src/lib/glossary';
import { theme } from '@sorare/core/src/style/theme';
import { hideScrollbar } from '@sorare/core/src/style/utils';

import messi from './assets/messi.jpg';
import soto from './assets/soto.jpg';
import towns from './assets/towns.jpg';
import { baseballCards, footballCards, nbaCards } from './utils';

const messages = defineMessages({
  title: {
    id: 'Landing.NewOtherSports.title',
    defaultMessage: 'Choose your sport',
  },
  cta: {
    id: 'Landing.NewOtherSports.cta',
    defaultMessage: 'Play now',
  },
  mlb: {
    id: 'Landing.NewOtherSports.mlb',
    defaultMessage: 'Featuring all 30 MLB officially licensed clubs',
  },
  football: {
    id: 'Landing.NewOtherSports.football',
    defaultMessage: 'Featuring over 300 officially licensed soccer clubs',
  },
  nba: {
    id: 'Landing.NewOtherSports.nba',
    defaultMessage: 'Featuring all 30 NBA officially licensed teams',
  },
});

const Wrapper = styled.div``;

const Title = styled(Text20)`
  font-family: 'Druk Wide';
  text-transform: uppercase;
  margin-bottom: var(--triple-unit);

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    font-size: 24px;
    margin-bottom: calc(var(--unit) * 7);
  }
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    font-size: 28px;
    margin-bottom: calc(var(--unit) * 5);
  }
`;

const Grid = styled.div`
  display: grid;
  gap: var(--double-unit);
  grid-auto-flow: column;
  overflow: auto;
  ${hideScrollbar}
  grid-template-columns: repeat(3, minmax(320px, 1fr));

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    grid-template-columns: repeat(3, minmax(440px, 1fr));
  }

  @media (min-width: ${theme.breakpoints.values.desktop}px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const SportWrapper = styled.div`
  padding: var(--double-and-a-half-unit) 0 var(--double-and-a-half-unit)
    var(--double-and-a-half-unit);
  border-radius: var(--unit);
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  aspect-ratio: 0.8;
  position: relative;

  overflow: hidden;
  display: grid;
  grid-template-areas:
    'logos cards'
    'content cards';
  grid-template-columns: 3fr 1fr;
  grid-template-rows: max-content 1fr;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.8) 0%,
      transparent 100%
    );
  }

  & > * {
    z-index: 1;
  }

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    aspect-ratio: 1;
    grid-template-columns: 4fr 1fr;
  }
`;

const Content = styled.div`
  grid-area: content;
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  max-width: 70%;
  align-self: end;
`;

const SportName = styled.p`
  font-size: 28px;
  font-family: 'Druk Wide';
  text-transform: uppercase;
`;

const LogoWrapper = styled.div`
  grid-area: logos;
  top: var(--quadruple-unit);
  display: flex;
  gap: var(--unit);
  height: var(--triple-unit);
  align-items: center;
`;

const StartBall = styled(SmallerStarBall)`
  margin-right: var(--unit);
`;

const SportLogo = styled.img`
  max-height: 25px;
`;

const VerticalDivider = styled.div`
  width: 1px;
  height: 75%;
  background-color: var(--c-static-neutral-100);
`;

const CardsArea = styled.div`
  grid-area: cards;
  display: flex;
  flex-direction: column;
  flex-shrink: 0.18;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: var(--half-unit);
  padding: 0 var(--unit);
`;

const CardImage = styled(ResponsiveImg).attrs({
  cropWidth: 160,
  draggable: false,
})`
  width: 100%;
  aspect-ratio: var(--card-aspect-ratio);
`;

export const NewOtherSports = () => {
  const track = useEvents();
  const { formatMessage } = useIntl();
  const { signUp } = useConnectionContext();
  const { up: isTabletOrDesktop } = useScreenSize('tablet');
  const sports = [
    {
      id: Sport.FOOTBALL,
      title: formatMessage(sportsLabelsMessages[Sport.FOOTBALL]),
      text: formatMessage(messages.football),
      image: messi,
      cardUrls: footballCards,
    },
    {
      id: Sport.NBA,
      title: formatMessage(sportsLabelsMessages[Sport.NBA]),
      text: formatMessage(messages.nba),
      image: towns,
      logos: [nbaLogoSrc],
      cardUrls: nbaCards,
    },
    {
      id: Sport.BASEBALL,
      title: formatMessage(sportsLabelsMessages[Sport.BASEBALL]),
      text: formatMessage(messages.mlb),
      image: soto,
      logos: [mlbLogoSrc, mlbpaLogoSrc],
      cardUrls: baseballCards,
    },
  ];

  return (
    <Wrapper>
      <Title>{formatMessage(messages.title)}</Title>
      <Grid>
        {sports.map(sport => (
          <SportWrapper
            key={sport.title}
            style={{ backgroundImage: `url(${sport.image})` }}
          >
            <LogoWrapper>
              <div>
                <StartBall />
                <SorareLogo />
              </div>
              {sport.logos?.map(logo => (
                <Fragment key={logo}>
                  <VerticalDivider />
                  <SportLogo
                    src={logo}
                    alt=""
                    height={isTabletOrDesktop ? 25 : 15}
                  />
                </Fragment>
              ))}
            </LogoWrapper>
            <Content>
              <SportName>{sport.title}</SportName>
              <Text16>{sport.text}</Text16>
              <div>
                <Button
                  color="white"
                  medium
                  onClick={() => {
                    track('Click Play Now', { sport: sport.id });
                    signUp();
                  }}
                >
                  {formatMessage(messages.cta)}
                </Button>
              </div>
            </Content>
            <CardsArea>
              {sport.cardUrls?.map(cardUrl => (
                <CardImage key={cardUrl} src={cardUrl} alt="" />
              ))}
            </CardsArea>
          </SportWrapper>
        ))}
      </Grid>
    </Wrapper>
  );
};

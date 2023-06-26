import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import mlbLogo from '@core/assets/logos/mlb/mlb-monochrome.svg';
import mlbpaLogo from '@core/assets/logos/mlb/mlbpa.svg';
import nbaLogo from '@core/assets/logos/nba/nba-monochrome.svg';
import nbpaLogo from '@core/assets/logos/nba/nbpa.svg';
import Button from '@core/atoms/buttons/Button';
import { LinkBox, LinkOverlay } from '@core/atoms/navigation/Box';
import { useDefaultSportPages } from '@core/constants/routes';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import { sportsLabelsMessages } from '@core/lib/glossary';
import { Link } from '@core/routing/Link';
import { theme } from '@core/style/theme';

import PlayerCardsAnimation from '../PlayerCardsAnimation';
import logoMLS from './assets/logo-MLS.svg';
import logoBelgiumLeague from './assets/logo-belgiumleague.svg';
import logoBundesliga from './assets/logo-bundesliga.svg';
import logoEredivisie from './assets/logo-eredivisie.svg';
import logoJapanLeague from './assets/logo-japanleague.svg';
import logoLaLiga from './assets/logo-laliga.svg';
import logoPremierLeague from './assets/logo-premierleague.svg';
import logoSerieA from './assets/logo-serieA.svg';
import logoSuperlig from './assets/logo-superlig.svg';
import { useSportCTAProps } from './useSportCTAProps';

const FeaturedSport = styled(LinkBox)`
  /* jss conflicts with styled component priorities */
  background: var(--c-static-neutral-800) !important;
  border-radius: var(--double-unit) !important;

  scroll-snap-align: center;
  flex: none;
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  justify-content: stretch !important;

  text-align: center;
  max-width: min(380px, 100vw - 12 * var(--unit));
  height: auto;
  overflow: hidden;
  color: var(--c-static-neutral-100);
  transition: 0.25s ease-in-out transform;
  cursor: pointer;

  &:hover,
  &:focus-within {
    transform: scale(1.01);
  }
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    gap: var(--quadruple-unit);
    flex-grow: 1;
    flex-basis: 0;
  }
`;

const CardContent = styled.div`
  flex: 1;
  display: grid;
  --grid-padding: var(--double-unit);
  grid-template-columns:
    var(--grid-padding)
    1fr
    var(--grid-padding);
  & > * {
    grid-column: 2;
  }
  grid-template-rows: min-content min-content min-content 1fr;
  justify-content: flex-start;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    --grid-padding: calc(3 * var(--unit));
  }
  @media (min-width: ${theme.breakpoints.values.desktop}px) {
    --grid-padding: calc(5 * var(--unit));
  }
`;

const Title = styled.h3`
  ${theme.styledFonts.drukWideSuper}
  color: var(--c-static-neutral-100);
  text-transform: uppercase;
  font-size: 16px;
  line-height: 24px;
  margin: 0;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    font-size: 20px;
    line-height: 30px;
  }
`;

const Subtitle = styled.h4`
  color: var(--c-static-neutral-100);
  font-family: 'apercu-pro';
  font-size: 14px;
  --line-height: 18px;
  line-height: var(--line-height);
  font-weight: 400;
  margin: 0;
  --nb-lines: 4;
  min-height: calc(var(--nb-lines) * var(--line-height));
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    font-size: 18px;
    --line-height: 27px;
    --nb-lines: 6;
  }
  @media (min-width: ${theme.breakpoints.values.desktop}px) {
    --nb-lines: 4;
  }
`;

const PlayNowCta = styled(Button).attrs({
  color: 'white',
  medium: true,
})`
  /* this it the LinkOther without the &:hover */
  position: relative;
  z-index: 1;

  && {
    width: min-content;
    margin: var(--quadruple-unit) auto;
  }
`;

const Footer = styled.footer`
  margin-top: auto;
  img {
    max-width: 100%;
  }
`;

const LogoList = styled.ul`
  margin: var(--unit) 0 0;
  padding: var(--double-unit) 0;
  display: flex;

  align-items: center;
  justify-content: center;
  gap: var(--double-unit);
  flex-wrap: wrap;
  grid-column: 1 / 4;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    gap: var(--intermediate-unit);
    grid-column: 2;
  }
  @media (min-width: ${theme.breakpoints.values.desktop}px) {
    flex-wrap: nowrap;
  }
  min-height: calc(10 * var(--unit));

  & > li {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const FooterText = styled.h5`
  color: var(--c-static-neutral-600);
  font-family: 'apercu-pro';
  font-size: 14px;
  line-height: 18px;
  font-weight: 400;
  margin: 0;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    font-size: 16px;
    line-height: 27px;
  }
`;

const footballCards = [
  'https://assets.sorare.com/image-resize/card/8ccf2277-f05a-4e39-a69a-98894b1bf6c4/picture/tinified-156c3f6240434823360f00c9915193e8.png?width=160',
  'https://assets.sorare.com/image-resize/card/6ab87c58-f5f1-46cc-a46e-06d25520de30/picture/tinified-66019e61440096aa3d2a8082ed17c359.png?width=160',
  'https://assets.sorare.com/image-resize/carddata/3db316e2-0c1d-4880-863a-791d2c1173d4/picture/tinified-3c18a0bb3cd12a6639f9c8b579e5a5af.png?width=160',
];

const mlbCards = [
  'https://assets.sorare.dev/image-resize/cardsamplepicture/004405cf-2963-4de6-b90f-7f5641fde0e8/picture/513b58ee79f8889d6e44c8f530a27a87.png?width=160',
  'https://assets.sorare.dev/image-resize/cardsamplepicture/e819293e-a0fe-44a0-ac98-714707ff447a/picture/ec9e504e99227b53b9c75b1a516273ac.png?width=160',
  'https://assets.sorare.dev/image-resize/cardsamplepicture/1a0fa154-3f7f-4cff-a90a-52d9a8fee34e/picture/36e17b144fc99ef79774b86e1c95753e.png?width=160',
];

const nbaCards = [
  'https://assets.sorare.com/image-resize/cardsamplepicture/dc59db97-b756-4055-bde3-071c2eb96d45/picture/tinified-f84f84d855535f73f2f5b8fc50912817.png?width=160',
  'https://assets.sorare.com/image-resize/cardsamplepicture/92e32c36-8743-4546-b1c3-02277f181a4e/picture/tinified-74a4304fdfeda6bb48c951941287c724.png?width=160',
  'https://assets.sorare.com/image-resize/cardsamplepicture/c8900bce-5aa8-49c3-b338-972e3bfc78f6/picture/tinified-970ef127c6942dbbc556f785ca2fb6a3.png?width=160',
];

const useLandingFeateuredSportImagesDefault = {
  football: footballCards,
  nba: nbaCards,
};

type FeateuredSportProps = {
  openSignup?: boolean;
  hideDescription?: boolean;
};

export const FeaturedSportFootball = ({
  hideDescription = false,
}: FeateuredSportProps) => {
  const {
    flags: {
      useLandingFeateuredSportImages = useLandingFeateuredSportImagesDefault,
    },
  } = useFeatureFlags();
  const CTAProps = useSportCTAProps(Sport.FOOTBALL);
  const defaultSportPages = useDefaultSportPages();

  return (
    <FeaturedSport id="football">
      <PlayerCardsAnimation
        cards={useLandingFeateuredSportImages.football || footballCards}
      />
      <CardContent>
        <LinkOverlay as={Link} to={defaultSportPages[Sport.FOOTBALL]}>
          <Title>
            <FormattedMessage {...sportsLabelsMessages.FOOTBALL} />
          </Title>
        </LinkOverlay>
        {!hideDescription && (
          <Subtitle>
            <FormattedMessage
              id="ChooseYourOwn.FeaturedSportFootball.subtitle"
              defaultMessage="Your legacy starts now. Showcase your football fandom to build your squad, climb leaderboards, and win amazing rewards using fantasy football’s most advanced scoring system."
            />
          </Subtitle>
        )}
        <PlayNowCta {...CTAProps}>
          <FormattedMessage
            id="ChooseYourOwn.football.cta"
            defaultMessage="Play Now"
          />
        </PlayNowCta>
        <Footer>
          <FooterText>
            <FormattedMessage
              id="ChooseYourOwn.football.featuringFooter"
              defaultMessage="Featuring over {clubCount, number} officially licensed football clubs"
              values={{
                clubCount: 300,
              }}
            />
          </FooterText>
          <LogoList>
            <li>
              <img width="22px" src={logoPremierLeague} alt="Premier league" />
            </li>
            <li>
              <img src={logoLaLiga} alt="laliga" />
            </li>
            <li>
              <img src={logoBundesliga} alt="bundesliga" />
            </li>
            <li>
              <img src={logoMLS} alt="mls" />
            </li>
            <li>
              <img src={logoEredivisie} alt="eredivisie" />
            </li>
            <li>
              <img src={logoSuperlig} alt="superlig" />
            </li>
            <li>
              <img src={logoSerieA} alt="serie A" />
            </li>
            <li>
              <img src={logoJapanLeague} alt="japan league" />
            </li>
            <li>
              <img
                src={logoBelgiumLeague}
                style={{ position: 'relative', width: '95%', top: -2 }}
                alt=""
              />
            </li>
          </LogoList>
        </Footer>
      </CardContent>
    </FeaturedSport>
  );
};

export const FeaturedSportNBA = ({
  hideDescription = false,
}: FeateuredSportProps) => {
  const {
    flags: {
      useLandingFeateuredSportImages = useLandingFeateuredSportImagesDefault,
    },
  } = useFeatureFlags();
  const CTAProps = useSportCTAProps(Sport.NBA);
  const defaultSportPages = useDefaultSportPages();

  return (
    <FeaturedSport id="nba">
      <PlayerCardsAnimation
        cards={useLandingFeateuredSportImages.nba || nbaCards}
      />
      <CardContent>
        <LinkOverlay as={Link} to={defaultSportPages[Sport.NBA]}>
          <Title>
            <FormattedMessage {...sportsLabelsMessages.NBA} />
          </Title>
        </LinkOverlay>
        {!hideDescription && (
          <Subtitle>
            <FormattedMessage
              id="ChooseYourOwn.FeaturedSportNBA.subtitle"
              defaultMessage="Where dynasties never die. Flex your roster skills to build the ultimate NBA fantasy team and compete to win top prizes. Step up to the fantasy hoops front office."
            />
          </Subtitle>
        )}
        <PlayNowCta {...CTAProps}>
          <FormattedMessage
            id="ChooseYourOwn.football.cta"
            defaultMessage="Play Now"
          />
        </PlayNowCta>
        <Footer>
          <FooterText>
            <FormattedMessage
              id="ChooseYourOwn.nba.featuringFooter"
              defaultMessage="Featuring all {clubCount, number} NBA officially licensed teams"
              values={{
                clubCount: 30,
              }}
            />
          </FooterText>

          <LogoList>
            <li>
              <img src={nbaLogo} alt="" />
            </li>
            <li>
              <img src={nbpaLogo} alt="" />
            </li>
          </LogoList>
        </Footer>
      </CardContent>
    </FeaturedSport>
  );
};

export const FeaturedSportMLB = ({
  hideDescription = false,
}: FeateuredSportProps) => {
  const {
    flags: {
      useLandingFeateuredSportImages = useLandingFeateuredSportImagesDefault,
    },
  } = useFeatureFlags();
  const CTAProps = useSportCTAProps(Sport.BASEBALL);
  const defaultSportPages = useDefaultSportPages();

  return (
    <FeaturedSport id="mlb">
      <PlayerCardsAnimation
        cards={useLandingFeateuredSportImages.mlb || mlbCards}
        mirror
      />
      <CardContent>
        <LinkOverlay as={Link} to={defaultSportPages[Sport.BASEBALL]}>
          <Title>
            <FormattedMessage {...sportsLabelsMessages.BASEBALL} />
          </Title>
        </LinkOverlay>
        {!hideDescription && (
          <Subtitle>
            <FormattedMessage
              id="ChooseYourOwn.FeaturedSportMLB.subtitle"
              defaultMessage="The next era is yours. Put your MLB roster-building skills to the test against friends and rivals to win epic rewards. Welcome to the big leagues of fantasy baseball."
            />
          </Subtitle>
        )}
        <PlayNowCta {...CTAProps}>
          <FormattedMessage
            id="ChooseYourOwn.mlb.cta"
            defaultMessage="Play Now"
          />
        </PlayNowCta>
        <Footer>
          <FooterText>
            <FormattedMessage
              id="ChooseYourOwn.mlb.featuringFooter"
              defaultMessage="Featuring all {clubCount, number} MLB officially licensed clubs"
              values={{
                clubCount: 30,
              }}
            />
          </FooterText>

          <LogoList>
            <li>
              <img src={mlbLogo} alt="" />
            </li>
            <li>
              <img src={mlbpaLogo} alt="" />
            </li>
          </LogoList>
        </Footer>
      </CardContent>
    </FeaturedSport>
  );
};

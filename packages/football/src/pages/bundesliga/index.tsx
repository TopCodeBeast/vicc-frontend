import { useEffect } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Container } from '@sorare/core/src/atoms/container';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import LandingFootball from '@sorare/core/src/components/landing/LandingFootball';
import { BuildYourLegacy } from '@sorare/core/src/components/landing/LandingFootball/BuildYourLegacy';
import { BuildYourLegacyTitle } from '@sorare/core/src/components/landing/LandingFootball/BuildYourLegacyTitle';
import PlayNowButton from '@sorare/core/src/components/landing/LandingFootball/PlayNowButton';
import WinRewardsBlock, {
  WinRewardsImg,
} from '@sorare/core/src/components/landing/LandingFootball/WinRewardsBlock';
import winRewardsEth from '@sorare/core/src/components/landing/LandingFootball/assets/collect-eth.png';
import winRewardsHat from '@sorare/core/src/components/landing/LandingFootball/assets/collect-hat.png';
import winRewardsJersey from '@sorare/core/src/components/landing/LandingFootball/assets/collect-jersey.png';
import winRewardsStars from '@sorare/core/src/components/landing/LandingFootball/assets/collect-stars.jpg';
import { defaultTranslations } from '@sorare/core/src/components/landing/LandingFootball/defaultTranslations';
import { SubTitle } from '@sorare/core/src/components/landing/LandingFootball/ui';
import { BUNDESLIGA_DRAFT } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useReferrer from '@sorare/core/src/contexts/queryString/useReferrer';
import {
  Level,
  useSnackNotificationContext,
} from '@sorare/core/src/contexts/snackNotification';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import LoggedOutAppBarWithLogo from '@sorare/core/src/routing/MultiSportAppBar/LoggedOutAppBarWithLogo';
import MultiSportFooter from '@sorare/core/src/routing/MultiSportFooter';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import useFontFaceObserver from '@sorare/use-font-face-observer';
import winRewardsCards from '@football/assets/landing/bundesliga/collect-cards.png';
import winRewardsTickets from '@football/assets/landing/bundesliga/collect-tickets.png';
import headerLogo from '@football/assets/landing/bundesliga/logo.svg';
import metaImg from '@football/assets/landing/bundesliga/meta-img.jpg';
import playersMobile from '@football/assets/landing/bundesliga/players-mobile.png';
import players from '@football/assets/landing/bundesliga/players.png';

import '@sorare/core/src/style/drukFontFaces.css';
import '@sorare/core/src/style/romieFontFaces.css';

const messages = defineMessages({
  subtitle: {
    id: 'BundesligaLanding.BuildYourLegacy.Subtitle',
    defaultMessage:
      'Create your ultimate Bundesliga fantasy team and compete to win epic rewards, just like a pro football club owner.',
  },
  metadatasTitle: {
    id: 'BundesligaLanding.metadatas.title',
    defaultMessage: 'The free-to-play Fantasy Bundesliga Game – Vicc',
  },
  metadatasDescription: {
    id: 'BundesligaLanding.metadatas.description',
    defaultMessage:
      'Bundesliga: Play Vicc’s free fantasy Bundesliga game. Collect, buy, sell, and compete with ownable digital player cards to win rewards.',
  },
});

const StarsImg = styled(WinRewardsImg).attrs({ src: winRewardsStars })`
  width: 80%;
  border-radius: var(--unit);
`;

const rewards = [
  {
    label: defaultTranslations.winRewardsMeetStars,
    img: <StarsImg />,
  },
  {
    label: defaultTranslations.winRewardsEth,
    img: <WinRewardsImg src={winRewardsEth} style={{ width: '80%' }} />,
  },
  {
    label: defaultTranslations.winRewardsCards,
    img: <WinRewardsImg src={winRewardsCards} style={{ width: '84%' }} />,
  },
  {
    label: defaultTranslations.winRewardsTickets,
    img: <WinRewardsImg src={winRewardsTickets} style={{ width: '75%' }} />,
  },
  {
    label: defaultTranslations.winRewardsJersey,
    img: <WinRewardsImg src={winRewardsJersey} style={{ width: '70%' }} />,
  },
  {
    label: defaultTranslations.winRewardsMerch,
    img: <WinRewardsImg src={winRewardsHat} style={{ width: '80%' }} />,
  },
];

const PageBackground = styled.div`
  background: var(--c-static-neutral-1000);
  background-size: cover;
  color: var(--c-static-neutral-100);
  text-align: center;
  width: 100%;
`;

const HeroContainer = styled.div`
  padding-bottom: 20px;
  @media ${tabletAndAbove} {
    padding-bottom: 60px;
  }
`;

const StyledSubTitle = styled(SubTitle)`
  max-width: 640px;
`;

const StyledContainer = styled(Container)`
  --container-padding: 0px;
`;

const BundesligaLanding = () => {
  const { up: isTablet } = useScreenSize('tablet');
  const { currentUser } = useCurrentUserContext();
  const fontStatus = useFontFaceObserver(
    [{ family: 'DrukWide-Super', weight: 'bold' }, { family: 'Romie-regular' }],
    { timeout: 1000 }
  );
  const track = useEvents();

  const { referrer, invalidReferrer, removeReferrer } = useReferrer();
  const { showNotification } = useSnackNotificationContext();

  useEffect(() => {
    if (invalidReferrer) {
      showNotification(
        'unknownReferrer',
        { referrer, strong: Bold },
        {
          level: Level.ERROR,
          autoHideDuration: null,
          onClosed: removeReferrer,
        }
      );
    }
  }, [showNotification, invalidReferrer, referrer, removeReferrer]);

  useEffect(() => {
    if (!currentUser)
      track('View Homepage Disconnected', {
        landing_variant: 'Bundesliga_landing',
      });
  }, [currentUser, track]);

  if (fontStatus === 'initial') return null; // allow rendering without the right font after the timeout

  const playersImg = isTablet ? players : playersMobile;

  return (
    <LandingFootball
      loggedInPath={BUNDESLIGA_DRAFT}
      metadata={{
        title: messages.metadatasTitle,
        description: messages.metadatasDescription,
        img: metaImg,
      }}
    >
      <>
        <PageBackground>
          <LoggedOutAppBarWithLogo
            title="Vicc – Bundesliga"
            hideViccLogo
            logo={<img width="180px" src={headerLogo} alt="Bundesliga" />}
          />
          <HeroContainer>
            <BuildYourLegacy
              playerImg={playersImg}
              logo={
                <img width="160px" alt="Vicc – Bundesliga" src={headerLogo} />
              }
              backgroundOverlayColor="transparent"
            >
              <StyledContainer>
                <BuildYourLegacyTitle useV2 />
              </StyledContainer>
              <StyledSubTitle>
                <FormattedMessage {...messages.subtitle} />
              </StyledSubTitle>
              <PlayNowButton to={BUNDESLIGA_DRAFT} color="dark" />
            </BuildYourLegacy>
          </HeroContainer>
          <WinRewardsBlock showSliderDotsIndicator rewards={rewards} />
        </PageBackground>
        <MultiSportFooter />
      </>
    </LandingFootball>
  );
};

export default BundesligaLanding;

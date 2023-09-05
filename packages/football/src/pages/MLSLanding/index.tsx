import { useEffect } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import BannerWrapper from '@sorare/core/src/components/BannerWrapper';
import poster from '@sorare/core/src/components/content/BrandingVideo/assets/videoBg.jpg';
import { ChooseYourSportContent } from '@sorare/core/src/components/landing/ChooseYourSport/Content';
import LandingFootball from '@sorare/core/src/components/landing/LandingFootball';
import Baseline from '@sorare/core/src/components/landing/LandingFootball/Baseline';
import { BuildYourLegacy } from '@sorare/core/src/components/landing/LandingFootball/BuildYourLegacy';
import { BuildYourLegacyTitle } from '@sorare/core/src/components/landing/LandingFootball/BuildYourLegacyTitle';
import CTABanner from '@sorare/core/src/components/landing/LandingFootball/CTABanner';
import CollectBlock from '@sorare/core/src/components/landing/LandingFootball/CollectBlock';
import ComposeBlock from '@sorare/core/src/components/landing/LandingFootball/ComposeBlock';
import PlayNowButton from '@sorare/core/src/components/landing/LandingFootball/PlayNowButton';
import Video from '@sorare/core/src/components/landing/LandingFootball/Video';
import WinRewardsBlock, {
  WinRewardsImg,
} from '@sorare/core/src/components/landing/LandingFootball/WinRewardsBlock';
import winRewardsEth from '@sorare/core/src/components/landing/LandingFootball/assets/collect-eth.png';
import winRewardsHat from '@sorare/core/src/components/landing/LandingFootball/assets/collect-hat.png';
import winRewardsJersey from '@sorare/core/src/components/landing/LandingFootball/assets/collect-jersey.png';
import winRewardsStars from '@sorare/core/src/components/landing/LandingFootball/assets/collect-stars.jpg';
import { defaultTranslations } from '@sorare/core/src/components/landing/LandingFootball/defaultTranslations';
import { SubTitle } from '@sorare/core/src/components/landing/LandingFootball/ui';
import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';
import { MLS_DRAFT } from '@sorare/core/src/constants/routes';
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

import winRewardsCards from './assets/collect-cards.png';
import winRewardsTickets from './assets/collect-tickets.png';
import collectCard1 from './assets/collect/card-1.png';
import collectCard2 from './assets/collect/card-2.png';
import collectCard3 from './assets/collect/card-3.png';
import collectCard4 from './assets/collect/card-4.png';
import collectCard5 from './assets/collect/card-5.png';
import collectBg from './assets/collectBg.jpg';
import composeCard1 from './assets/compose/cards-1.png';
import composeCard2 from './assets/compose/cards-2.png';
import composeCard3 from './assets/compose/cards-3.png';
import composeCard4 from './assets/compose/cards-4.png';
import composeCard5 from './assets/compose/cards-5.png';
import composeBg from './assets/composeBg.jpg';
import composeBgMobile from './assets/composeBgMobile.jpg';
import heroBgMobile from './assets/hero-bg-mobile.jpg';
import heroBg from './assets/hero-bg.jpg';
import logoDark from './assets/logo-dark.svg';
import headerLogo from './assets/logo.svg';
import metaImg from './assets/meta-img.jpg';
import players from './assets/players.png';
import playersMobile from './assets/playersMobile.png';
import whiteBg from './assets/whiteBg.jpg';
import whiteBgMobile from './assets/whiteBgMobile.jpg';

import '@sorare/core/src/style/drukFontFaces.css';
import '@sorare/core/src/style/romieFontFaces.css';

const videoSrc = `${FRONTEND_ASSET_HOST}/videos/sorare_how_to_play.mp4`;

const messages = defineMessages({
  collectBlockSubtitle: {
    id: 'MLSLanding.CollectBlock.subtitle',
    defaultMessage:
      'Collect, buy, sell, and trade officially licensed digital player cards from all 29 MLS teams.',
  },
  subtitle: {
    id: 'MLSLanding.BuildYourLegacy.Subtitle',
    defaultMessage:
      'Create your ultimate Major League Soccer fantasy team and play in free competitions to win epic rewards, just like a pro club owner-general manager.',
  },
  metadatasTitle: {
    id: 'MLSLanding.metadatas.title',
    defaultMessage: 'The free-to-play Fantasy MLS Game – Sorare',
  },
  metadatasDescription: {
    id: 'MLSLanding.metadatas.description',
    defaultMessage:
      'MLS: Play Sorare’s free fantasy MLS game. Collect, buy, sell, and compete with ownable digital player cards to win rewards.',
  },
});

const collectblockCards = [
  {
    src: collectCard1,
    alt: 'Armand Laurienté',
  },
  {
    src: collectCard2,
    alt: 'Facundo Torres',
  },
  {
    src: collectCard3,
    alt: 'Thiago Almada',
  },
  {
    src: collectCard4,
    alt: 'Jader Obrian',
  },
  {
    src: collectCard5,
    alt: 'Alex Roldan',
  },
];

interface Item {
  src: string;
  alt: string;
}

const composeblockCards: [Item, Item, Item, Item, Item] = [
  {
    src: composeCard3,
    alt: 'Denis Bouanga',
  },
  {
    src: composeCard5,
    alt: 'Roberto Pereyra',
  },
  {
    src: composeCard4,
    alt: 'Marco Carnesecchi',
  },
  {
    src: composeCard1,
    alt: 'Walker Zimmerman',
  },
  {
    src: composeCard2,
    alt: 'Daniel Gazdag',
  },
];

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
  background: var(--c-brand-mls);
  color: var(--c-static-neutral-100);
  text-align: center;
  width: 100%;
`;

const WhiteBackground = styled.div`
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center bottom;
  color: var(--c-static-neutral-1000);
  text-align: center;
  width: 100%;
  background-image: url(${whiteBgMobile});
  @media ${tabletAndAbove} {
    background-image: url(${whiteBg});
  }
`;

const StyledSubTitle = styled(SubTitle)`
  max-width: 640px;
`;

const BannerContent = styled.div`
  background-color: var(--c-static-neutral-1000);
  padding: calc(5 * var(--unit)) 0;
`;

const HeroBackground = styled.div`
  width: 100%;
  padding-top: var(--unit);
  background-image: url(${heroBgMobile});

  background-size: cover;
  position: relative;

  @media ${tabletAndAbove} {
    padding-top: 40px;
    background-image: url(${heroBg});
  }
`;

const StyledVideo = styled(Video)`
  padding-bottom: calc(10 * var(--unit));
`;

const LinearGradientBackground = styled.div`
  width: 100%;
  background: linear-gradient(180deg, transparent 0%, var(--c-brand-mls) 72%);
  background-size: cover;
  position: relative;
`;

const MLSLanding = () => {
  const { up: isTablet } = useScreenSize('tablet');
  const { currentUser } = useCurrentUserContext();
  const { formatMessage } = useIntl();
  const fontStatus = useFontFaceObserver(
    [{ family: 'DrukWide-Super', weight: 'bold' }, { family: 'Romie-regular' }],
    { timeout: 1000 }
  );

  const { referrer, invalidReferrer, removeReferrer } = useReferrer();
  const { showNotification } = useSnackNotificationContext();
  const track = useEvents();

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
        landing_variant: 'MLS_landing',
      });
  }, [currentUser, track]);

  if (fontStatus === 'initial') return null; // allow rendering without the right font after the timeout

  const playersImg = isTablet ? players : playersMobile;

  return (
    <LandingFootball
      loggedInPath={MLS_DRAFT}
      metadata={{
        title: messages.metadatasTitle,
        description: messages.metadatasDescription,
        img: metaImg,
      }}
    >
      <>
        <PageBackground>
          <HeroBackground>
            <LinearGradientBackground>
              <LoggedOutAppBarWithLogo
                title="Sorare – MLS"
                hideSorareLogo
                logo={<img width="180px" src={headerLogo} alt="MLS" />}
              />
              <BuildYourLegacy
                playerImg={playersImg}
                logo={<img width="120px" alt="Sorare – MLS" src={headerLogo} />}
                backgroundOverlayColor="var(--c-brand-mls)"
              >
                <BuildYourLegacyTitle />
                <StyledSubTitle>
                  <FormattedMessage {...messages.subtitle} />
                </StyledSubTitle>
                <PlayNowButton to={MLS_DRAFT} color="dark" />
              </BuildYourLegacy>
            </LinearGradientBackground>
          </HeroBackground>
          <CollectBlock
            subtitle={formatMessage(messages.collectBlockSubtitle)}
            cards={collectblockCards}
            background={collectBg}
            backgroundOverlayColor="transparent"
          />
          <ComposeBlock
            cards={composeblockCards}
            background={isTablet ? composeBg : composeBgMobile}
          />
          <WhiteBackground>
            <WinRewardsBlock rewards={rewards} />
            <StyledVideo
              title={formatMessage(defaultTranslations.videoTitle)}
              subtitle={formatMessage(defaultTranslations.videoSubtitle)}
              mobileSrc={videoSrc}
              src={videoSrc}
              poster={poster}
            />
            <CTABanner
              hideSorareLogo
              to={MLS_DRAFT}
              logo={
                <img
                  width={isTablet ? '480px' : '300px'}
                  src={logoDark}
                  alt="MLS"
                />
              }
            />
            <Baseline />
          </WhiteBackground>
        </PageBackground>

        <BannerWrapper sport={Sport.CRICKET}>
          <BannerContent>
            <ChooseYourSportContent hideDescription />
          </BannerContent>
        </BannerWrapper>
        <MultiSportFooter />
      </>
    </LandingFootball>
  );
};

export default MLSLanding;

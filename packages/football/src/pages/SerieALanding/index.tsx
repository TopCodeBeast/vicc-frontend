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
import winRewardsHat from '@sorare/core/src/components/landing/LandingFootball/assets/collect-hat.png';
import winRewardsJersey from '@sorare/core/src/components/landing/LandingFootball/assets/collect-jersey.png';
import winRewardsStars from '@sorare/core/src/components/landing/LandingFootball/assets/collect-stars.jpg';
import { defaultTranslations } from '@sorare/core/src/components/landing/LandingFootball/defaultTranslations';
import { SubTitle } from '@sorare/core/src/components/landing/LandingFootball/ui';
import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';
import { SERIE_A_DRAFT } from '@sorare/core/src/constants/routes';
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

import CTABannerBg from './assets/CTABannerBg.jpg';
import SerieALogo from './assets/SerieALogo.png';
import winRewardsCards from './assets/collect-cards.png';
import winRewardsTickets from './assets/collect-tickets.png';
import composeBg from './assets/composeBg.png';
import composeBgMobile from './assets/composeBgMobile.png';
import mobileLogo from './assets/mobileLogo.png';
import players from './assets/players.png';
import playersMobile from './assets/playersMobile.png';

import '@sorare/core/src/style/drukFontFaces.css';
import '@sorare/core/src/style/romieFontFaces.css';

const videoSrc = `${FRONTEND_ASSET_HOST}/videos/sorare_how_to_play.mp4`;

const messages = defineMessages({
  collectBlockSubtitle: {
    id: 'SerieALanding.CollectBlock.subtitle',
    defaultMessage:
      'Collect, buy, sell, and trade officially licensed digital player cards from across Serie A.',
  },
  subtitle: {
    id: 'SerieALanding.BuildYourLegacy.Subtitle',
    defaultMessage:
      'Create your ultimate Serie A fantasy team and play in free competitions to win epic rewards, just like a pro club owner.',
  },
  metadatasTitle: {
    id: 'SerieALanding.metadatas.title',
    defaultMessage: 'The free-to-play Fantasy Serie A Game – Sorare',
  },
  metadatasDescription: {
    id: 'SerieALanding.metadatas.description',
    defaultMessage:
      'Serie A: Play Sorare’s free fantasy Serie A game. Collect, buy, sell, and compete with ownable digital player cards to win rewards.',
  },
});

const collectblockCards = [
  {
    src: 'https://assets.sorare.com/image-resize/card/1b9b3e7a-848f-40e9-b332-605203b770f1/picture/tinified-cf5a6c00dc2f75daab62096a822742d6.png?width=640',
    alt: 'Armand Laurienté',
  },
  {
    src: 'https://assets.sorare.com/image-resize/card/91dd5f61-612b-463a-87ee-954b480a11fe/picture/tinified-e0b63c38f189c0ed07fb772a1226c527.png?width=640',
    alt: 'Mike Maignan',
  },
  {
    src: 'https://assets.sorare.com/image-resize/card/6a9ad3f4-32b3-4f17-8267-e6c73881f44f/picture/tinified-c12eb4eb02338490cf7b38bc00876f2a.png?width=640',
    alt: 'Victor Osimhen',
  },
  {
    src: 'https://assets.sorare.com/image-resize/carddata/df28cb36-ca97-44e2-bcbf-61d92a80c933/picture/tinified-3b749c97ffdd75206645026b0192ec1d.png?width=640',
    alt: 'Mattia Zaccagni',
  },
  {
    src: 'https://assets.sorare.com/image-resize/carddata/e414b214-401e-40e8-86e6-fd2232bc7f53/picture/tinified-201622d82d3a6d42d17d6c28393f4338.png?width=640',
    alt: 'Marko Arnautović',
  },
];

interface Item {
  src: string;
  alt: string;
}

const composeblockCards: [Item, Item, Item, Item, Item] = [
  {
    src: 'https://assets.sorare.com/image-resize/carddata/b57531db-b145-437a-8e8f-ea8b0919069b/picture/tinified-0bb3b607cc0b6525cd1a8bccb7ea3288.png?width=640',
    alt: 'Gerard Deulofeu',
  },
  {
    src: 'https://assets.sorare.com/image-resize/carddata/9efceac6-b398-41ea-8581-79295d622c96/picture/tinified-97b0ff8f47ca675ddec6c38658016c31.png?width=640',
    alt: 'Sergej Milinković-Savić',
  },
  {
    src: 'https://assets.sorare.com/image-resize/carddata/83b986e5-2ed1-46b7-90ec-023d9d5696a5/picture/tinified-fc46cbfa4f212444569f5e6f0119b601.png?width=640',
    alt: 'Samuel Umtiti',
  },
  {
    src: 'https://assets.sorare.com/image-resize/card/0aea9cf5-e6a7-4de1-9d5b-9a347548e7e2/picture/tinified-bd344314830d8f5a1cbd67054eff7fb6.png?width=640',
    alt: 'Marco Carnesecchi',
  },
  {
    src: 'https://assets.sorare.com/image-resize/carddata/d80b5f9b-fe8a-40fe-aff7-77ecb2c5a1e5/picture/tinified-dbffdec7fcff985dd186869ce2241ba8.png?width=640',
    alt: 'Roberto Pereyra',
  },
];

const HatImg = styled(WinRewardsImg).attrs({ src: winRewardsHat })`
  width: 80%;
`;
const JerseyImg = styled(WinRewardsImg).attrs({ src: winRewardsJersey })`
  width: 70%;
`;
const TicketsImg = styled(WinRewardsImg).attrs({ src: winRewardsTickets })`
  width: 60%;
`;
const CardsImg = styled(WinRewardsImg).attrs({ src: winRewardsCards })`
  width: 80%;
`;
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
    label: defaultTranslations.winRewardsCards,
    img: <CardsImg />,
  },
  {
    label: defaultTranslations.winRewardsTickets,
    img: <TicketsImg />,
  },
  {
    label: defaultTranslations.winRewardsJersey,
    img: <JerseyImg />,
  },
  {
    label: defaultTranslations.winRewardsMerch,
    img: <HatImg />,
  },
];

const PageBackground = styled.div`
  background: var(--c-brand-serie-a);
  color: var(--c-static-neutral-100);
  text-align: center;
  width: 100%;
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
  background: conic-gradient(
      from 21.33deg at 63.75% 92.08%,
      rgba(0, 23, 125, 0.44) 0deg,
      rgba(16, 90, 199, 0) 360deg
    ),
    conic-gradient(
      from 205.79deg at 33.89% 0%,
      #00177d 0deg,
      rgba(16, 90, 199, 0) 360deg
    ),
    conic-gradient(
      from 148.76deg at 0% 74.46%,
      #00177d 0deg,
      rgba(16, 90, 199, 0) 360deg
    ),
    conic-gradient(
      from 0deg at 74.1% 66.83%,
      #00c9f3 0deg,
      rgba(0, 201, 243, 0) 360deg
    ),
    linear-gradient(0deg, #105ac7, #105ac7);

  background-size: cover;
  position: relative;

  @media ${tabletAndAbove} {
    padding-top: 40px;
  }
`;

const StyledVideo = styled(Video)`
  padding-bottom: calc(10 * var(--unit));
`;

const LinearGradientBackground = styled.div`
  width: 100%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--c-brand-serie-a) 72%
  );
  background-size: cover;
  position: relative;
`;

const metadatasImg =
  'https://frontend-assets.sorare.com/meta/social_serie_a.jpg';

const SerieALanding = () => {
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
        landing_variant: 'SerieA_landing',
      });
  }, [currentUser, track]);

  if (fontStatus === 'initial') return null; // allow rendering without the right font after the timeout

  const playersImg = isTablet ? players : playersMobile;

  return (
    <LandingFootball
      loggedInPath={SERIE_A_DRAFT}
      metadata={{
        title: messages.metadatasTitle,
        description: messages.metadatasDescription,
        img: metadatasImg,
      }}
    >
      <>
        <PageBackground>
          <HeroBackground>
            <LinearGradientBackground>
              <LoggedOutAppBarWithLogo
                title="Sorare – Serie A"
                logo={<img width="30px" src={SerieALogo} alt="Serie A" />}
              />
              <BuildYourLegacy
                playerImg={playersImg}
                logo={
                  <img width="120px" alt="Sorare – Serie A" src={mobileLogo} />
                }
                backgroundOverlayColor="var(--c-brand-serie-a)"
              >
                <BuildYourLegacyTitle />
                <StyledSubTitle>
                  <FormattedMessage {...messages.subtitle} />
                </StyledSubTitle>
                <PlayNowButton to={SERIE_A_DRAFT} color="dark" />
              </BuildYourLegacy>
            </LinearGradientBackground>
          </HeroBackground>
          <CollectBlock
            subtitle={formatMessage(messages.collectBlockSubtitle)}
            cards={collectblockCards}
            background={isTablet ? composeBg : composeBgMobile}
            backgroundOverlayColor="var(--c-brand-serie-a)"
          />
          <ComposeBlock
            cards={composeblockCards}
            background={isTablet ? composeBg : composeBgMobile}
          />
          <WinRewardsBlock rewards={rewards} />
          <StyledVideo
            title={formatMessage(defaultTranslations.videoTitle)}
            subtitle={formatMessage(defaultTranslations.videoSubtitle)}
            mobileSrc={videoSrc}
            src={videoSrc}
            poster={poster}
          />
          <CTABanner
            bgImage={CTABannerBg}
            to={SERIE_A_DRAFT}
            logo={<img width="30px" src={SerieALogo} alt="Serie A" />}
          />
        </PageBackground>
        <Baseline />
        <BannerWrapper sport={Sport.FOOTBALL}>
          <BannerContent>
            <ChooseYourSportContent hideDescription />
          </BannerContent>
        </BannerWrapper>
        <MultiSportFooter />
      </>
    </LandingFootball>
  );
};

export default SerieALanding;

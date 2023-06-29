import { useEffect } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import BannerWrapper from '@sorare/core/src/components/BannerWrapper';
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
import { defaultTranslations } from '@sorare/core/src/components/landing/LandingFootball/defaultTranslations';
import { SubTitle } from '@sorare/core/src/components/landing/LandingFootball/ui';
import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';
import { LALIGA_DRAFT } from '@sorare/core/src/constants/routes';
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

import CTABannerBg from './assets/CTABannerBg.svg';
import collectBg from './assets/collect-bg.svg';
import winRewardsShirt from './assets/collect-shirt.png';
import winRewardsStars from './assets/collect-stars-meeting.png';
import winRewardsTickets from './assets/collect-tickets.png';
import composeBg from './assets/compose-bg.svg';
import logo from './assets/full-logo.png';
import heroBg from './assets/heroBg.svg';
import players from './assets/players.png';
import playersMobile from './assets/playersMobile.png';
import poster from './assets/poster.jpg';

import '@sorare/core/src/style/drukFontFaces.css';
import '@sorare/core/src/style/romieFontFaces.css';

const videoSrc = `${FRONTEND_ASSET_HOST}/videos/sorare_how_to_play_laliga.mp4`;

const messages = defineMessages({
  collectBlockSubtitle: {
    id: 'LaLigaLanding.CollectBlock.subtitle',
    defaultMessage:
      'Collect, buy, sell, and trade officially licensed digital player cards from across LaLiga Santander’s 20 clubs.',
  },
  subtitle: {
    id: 'LaLigaLanding.BuildYourLegacy.Subtitle',
    defaultMessage:
      'Create your ultimate LaLiga Santander fantasy team and play in free competitions to win epic rewards, just like a pro club owner.',
  },
  metadatasTitle: {
    id: 'LaLigaLanding.metadatas.title',
    defaultMessage: 'The free-to-play Fantasy LaLiga Santander Game – Sorare',
  },
  metadatasDescription: {
    id: 'LaLigaLanding.metadatas.description',
    defaultMessage:
      'Play Sorare’s fantasy LaLiga Santander game. Collect, buy, sell, and compete with ownable digital player cards from all 20 LaLiga Santander football clubs to win rewards.',
  },
});

const collectblockCards = [
  {
    src: 'https://assets.sorare.com/image-resize/card/335536c0-0b06-4844-89e6-ba9853843583/picture/tinified-447ecd8a11fc83c433bbec06f364317a.png?width=640',
    alt: 'Gabriel Veiga',
  },
  {
    src: 'https://assets.sorare.com/image-resize/carddata/7c44d979-f47a-4e55-aa08-d9da49072c27/picture/tinified-0ba2d76cef7b3138de03edfdec335ab7.png?width=640',
    alt: 'Chimy Ávila',
  },
  {
    src: 'https://assets.sorare.com/image-resize/carddata/4560cc42-d5e4-4bec-967f-68e64ddd90a0/picture/tinified-e6deca0d58b597fce19476c34cb3a873.png?width=640',
    alt: 'Pedri',
  },
  {
    src: 'https://assets.sorare.com/image-resize/carddata/1c03e033-da50-467b-86f0-3b9ac77b1d00/picture/tinified-cc8237a8029b29951084bbe40c21585a.png?width=640',
    alt: 'Luis Milla',
  },
  {
    src: 'https://assets.sorare.com/image-resize/carddata/ac32ff34-b8f0-4a5d-b041-84d475718945/picture/tinified-3582c398aade3e7eb6d24e42d11af794.png?width=640',
    alt: 'Aleix García',
  },
];

interface Item {
  src: string;
  alt: string;
}

const composeblockCards: [Item, Item, Item, Item, Item] = [
  {
    src: 'https://assets.sorare.com/image-resize/carddata/683a5224-1935-4855-9ebb-97c90a926aa0/picture/tinified-9c2b7a61c1197f725823d9e0c8d03032.png?width=640',
    alt: 'Joselu',
  },
  {
    src: 'https://assets.sorare.com/image-resize/carddata/e0478900-4655-448f-84af-f2a3b5b83fdc/picture/tinified-a722972c4a144a3b382652522eb2e061.png?width=640',
    alt: 'Vinícius Júnior',
  },
  {
    src: 'https://assets.sorare.com/image-resize/carddata/f01f45ae-4a32-4d55-bb4e-da6df852f134/picture/tinified-2f6acd23dcccb6ce50622cdc7cf488a0.png?width=640',
    alt: 'Kang-In Lee',
  },
  {
    src: 'https://assets.sorare.com/image-resize/carddata/e656ae12-2871-44ef-bf34-da0f147199e0/picture/tinified-5c8c4752165affcec9acf06984f1be74.png?width=640',
    alt: 'Giorgi Mamardashvili',
  },
  {
    src: 'https://assets.sorare.com/image-resize/carddata/ffe618d5-5248-41b7-87a4-2723ffeb65a2/picture/tinified-856d90c8d7a45be8171bb494e1310990.png?width=640',
    alt: 'Dani Parejo',
  },
];

const HatImg = styled(WinRewardsImg).attrs({ src: winRewardsHat })`
  width: 80%;
`;
const EthImg = styled(WinRewardsImg).attrs({ src: winRewardsEth })`
  width: 80%;
`;
const JerseyImg = styled(WinRewardsImg).attrs({ src: winRewardsShirt })`
  width: 70%;
`;
const TicketsImg = styled(WinRewardsImg).attrs({ src: winRewardsTickets })`
  width: 70%;
`;
const CardsImg = styled(WinRewardsImg).attrs({
  src: 'https://assets.sorare.com/image-resize/carddata/4560cc42-d5e4-4bec-967f-68e64ddd90a0/picture/tinified-e6deca0d58b597fce19476c34cb3a873.png?width=640',
})`
  width: 46%;
`;
const StarsImg = styled(WinRewardsImg).attrs({ src: winRewardsStars })`
  width: 60%;
  border-radius: var(--unit);
`;

const rewards = [
  {
    label: defaultTranslations.winRewardsMeetStars,
    img: <StarsImg />,
  },
  {
    label: defaultTranslations.winRewardsEth,
    img: <EthImg />,
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
  background: var(--c-brand-laliga-santander);
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

const BlackBackground = styled.div`
  background-color: #131313;
`;

const HeroBackground = styled.div`
  width: 100%;
  padding-top: var(--unit);
  background-size: cover;
  position: relative;
  background-image: url(${heroBg});
  background-position: center;

  @media ${tabletAndAbove} {
    padding-top: 40px;
  }
`;

const LinearGradientBackground = styled.div`
  width: 100%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--c-brand-laliga-santander) 72%
  );
  background-size: cover;
  position: relative;
`;

const BannerBackground = styled.div`
  background-image: url(${CTABannerBg});
  background-size: cover;
  background-position: center;
`;

const metadatasImg =
  'https://frontend-assets.sorare.com/meta/social_laliga_santander.jpg';

const LaLigaLanding = () => {
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
        landing_variant: 'LaLigaSantander_landing',
      });
  }, [currentUser, track]);

  if (fontStatus === 'initial') return null; // allow rendering without the right font after the timeout

  const playersImg = isTablet ? players : playersMobile;

  return (
    <LandingFootball
      loggedInPath={LALIGA_DRAFT}
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
                title="Sorare – LaLiga Santander"
                hideSorareLogo
                logo={<img width="220px" src={logo} alt="LaLiga Santander" />}
              />
              <BuildYourLegacy
                playerImg={playersImg}
                logo={
                  <img
                    width="240px"
                    alt="Sorare – LaLiga Santander"
                    src={logo}
                  />
                }
                backgroundOverlayColor="var(--c-brand-laliga-santander)"
              >
                <BuildYourLegacyTitle />
                <StyledSubTitle>
                  <FormattedMessage {...messages.subtitle} />
                </StyledSubTitle>
                <PlayNowButton to={LALIGA_DRAFT} color="dark" />
              </BuildYourLegacy>
            </LinearGradientBackground>
          </HeroBackground>
          <Video
            title={formatMessage(defaultTranslations.videoTitle)}
            subtitle={formatMessage(defaultTranslations.videoSubtitle)}
            mobileSrc={videoSrc}
            src={videoSrc}
            poster={poster}
          />
          <CollectBlock
            background={collectBg}
            subtitle={formatMessage(messages.collectBlockSubtitle)}
            cards={collectblockCards}
            backgroundOverlayColor="var(--c-brand-laliga-santander)"
          />
          <BlackBackground>
            <ComposeBlock background={composeBg} cards={composeblockCards} />
            <WinRewardsBlock rewards={rewards} />
            <BannerBackground>
              <CTABanner
                to={LALIGA_DRAFT}
                hideSorareLogo
                logo={
                  <img
                    width={isTablet ? '340px' : '260px'}
                    src={logo}
                    alt="LaLiga Santander"
                  />
                }
              />
            </BannerBackground>
          </BlackBackground>
        </PageBackground>
        <Baseline dark />
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

export default LaLigaLanding;

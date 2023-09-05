import { ReactNode, useEffect } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import Bold from '@sorare/core/src/atoms/typography/Bold';
import poster from '@sorare/core/src/components/content/BrandingVideo/assets/videoBg.jpg';
import LandingFootball from '@sorare/core/src/components/landing/LandingFootball';
import { BuildYourLegacy } from '@sorare/core/src/components/landing/LandingFootball/BuildYourLegacy';
import backgroundMobile from '@sorare/core/src/components/landing/LandingFootball/BuildYourLegacy/assets/background-mobile.png';
import players from '@sorare/core/src/components/landing/LandingFootball/BuildYourLegacy/assets/players.png';
import { BuildYourLegacyTitle } from '@sorare/core/src/components/landing/LandingFootball/BuildYourLegacyTitle';
import CollectBlock from '@sorare/core/src/components/landing/LandingFootball/CollectBlock';
import ComposeBlock from '@sorare/core/src/components/landing/LandingFootball/ComposeBlock';
import PageFooter from '@sorare/core/src/components/landing/LandingFootball/PageFooter';
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
import { EPL_DRAFT } from '@sorare/core/src/constants/routes';
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
import { breakpoints, tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import useFontFaceObserver from '@sorare/use-font-face-observer';

import EPLLogo from './assets/EPLLogo.svg';
import bgMobile from './assets/bg-mobile.jpg';
import bg from './assets/bg.jpg';
import card1 from './assets/card1.png';
import card2 from './assets/card2.png';
import card3 from './assets/card3.png';
import card4 from './assets/card4.png';
import card5 from './assets/card5.png';
import winRewardsCards from './assets/collect-cards.png';
import winRewardsTickets from './assets/collect-tickets.png';
import composeCard1 from './assets/composeCard1.png';
import composeCard2 from './assets/composeCard2.png';
import composeCard3 from './assets/composeCard3.png';
import composeCard4 from './assets/composeCard4.png';
import composeCard5 from './assets/composeCard5.png';
import mobileLogo from './assets/sorare-premier-league.svg';
import thunderbolt from './assets/thunderbolt.svg';
import thunderboltCollect from './assets/thunderboltCollect.svg';
import thunderboltCompose from './assets/thunderboltCompose.svg';

import '@sorare/core/src/style/drukFontFaces.css';
import '@sorare/core/src/style/romieFontFaces.css';

const videoSrc = `${FRONTEND_ASSET_HOST}/videos/sorare_premier_league.mp4`;
const videoSrcMobile = `${FRONTEND_ASSET_HOST}/videos/sorare_premier_league_mobile.mp4`;

const messages = defineMessages({
  collectBlockTitle: {
    id: 'collectBlock.title',
    defaultMessage: '<span>Collect Officially Licensed</span>{br}Digital Cards',
  },
  collectBlockSubtitle: {
    id: 'collectBlock.subtitle',
    defaultMessage:
      'Roster any player from across the Premier League’s 20 clubs.',
  },
  composeBlockTitle: {
    id: 'ComposeBlock.compose',
    defaultMessage: 'Build your{br}Club + compete',
  },
  composeBlockSubtitle: {
    id: 'ComposeBlock.subtitle',
    defaultMessage:
      'Flex your Premier League knowledge to compose the best five-player lineup and play against global fans.',
  },
  subtitle: {
    id: 'BuildYourLegacy.PLOnVicc',
    defaultMessage: 'The Premier League is now on Vicc.',
  },
  subtitleV2: {
    id: 'BuildYourLegacy.subtitleV2',
    defaultMessage:
      'Create your ultimate Premier League fantasy team and play in free competitions to win epic rewards, just like an PL club owner.',
  },
  subtitleJoin: {
    id: 'BuildYourLegacy.Join',
    defaultMessage: 'Join the fantasy football revolution',
  },
  winRewardsTitle: {
    id: 'WinRewards.title',
    defaultMessage: '<span>Win Exclusive</span>{br}Rewards',
  },
  metadatasTitle: {
    id: 'EPLLanding.metadatas.title',
    defaultMessage: 'The free-to-play Fantasy Premier League Game – Vicc',
  },
  metadatasDescription: {
    id: 'EPLLanding.metadatas.description',
    defaultMessage:
      "Collect, play and win officially licensed digital cards featuring players from the Premier League, the world's best football league on Vicc",
  },
});

const collectblockCards = [
  { src: card5, alt: 'Emiliano Martinez' },
  { src: card1, alt: 'Çağlar Söyüncü' },
  { src: card3, alt: 'Erling Haaland' },
  { src: card2, alt: 'Mohamed Salah' },
  { src: card4, alt: 'Gabriel Martinelli' },
];

interface Item {
  src: string;
  alt: string;
}

const composeblockCards: [Item, Item, Item, Item, Item] = [
  { src: composeCard1, alt: 'Theo Walcott' },
  { src: composeCard2, alt: 'Hwang Hee-chan' },
  { src: composeCard3, alt: 'Lucas Paquetá' },
  { src: composeCard4, alt: 'Allison Becker' },
  { src: composeCard5, alt: 'Miguel Almiron' },
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
  width: 100%;
`;
const StarsImg = styled(WinRewardsImg).attrs({ src: winRewardsStars })`
  width: 80%;
  border-radius: var(--unit);
`;
const EthImg = styled(WinRewardsImg).attrs({ src: winRewardsEth })`
  width: 80%;
`;

const PurpleBackground = styled.div<{ short?: boolean }>`
  background: var(--c-brand-premier-league);
  color: var(--c-static-neutral-100);
  text-align: center;
  width: 100%;
  ${({ short }) => short && 'padding-bottom: 100px;'}
`;

const ThunderboltBackground = styled.div`
  width: 100%;
  padding-top: var(--unit);
  background: url(${thunderbolt}) no-repeat top;
  background-size: cover;
  position: relative;

  @media ${tabletAndAbove} {
    padding-top: 40px;
  }
`;

const LinearGradientBackground = styled.div`
  width: 100%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--c-brand-premier-league) 72%
  );
  background-size: cover;
  position: relative;
`;

const StyledVideo = styled(Video)`
  @media (max-width: ${breakpoints.tablet}px) {
    /* Negative margin, because this block is covering the bottom of the previous block for EPL landing  */
    margin-top: -30px;
  }
`;

const metadatasImg =
  'https://frontend-assets.sorare.com/meta/social_premier_league.jpg';
export const metadata = {
  title: messages.metadatasTitle,
  description: messages.metadatasDescription,
  img: metadatasImg,
};

const EPLLanding = ({ short }: { short?: boolean }) => {
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
      track('View Homepage Disconnected', { landing_variant: 'EPL_launch' });
  }, [currentUser, track]);

  if (fontStatus === 'initial') return null; // allow rendering without the right font after the timeout

  const playersImg = isTablet ? players : backgroundMobile;

  const subtitle = short ? messages.subtitleV2 : messages.subtitle;

  const rewards = [
    {
      label: defaultTranslations.winRewardsMeetStars,
      img: <StarsImg />,
    },
    ...(short
      ? [
          {
            label: defaultTranslations.winRewardsEth,
            img: <EthImg />,
          },
        ]
      : []),
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

  return (
    <LandingFootball loggedInPath={EPL_DRAFT} metadata={metadata}>
      <>
        <PurpleBackground short={short}>
          <ThunderboltBackground>
            <LinearGradientBackground>
              <LoggedOutAppBarWithLogo
                title="Vicc - Premier League"
                logo={<img src={EPLLogo} alt="Premier League" />}
              />
              <BuildYourLegacy
                playerImg={playersImg}
                logo={<img alt="Vicc - Premier League" src={mobileLogo} />}
                backgroundOverlayColor="var(--c-brand-premier-league)"
              >
                <BuildYourLegacyTitle useV2={short} />
                <SubTitle>
                  <FormattedMessage {...subtitle} />
                  {!short && (
                    <>
                      <br />
                      <FormattedMessage {...messages.subtitleJoin} />
                    </>
                  )}
                </SubTitle>
                <PlayNowButton to={EPL_DRAFT} color="dark" />
              </BuildYourLegacy>
            </LinearGradientBackground>
          </ThunderboltBackground>
          {short ? (
            <WinRewardsBlock
              title={messages.winRewardsTitle}
              rewards={rewards}
            />
          ) : (
            <>
              <StyledVideo
                src={videoSrc}
                mobileSrc={videoSrcMobile}
                poster={poster}
              />
              <CollectBlock
                title={`formatMessage(messages.collectBlockTitle, {
                  span: (chunks: ReactNode[]) => {
                    return <span>{chunks}</span>;
                  },
                  br: <br />,
                })`}//TODO
                subtitle={formatMessage(messages.collectBlockSubtitle)}
                cards={collectblockCards}
                background={thunderboltCollect}
                backgroundOverlayColor="var(--c-brand-premier-league)"
              />
              <ComposeBlock
                title={formatMessage(messages.composeBlockTitle, {
                  br: <br />,
                })}
                subtitle={formatMessage(messages.composeBlockSubtitle)}
                cards={composeblockCards}
                background={thunderboltCompose}
              />
              <WinRewardsBlock
                title={messages.winRewardsTitle}
                rewards={rewards}
              />
              <PageFooter
                dark
                title={<BuildYourLegacyTitle />}
                to={EPL_DRAFT}
                bgImage={isTablet ? bg : bgMobile}
              />
            </>
          )}
        </PurpleBackground>

        <MultiSportFooter />
      </>
    </LandingFootball>
  );
};

export default EPLLanding;

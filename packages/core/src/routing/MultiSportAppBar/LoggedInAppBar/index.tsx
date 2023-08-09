import { faBars } from '@fortawesome/pro-regular-svg-icons';
import {
  faGear,
  faPen,
  faQuestionCircle,
  faRightFromBracket,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonBase } from '@material-ui/core';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Link, generatePath, useNavigate } from 'react-router-dom';
import { animated, useSpring } from '@react-spring/web';
import styled, { css } from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import { Container, FullWidth } from '@core/atoms/container';
import Dropdown from '@core/atoms/dropdowns/Dropdown';
import { ChevronDownBold } from '@core/atoms/icons/ChevronDownBold';
import { SorareLogo } from '@core/atoms/icons/SorareLogo';
import { Text16, text16 } from '@core/atoms/typography';
import Notifications from '@core/components/notification/Notifications';
import ManagerTaskTooltip from '@core/components/onboarding/managerTask/ManagerTaskTooltip';
import MarketplaceOnboardingTask from '@core/components/onboarding/managerTask/MarketplaceOnboardingTask';
import ResponsiveSearchBar from '@core/components/search/ResponsiveSearchBar';
import ActiveUserAvatar from '@core/components/user/ActiveUserAvatar';
import Avatar from '@core/components/user/Avatar';
import { HREF_HELP } from '@core/constants/externalLinks';
import {
  FOOTBALL_HOME,
  FOOTBALL_LOBBY_PRIZE_POOL,
  FOOTBALL_LOBBY_ROOT,
  FOOTBALL_MARKET,
  FOOTBALL_MARKET_STARTER_PACKS,
  FOOTBALL_NEW_SIGNINGS,
  FOOTBALL_PRIVATE_LEAGUES,
  FOOTBALL_TRANSFER_MARKET,
  FOOTBALL_USER_GALLERY_CARDS,
  FOOTBALL_USER_GALLERY_CARD_COLLECTIONS,
  FOOTBALL_USER_GALLERY_CLUB_HONORS,
  FOOTBALL_USER_GALLERY_NETWORK,
  FOOTBALL_USER_GALLERY_SQUADS,
  INVITE,
  LANDING,
  LEGACY_USER_GALLERY,
  MLB_DAILY_GAMES,
  MLB_DAILY_GAMES_LIVE,
  MLB_DAILY_GAMES_PAST,
  MLB_DAILY_GAMES_UPCOMING,
  MLB_FAVORITES,
  MLB_HOME,
  MLB_HOW_TO_PLAY,
  MLB_HOW_TO_PLAY_EXTERNAL,
  MLB_LOBBY,
  MLB_LOBBY_LIVE,
  MLB_LOBBY_PAST,
  MLB_LOBBY_UPCOMING,
  MLB_MARKET,
  MLB_PRIMARY_MARKET,
  MLB_SECONDARY_MARKET,
  MLB_STARTER_BUNDLES,
  MLB_USER_GALLERY,
  MLB_USER_GALLERY_COLLECTIONS,
  MY_SORARE_AUCTIONS,
  MY_SORARE_FOLLOWS,
  MY_SORARE_HOME,
  MY_SORARE_NEW,
  MY_SORARE_OFFERS_RECEIVED,
  MY_SORARE_OFFERS_SENT,
  MY_SORARE_PURCHASES,
  MY_SORARE_SALES,
  MY_SORARE_TRANSACTIONS,
  NBA_FAVORITES,
  NBA_HOME,
  NBA_HOW_TO_PLAY_EXTERNAL,
  NBA_LEAGUES,
  NBA_LOBBY,
  NBA_LOBBY_LIVE,
  NBA_LOBBY_PAST,
  NBA_LOBBY_UPCOMING,
  NBA_MARKET,
  NBA_PRIMARY_MARKET,
  NBA_SECONDARY_MARKET,
  NBA_STARTER_BUNDLES,
  NBA_USER_GALLERY,
  NBA_USER_GALLERY_COLLECTIONS,
  SETTINGS_HOME,
  goToLobby,
} from '@core/constants/routes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useIntlContext } from '@core/contexts/intl';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  MarketplaceOnboardingStep,
  useManagerTaskContext,
} from '@core/contexts/managerTask';
import { useInlineNotificationsContext } from '@core/contexts/snackNotification/Provider';
import { useSportContext } from '@core/contexts/sport';
import { useWalletContext } from '@core/contexts/wallet';
import { useWalletDrawerContext } from '@core/contexts/walletDrawer';
import useScreenSize from '@core/hooks/device/useScreenSize';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import { useLocationChanged } from '@core/hooks/useLocationChanged';
import useMyPath from '@core/hooks/useMyPath';
import useEvents from '@core/lib/events/useEvents';
import { useUseCustomLists } from '@core/lib/featureFlags';
import {
  fantasy,
  galleryTabs,
  glossary,
  navLabels,
  transferMarket,
} from '@core/lib/glossary';
import MenuIconButton from '@core/routing/MultiSportAppBar/MenuIconButton';
import useBottomBarNavItems from '@core/routing/MultiSportBottomNavBar/useBottomBarNavItems';
import { tabletAndAbove } from '@core/style/mediaQuery';

import { Balances } from '../Balances';
import Item, { Config } from '../Item';
import MLBLogos from '../MLBLogos';
import NavDrawer from '../NavDrawer';
import { switches } from '../Sport/Switch';
import SportsButtons from '../SportsButtons';
import { useAppBarContext } from '../context';

const messages = defineMessages({
  playWithFriends: {
    id: 'nba.playWithFriend',
    defaultMessage: 'Play with Friends',
  },
});

const StyledGameSwitch = styled.div`
  display: flex;
  gap: 20px;
`;

const Frame = styled(ButtonBase)`
  display: flex;
  max-height: calc(5 * var(--unit));
  gap: var(--double-unit);
  padding: var(--intermediate-unit) var(--double-unit);
  border-radius: var(--quadruple-unit);
  background-color: var(--c-static-neutral-900);
`;
const Option = styled.div`
  display: flex;
  padding: var(--intermediate-unit) var(--double-unit);
`;
const Relative = styled.div`
  position: relative;
`;

const StyledChevronDownBold = styled(ChevronDownBold)<{ $expanded: boolean }>`
  transition: transform 0.2s ease-in-out;
  ${({ $expanded }) =>
    $expanded &&
    css`
      transform: rotate(180deg);
    `}
`;

const GameSwitch = () => {
  /*const { up: upLaptop } = useScreenSize('laptop');
  const { sport } = useSportContext();
  const [expanded, setExpanded] = useState<boolean>(false);

  if (upLaptop)
    return (
      <StyledGameSwitch>
        {switches[Sport.FOOTBALL]}
        {switches[Sport.NBA]}
        {switches[Sport.BASEBALL]}
      </StyledGameSwitch>
    );

  const options = Object.entries(switches).filter(
    ([switchSport]) => switchSport !== sport
  );
  return (
    <Relative>
      <Dropdown
        darkTheme
        align="left"
        breakpoint="tablet"
        gap={4}
        label={
          <Frame>
            {switches[sport!] || null}
            <StyledChevronDownBold $expanded={expanded} />
          </Frame>
        }
        onOpen={() => setExpanded(true)}
        onClose={() => setExpanded(false)}
      >
        {options.map(([sportSwitch, label]) => (
          <Option key={sportSwitch}>{label}</Option>
        ))}
      </Dropdown>
    </Relative>
  );*/
  return <></>;
};

const Items = ({ items }: { items: Config[] }) => (
  <>
    {items.map(i => {
      if (i.Wrapper)
        return (
          <i.Wrapper key={i.key}>
            <Item config={i} />
          </i.Wrapper>
        );
      return <Item key={i.key} config={i} />;
    })}
  </>
);

const BaseMenuColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-shrink: 0;
  padding: 0 var(--double-and-a-half-unit);
  flex-grow: 1;
`;

const AnimatedMenuColumn = styled(animated(BaseMenuColumn))`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
`;

const MenuItemContent = styled.div<{ mobileProfile?: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--unit);
  padding: var(--unit) 0;
  ${({ mobileProfile }) =>
    mobileProfile
      ? css`
          height: 60px;
        `
      : null}
`;

const UserMetas = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

const MenuItemContentSmall = styled(MenuItemContent)`
  color: var(--c-neutral-600);
  ${text16};
  & > * {
    color: var(--c-neutral-600);
    &:hover {
      color: white;
    }
  }
`;

const Root = styled(FullWidth)`
  width: 100%;
  display: flex;
  align-items: center;

  @media ${tabletAndAbove} {
    flex-direction: column;
  }
`;

const Grow = styled.div`
  flex: 1;
  align-self: stretch;
`;

const Title = styled.div`
  padding: 10px 20px 10px 0px;
  gap: 10px;
  display: flex;
  align-items: center;
  color: var(--c-brand-600);
`;
const Username = styled(Text16)`
  max-width: 100px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
const FullWidthUsername = styled(Text16)`
  color: var(--c-neutral-100);
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
const SportAgnostic = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  width: 100%;
  @media ${tabletAndAbove} {
    gap: 20px;
  }
`;
const ToggleMobileMenuButton = styled(MenuIconButton)`
  background: none;
  background-color: transparent;
  margin-left: -10px;
`;
const LogoAndSwitchesSeparator = styled.div`
  width: 1px;
  height: 22px;
  background-color: white;
  opacity: 0.3;
`;
const Right = styled.div`
  color: var(--c-static-neutral-100);
  display: flex;
  align-items: center;
  margin-inline-start: auto;
  gap: var(--unit);
  @media ${tabletAndAbove} {
    gap: 10px;
    padding-left: 10px;
  }
`;
const SportSpecific = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const AppBarItems = styled.div`
  display: flex;
  gap: 30px;
`;
const Shrinkable = styled.div`
  white-space: normal;
  flex-shrink: 10;
`;

const SecondaryTooltipWrapper = ({ children }: { children: ReactNode }) => {
  const { task, setStep } = useManagerTaskContext();
  const navigate = useNavigate();
  return (
    <ManagerTaskTooltip
      title={
        <MarketplaceOnboardingTask
          name={MarketplaceOnboardingStep.menu}
          onClick={() => {
            navigate(FOOTBALL_MARKET);
            setStep(MarketplaceOnboardingStep.managerSalesLink);
          }}
        />
      }
      disable={!task}
      name={MarketplaceOnboardingStep.menu}
      placement="bottom-start"
    >
      {children}
    </ManagerTaskTooltip>
  );
};

export const LoggedInAppBar = ({
  unclaimedReward,
}: {
  unclaimedReward?: ReactNode;
}) => {
  const {
    flags: {
      enablePrizePoolPage = false,
      useMlbStarterPacks = false,
      useMlbHowToPlayPage = false,
      useShowBottomBarNavigation = false,
      useNbaMlbFavorites = false,
      useNbaOffseason = false,
      useDailyGames = false,
    },
  } = useFeatureFlags();
  const track = useEvents();
  const useCustomLists = useUseCustomLists();
  const { step, setStep } = useManagerTaskContext();

  const inlineNotifications = useInlineNotificationsContext();
  const { formatDate } = useIntlContext();
  const { currentUser } = useCurrentUserContext();
  const walletContext = useWalletContext();
  const generateMyPath = useMyPath();
  const { generateSportPath, sport: sportConfig } = useSportContext();
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);
  const [profileMobileMenuOpened, setProfileMobileMenuOpened] = useState(false);
  const { small, sport } = useAppBarContext();
  const { showDrawer } = useWalletDrawerContext();
  const [currentNavSport, setCurrentNavSport] = useState<Sport | undefined>(
    sport
  );
  const [isSelectingCurrentNavSport, setIsSelectingCurrentNavSport] =
    useState<boolean>(!currentNavSport);
  const { nickname } = currentUser!;
  const locationChanged = useLocationChanged();
  const bottomBarNavItems = useBottomBarNavItems();
  const SlideFromBottom = useSpring({
    to: async next => {
      if (isSelectingCurrentNavSport)
        await next({
          bottom: 0,
          overflow: 'hidden',
          visibility: 'hidden',
        });
      await next({
        opacity: isSelectingCurrentNavSport ? 0 : 1,
        top: isSelectingCurrentNavSport ? '+300px' : '0px',
        visibility: 'visible',
        bottom: 0,
      });
      if (!isSelectingCurrentNavSport)
        await next({
          bottom: 'auto',
          overflow: 'visible',
          visibility: 'visible',
        });
      if (isSelectingCurrentNavSport)
        await next({
          visibility: 'hidden',
        });
    },
  });

  const Opacity = useSpring({
    opacity: isSelectingCurrentNavSport ? 1 : 0,
    visibility: isSelectingCurrentNavSport ? 'visible' : 'hidden',
  });

  useEffect(() => {
    setCurrentNavSport(sport);
    setIsSelectingCurrentNavSport(!sport);
  }, [sport]);

  const onClose = useCallback(() => {
    setMobileMenuOpened(false);
  }, []);

  // On close, we reset current nav, we add a timeout to reset after drawer closing animation.
  useEffect(() => {
    const interval = window.setTimeout(() => {
      if (!mobileMenuOpened) {
        setCurrentNavSport(sport);
        setIsSelectingCurrentNavSport(!sport);
      }
    }, 150);
    return () => {
      clearInterval(interval);
    };
  }, [mobileMenuOpened, sport]);

  const onCloseProfile = useCallback(() => {
    setProfileMobileMenuOpened(false);
  }, []);

  const selectSport = useCallback((selectedSport: Sport) => {
    setCurrentNavSport(selectedSport);
    setIsSelectingCurrentNavSport(false);
  }, []);

  const logOut = useCallback(() => {
    walletContext!.logOut().then(() => {
      onClose();
      setProfileMobileMenuOpened(false);
    });
  }, [onClose, walletContext]);

  useEffect(() => {
    if (locationChanged) {
      onClose();
      setProfileMobileMenuOpened(false);
    }
  }, [locationChanged, onCloseProfile, onClose]);

  const sportSpecificItems: { [key in Sport]: Config[] } = {
    [Sport.NBA]: [
      {
        key: 'nbaHome',
        to: NBA_HOME,
        label: navLabels.home,
        exactMatch: true,
        subMenu: [
          {
            key: 'nba-homepage',
            to: NBA_HOME,
            label: galleryTabs.overview,
            exactMatch: true,
          },
          {
            key: 'user-gallery',
            to: generateMyPath(NBA_USER_GALLERY),
            label: navLabels.myCards,
          },
          {
            key: 'collections',
            to: generateMyPath(NBA_USER_GALLERY_COLLECTIONS),
            label: navLabels.collections,
          },
        ],
      },
      {
        key: 'market',
        label: navLabels.transferMarket,
        to: NBA_MARKET,
        subMenu: [
          {
            key: 'primary-market',
            to: NBA_PRIMARY_MARKET,
            label: transferMarket.new,
          },
          {
            key: 'starter-packs',
            to: NBA_STARTER_BUNDLES,
            label: transferMarket.starterPacks,
          },
          {
            key: 'secondary-market',
            to: NBA_SECONDARY_MARKET,
            label: transferMarket.transfer,
          },
          ...(useNbaMlbFavorites
            ? [
                {
                  key: 'favorites',
                  to: NBA_FAVORITES,
                  label: transferMarket.favorites,
                  onClick: () => {
                    track('Click My Favorites');
                  },
                },
              ]
            : []),
        ],
      },
      ...(useNbaOffseason
        ? []
        : [
            {
              key: 'gaming-arena',
              label: navLabels.gamingArena,
              to: NBA_LOBBY,
              subMenu: [
                {
                  key: 'fixture-upcoming',
                  to: NBA_LOBBY_UPCOMING,
                  label: fantasy.upcoming,
                },
                {
                  key: 'fixture-live',
                  to: NBA_LOBBY_LIVE,
                  label: fantasy.live,
                },
                {
                  key: 'fixture-past',
                  to: NBA_LOBBY_PAST,
                  label: fantasy.past,
                },
              ],
            },
          ]),
      {
        key: 'playwithfriends',
        to: NBA_LEAGUES,
        label: messages.playWithFriends,
      },
      {
        key: 'how-to-play',
        label: glossary.howToPlay,
        href: NBA_HOW_TO_PLAY_EXTERNAL,
        externalLink: true,
      },
    ],
    [Sport.BASEBALL]: [
      {
        key: 'mlbHome',
        to: MLB_HOME,
        label: navLabels.home,
        exactMatch: true,
        subMenu: [
          {
            key: 'mlb-homepage',
            to: MLB_HOME,
            label: galleryTabs.overview,
            exactMatch: true,
          },
          {
            key: 'user-gallery',
            to: generateMyPath(MLB_USER_GALLERY),
            label: navLabels.myCards,
          },
          {
            key: 'collections',
            to: generateMyPath(MLB_USER_GALLERY_COLLECTIONS),
            label: navLabels.collections,
          },
        ],
      },
      {
        key: 'market',
        label: navLabels.transferMarket,
        to: MLB_MARKET,
        subMenu: [
          {
            key: 'primary-market',
            to: MLB_PRIMARY_MARKET,
            label: transferMarket.new,
          },
          ...(useMlbStarterPacks
            ? [
                {
                  key: 'starter-packs',
                  to: MLB_STARTER_BUNDLES,
                  label: transferMarket.starterPacks,
                },
              ]
            : []),
          {
            key: 'secondary-market',
            to: MLB_SECONDARY_MARKET,
            label: transferMarket.transfer,
          },
          ...(useNbaMlbFavorites
            ? [
                {
                  key: 'favorites',
                  to: MLB_FAVORITES,
                  label: transferMarket.favorites,
                  onClick: () => {
                    track('Click My Favorites');
                  },
                },
              ]
            : []),
        ],
      },
      {
        key: 'gaming-arena',
        label: navLabels.gamingArena,
        to: MLB_LOBBY,
        subMenu: [
          {
            key: 'fixture-upcoming',
            to: MLB_LOBBY_UPCOMING,
            label: fantasy.upcoming,
          },

          {
            key: 'fixture-live',
            to: MLB_LOBBY_LIVE,
            label: fantasy.live,
          },

          {
            key: 'fixture-past',
            to: MLB_LOBBY_PAST,
            label: fantasy.past,
          },
        ],
      },
      ...(useDailyGames
        ? [
            {
              key: 'daily-games',
              label: navLabels.dailyGames,
              to: MLB_DAILY_GAMES,
              subMenu: [
                {
                  key: 'fixture-upcoming',
                  to: MLB_DAILY_GAMES_UPCOMING,
                  label: fantasy.upcoming,
                },

                {
                  key: 'fixture-live',
                  to: MLB_DAILY_GAMES_LIVE,
                  label: fantasy.live,
                },

                {
                  key: 'fixture-past',
                  to: MLB_DAILY_GAMES_PAST,
                  label: fantasy.past,
                },
              ],
            },
          ]
        : []),
      ...(useMlbHowToPlayPage
        ? [
            {
              key: 'how-to-play',
              to: MLB_HOW_TO_PLAY,
              label: glossary.howToPlay,
            },
          ]
        : [
            {
              key: 'how-to-play-external',
              label: glossary.howToPlay,
              href: MLB_HOW_TO_PLAY_EXTERNAL,
              externalLink: true,
            },
          ]),
    ],
    [Sport.FOOTBALL]: [
      {
        key: 'football',
        label: navLabels.home,
        to: FOOTBALL_HOME,
        exactMatch: true,
        subMenu: [
          {
            key: 'my-club-overview',
            to: FOOTBALL_HOME,
            label: galleryTabs.overview,
            exactMatch: true,
          },
          {
            key: 'my-club-my-cards',
            to: generatePath(FOOTBALL_USER_GALLERY_CARDS, {
              slug: currentUser?.slug,
            }),
            label: galleryTabs.cards,
          },
          {
            key: 'my-club-collections',
            to: generatePath(FOOTBALL_USER_GALLERY_CARD_COLLECTIONS, {
              slug: currentUser?.slug,
            }),
            label: galleryTabs.cardCollections,
          },
          {
            key: 'my-club-honors',
            to: generatePath(FOOTBALL_USER_GALLERY_CLUB_HONORS, {
              slug: currentUser?.slug,
            }),
            label: galleryTabs.clubHonors,
          },
          !useCustomLists && {
            key: 'my-club-squads',
            to: generatePath(FOOTBALL_USER_GALLERY_SQUADS, {
              slug: currentUser?.slug,
            }),
            label: galleryTabs.customDecks,
          },
          {
            key: 'network',
            to: generatePath(FOOTBALL_USER_GALLERY_NETWORK, {
              slug: currentUser?.slug,
            }),
            label: galleryTabs.network,
          },
        ].filter(Boolean),
      },
      {
        key: 'market',
        to: FOOTBALL_MARKET,
        label: navLabels.transferMarket,
        Wrapper: SecondaryTooltipWrapper,
        forceActive: MarketplaceOnboardingStep.menu === step,
        subMenu: [
          {
            key: 'primary-market',
            to: FOOTBALL_NEW_SIGNINGS,
            label: transferMarket.new,
          },
          {
            key: 'starter-packs',
            to: FOOTBALL_MARKET_STARTER_PACKS,
            label: transferMarket.starterPacks,
          },
          {
            key: 'secondary-market',
            to: FOOTBALL_TRANSFER_MARKET,
            label: transferMarket.transfer,
          },
        ].filter(Boolean),
      },
      {
        key: 'gaming-arena',
        label: navLabels.gamingArena,
        to: FOOTBALL_LOBBY_ROOT,
        subMenu: [
          {
            key: 'fixture-upcoming',
            to: goToLobby('upcoming'),
            label: fantasy.upcoming,
          },
          {
            key: 'fixture-live',
            to: goToLobby('live'),
            label: fantasy.live,
          },
          {
            key: 'fixture-past',
            to: goToLobby('past'),
            label: fantasy.past,
          },
          {
            key: 'private-leagues',
            to: FOOTBALL_PRIVATE_LEAGUES,
            label: navLabels.privateLeagues,
          },
          ...(enablePrizePoolPage
            ? [
                {
                  key: 'prize-pool',
                  to: FOOTBALL_LOBBY_PRIZE_POOL,
                  label: navLabels.prizePool,
                },
              ]
            : []),
        ],
      },
    ],
  };

  const profileItem: Config = {
    key: 'my-profile',
    button: { active: true },
    content: (
      <Avatar key="profile" user={currentUser!} rounded variant="medium" />
    ),
    subMenu: [
      {
        key: 'my-gallery',
        to: generateSportPath(LEGACY_USER_GALLERY, {
          params: { slug: currentUser?.slug },
        }),
        content: (
          <Title>
            <ActiveUserAvatar
              user={currentUser!}
              variant="medium"
              editable={false}
            />
            <MenuItemContent>
              <Username bold>{nickname}</Username>
            </MenuItemContent>
          </Title>
        ),
        hasDivider: true,
      },
      {
        key: 'my-sorare',
        to: MY_SORARE_HOME,
        label: navLabels.mySorare,
        sport: Sport.FOOTBALL,
        subMenu: [
          {
            key: 'my-sorare-auctions',
            to: MY_SORARE_AUCTIONS,
            label: navLabels.myAuctions,
          },
          {
            key: 'my-sorare-sales',
            to: MY_SORARE_SALES,
            label: navLabels.myListings,
          },
          {
            key: 'my-sorare-offers-received',
            to: MY_SORARE_OFFERS_RECEIVED,
            label: navLabels.myOffersReceived,
          },
          {
            key: 'my-sorare-offers-sent',
            to: MY_SORARE_OFFERS_SENT,
            label: navLabels.myOffersSent,
          },
        ],
      },
      {
        key: 'profile-invite',
        to: INVITE,
        label: navLabels.referralProgram,
      },
      {
        key: 'help',
        label: navLabels.help,
        href: HREF_HELP,
        externalLink: true,
      },
      {
        key: 'profile-settings',
        to: SETTINGS_HOME,
        label: navLabels.settings,
        sport: Sport.FOOTBALL,
      },
      {
        key: 'log-out',
        onClick: logOut,
        label: glossary.logOut,
      },
    ],
    visibility: 'large-only',
    rightPositioned: true,
  };

  const mobileProfileItems: Config[] = [
    {
      key: 'my-profile-edit',
      to: SETTINGS_HOME,
      content: (
        <MenuItemContent mobileProfile>
          <UserMetas>
            <ActiveUserAvatar
              user={currentUser!}
              variant="medium"
              editable={false}
            />
            <div>
              <FullWidthUsername bold>{nickname}</FullWidthUsername>
              <Text16 color="var(--c-neutral-600)">
                <FormattedMessage
                  id="navBar.memberSince"
                  defaultMessage="Member since ' {value}"
                  values={{
                    value: formatDate(currentUser!.createdAt, {
                      year: '2-digit',
                    }),
                  }}
                />
              </Text16>
            </div>
          </UserMetas>
          <FontAwesomeIcon icon={faPen} />
        </MenuItemContent>
      ),
    },
    {
      key: 'my-wallet',
      action: showDrawer,
      content: (
        <MenuItemContent>
          <Shrinkable>
            <FormattedMessage
              id="nav.walletBalance"
              defaultMessage="Wallet balance"
            />
          </Shrinkable>
          <Balances medium />
        </MenuItemContent>
      ),
      overflowVisible: true,
    },
    {
      key: 'my-profile',
      label: navLabels.mySorare,
      subMenu: [
        {
          key: 'my-sorare-news',
          to: MY_SORARE_NEW,
          label: navLabels.new,
        },
        {
          key: 'my-sorare-auctions',
          to: MY_SORARE_AUCTIONS,
          label: navLabels.myAuctions,
        },
        {
          key: 'my-sorare-purchases',
          to: MY_SORARE_PURCHASES,
          label: navLabels.purchases,
        },
        {
          key: 'my-sorare-sales',
          to: MY_SORARE_SALES,
          label: navLabels.myListings,
        },
        {
          key: 'my-sorare-offers-received',
          to: MY_SORARE_OFFERS_RECEIVED,
          label: navLabels.myOffersReceived,
        },
        {
          key: 'my-sorare-offers-sent',
          to: MY_SORARE_OFFERS_SENT,
          label: navLabels.myOffersSent,
        },
        {
          key: 'my-sorare-follows',
          to: MY_SORARE_FOLLOWS,
          label: navLabels.myFollows,
        },
        {
          key: 'my-sorare-transactions',
          to: MY_SORARE_TRANSACTIONS,
          label: navLabels.myTransactions,
        },
      ],
    },
    {
      key: 'profile-invite',
      to: INVITE,
      label: navLabels.referralProgram,
    },
    {
      key: 'my-actions',
      subMenu: [
        {
          key: 'help',
          content: (
            <MenuItemContentSmall as="a" href={HREF_HELP} target="_blank">
              <span>
                <FormattedMessage {...navLabels.help} />
              </span>
              <FontAwesomeIcon icon={faQuestionCircle} />
            </MenuItemContentSmall>
          ),
        },
        {
          key: 'profile-settings',
          to: SETTINGS_HOME,
          content: (
            <MenuItemContentSmall>
              <FormattedMessage {...navLabels.settings} />
              <FontAwesomeIcon icon={faGear} />
            </MenuItemContentSmall>
          ),
        },
        {
          key: 'log-out',
          onClick: logOut,
          content: (
            <MenuItemContentSmall>
              <FormattedMessage {...glossary.logOut} />
              <FontAwesomeIcon icon={faRightFromBracket} />
            </MenuItemContentSmall>
          ),
        },
      ],
    },
  ];

  const submenuItems = [
    ...(currentNavSport ? sportSpecificItems[currentNavSport] : []),
  ];

  const appBarItems: Config[] = [...(sport ? sportSpecificItems[sport] : [])];

  return (
    <>
      <Root>
        {small && (
          <NavDrawer
            open={mobileMenuOpened}
            currentNavSport={currentNavSport}
            isSelectingCurrentNavSport={isSelectingCurrentNavSport}
            onBack={() =>
              setIsSelectingCurrentNavSport(!isSelectingCurrentNavSport)
            }
            onClose={onClose}
          >
            <AnimatedMenuColumn style={Opacity}>
              <SportsButtons
                onClick={selectSport}
                currentNavSport={currentNavSport}
              />
            </AnimatedMenuColumn>
            <AnimatedMenuColumn style={SlideFromBottom}>
              <Items items={submenuItems} />
            </AnimatedMenuColumn>
          </NavDrawer>
        )}
        <Grow>
          <Container>
            <SportAgnostic>
              {small ? (
                <>
                  <ManagerTaskTooltip
                    name={MarketplaceOnboardingStep.menu}
                    disable={useShowBottomBarNavigation}
                    title={
                      <MarketplaceOnboardingTask
                        name={MarketplaceOnboardingStep.menu}
                        onClick={() => {
                          setStep();
                          setMobileMenuOpened(true);
                          // Wait for transition on mobile
                          setTimeout(() => {
                            setStep(MarketplaceOnboardingStep.managerSalesLink);
                          }, 300);
                        }}
                      />
                    }
                  >
                    <ToggleMobileMenuButton
                      icon={faBars}
                      aria-owns={mobileMenuOpened ? 'simple-menu' : undefined}
                      aria-haspopup="true"
                      onClick={() => setMobileMenuOpened(true)}
                    />
                  </ManagerTaskTooltip>
                  <Link to={LANDING} aria-label="Sorare">
                    <SorareLogo />
                  </Link>
                </>
              ) : (
                <>
                  <Link to={LANDING} aria-label="Sorare">
                    <SorareLogo />
                  </Link>
                  <LogoAndSwitchesSeparator />
                  <GameSwitch />
                </>
              )}
              <Right>
                {sportConfig === sport && unclaimedReward}
                <ResponsiveSearchBar />
                <Notifications />
                {!bottomBarNavItems && <Balances medium compact={small} />}
                {small && (
                  <>
                    <ButtonBase
                      key="profile"
                      disableRipple={small}
                      onClick={() => setProfileMobileMenuOpened(true)}
                    >
                      <Avatar user={currentUser!} rounded />
                    </ButtonBase>
                    <NavDrawer
                      open={profileMobileMenuOpened}
                      currentNavSport={undefined}
                      onClose={onCloseProfile}
                      anchor="right"
                    >
                      <BaseMenuColumn>
                        <Items items={mobileProfileItems} />
                      </BaseMenuColumn>
                    </NavDrawer>
                  </>
                )}
                <Item config={profileItem} />
              </Right>
            </SportAgnostic>
          </Container>
        </Grow>
      </Root>
      {!small && sport && (
        <SportSpecific>
          <AppBarItems>
            <Items items={appBarItems} />
          </AppBarItems>
          {sport === Sport.BASEBALL && <MLBLogos />}
        </SportSpecific>
      )}
      {inlineNotifications}
    </>
  );
};

export default LoggedInAppBar;

import { ReactElement, Suspense } from 'react';
import { Navigate, Route, useLocation } from 'react-router-dom';

import Backdrop from '@sorare/core/src/atoms/loader/Backdrop';
// import ClubGameDialog from '@sorare/core/src/components/content/ResponsiveBanner/ClubGameDialog';
import Dialog from '@sorare/core/src/components/dialog/index';
import {
  BUNDESLIGA_LANDING,
  EPLV_LANDING_V2_SHORT,
  EPL_LANDING,
  EPL_LANDING_V2,
  FOOTBALL_BUNDLED_AUCTION,
  FOOTBALL_CARD_SHOW,
  FOOTBALL_CLUB_SHOP,
  FOOTBALL_CLUB_SHOP_WILDCARD,
  FOOTBALL_CLUB_SHOW_WILDCARD,
  FOOTBALL_COMPETITION_DETAILS_WILDCARD,
  FOOTBALL_COMPOSE_TEAM,
  FOOTBALL_COMPOSE_TEAM_DRAFT,
  FOOTBALL_COMPOSE_TEAM_LINEUP,
  FOOTBALL_COUNTRY_SHOW,
  FOOTBALL_CUSTOM_DECK_EDIT,
  FOOTBALL_CUSTOM_DECK_SHOW,
  FOOTBALL_DRAFT,
  FOOTBALL_HOME,
  FOOTBALL_LEAGUE_SHOW_WILDCARD,
  FOOTBALL_LINEUP_SHARING,
  FOOTBALL_LOBBY_LIVE_WILDCARD,
  FOOTBALL_LOBBY_PAST_WILDCARD,
  FOOTBALL_LOBBY_PRIVATE_LEAGUES,
  FOOTBALL_LOBBY_PRIZE_POOL,
  FOOTBALL_LOBBY_STARTER_BUNDLES,
  FOOTBALL_LOBBY_UPCOMING_CLUB_BANNER,
  FOOTBALL_LOBBY_UPCOMING_SWAP,
  FOOTBALL_LOBBY_UPCOMING_WILDCARD,
  FOOTBALL_LOBBY_WILDCARD,
  FOOTBALL_MARKET,
  FOOTBALL_NEW_SIGNINGS,
  FOOTBALL_NO_CARD_ROUTE_ACCEPT,
  FOOTBALL_NO_CARD_ROUTE_CANCEL,
  FOOTBALL_NO_CARD_ROUTE_CONFIRM,
  FOOTBALL_NO_CARD_ROUTE_LEADERBOARDS,
  FOOTBALL_NO_CARD_ROUTE_REQUEST,
  FOOTBALL_ONBOARDING,
  FOOTBALL_ONBOARDING_WILDCARD,
  FOOTBALL_PATH,
  FOOTBALL_PICK_LEAGUE,
  FOOTBALL_PLAYER_SHOW_WILDCARD,
  FOOTBALL_PRIVATE_LEAGUES,
  FOOTBALL_PRIVATE_LEAGUES_CREATE,
  FOOTBALL_PRIVATE_LEAGUES_CREATED,
  FOOTBALL_PRIVATE_LEAGUES_DETAILS,
  FOOTBALL_PRIVATE_LEAGUES_WILDCARD,
  FOOTBALL_SCARCITIES,
  FOOTBALL_STARTER_BUNDLES,
  FOOTBALL_STARTER_BUNDLE_PAGE,
  FOOTBALL_TRANSFER_MARKET,
  FOOTBALL_TRANSFER_MARKET_STACK_SHOW,
  FOOTBALL_USER_CARD_COLLECTION,
  FOOTBALL_USER_CARD_COLLECTION_CARDS,
  FOOTBALL_USER_CARD_COLLECTION_LEADERBOARD,
  FOOTBALL_USER_GALLERY_WILDCARD,
  FOOTBALL_VIDEOS,
  FOOTBALL_WILDCARD,
  INVITE_EPL_USER_GROUP,
  INVITE_USER_GROUP,
  INVITE_WILDCARD,
  LALIGA_LANDING,
  MLS_LANDING,
  MLS_LANDING_SHORT,
  REWARDS,
  SERIEA_LANDING,
  goToLobby,
} from '@sorare/core/src/constants/routes';
// import { useConfigContext } from '@sorare/core/src/contexts/config';
// import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';
// import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
// import useGetSplat from '@sorare/core/src/hooks/useGetSplat';
// import { importFactory } from '@sorare/core/src/lib/importFactory';
// import { lazy } from '@sorare/core/src/lib/retry';
// import { catchAll } from '@sorare/core/src/lib/routing';
import { EnsureTopVisibleOnMount } from '@sorare/core/src/routing/EnsureTopVisibleOnMount';
import { RoutesWithDialogs } from '@sorare/core/src/routing/Router';
// import WithItemDialog from '@sorare/core/src/routing/WithItemDialog';

// import Landing from '@sorare/shared-pages/src/Landing';
// import BundledAuctionPage from '@football/components/auction/BundledAuctionPage';
// import EditDeckCards from '@football/components/deck/EditDeckCards';
// import BundesligaLanding from '@football/pages/BundesligaLanding';
// import Card from '@football/pages/Card';
// import ClubShop from '@football/pages/ClubShop';
// import Collection from '@football/pages/Collections/Collection';
// import Country from '@football/pages/Country';
// import CustomDeck from '@football/pages/CustomDeck';
// import DiscoverScarcities from '@football/pages/DiscoverScarcities';
// import EPLLanding, { metadata } from '@football/pages/EPLLanding';
import Home from '@football/pages/Home';
import HomePublic from '@football/pages/Home/Public';
// import ManagerHomeVideos from '@football/pages/Home/Videos';
// import LaLigaLanding from '@football/pages/LaLigaLanding';
// import LineupSharing from '@football/pages/LineupSharing';
// import MLSLanding from '@football/pages/MLSLanding';
// import NoCardEntryAccept from '@football/pages/NoCardEntry/Accept/index';
// import NoCardEntryCancel from '@football/pages/NoCardEntry/Cancel/index';
// import NoCardEntryConfirm from '@football/pages/NoCardEntry/Confirm/index';
// import NoCardEntryRequestLeaderboards from '@football/pages/NoCardEntry/RequestLeaderboards/index';
// import NoCardEntry from '@football/pages/NoCardEntry/index';
// import PickLeague from '@football/pages/PickLeague';
// import Player from '@football/pages/Player';
// import ReferralProgram from '@football/pages/ReferralProgram';
// import Rewards from '@football/pages/Rewards';
// import SerieALanding from '@football/pages/SerieALanding';
// import StarterBundlePage from '@football/pages/StarterBundle';
import MarketHome from '@football/pages/TransferMarket/Home';
import NewSignings from '@football/pages/TransferMarket/NewSignings';
// import StarterBundles from '@football/pages/TransferMarket/StarterBundles';
// import TransferMarket from '@football/pages/TransferMarket/TransferMarket';
// import TransferMarketStack from '@football/pages/TransferMarket/TransferMarketStack';
import Layout from '@football/routing/Layout';
import PrivateRoute from '@football/routing/PrivateRoute';

// const draftImport = importFactory(async () => import('@football/pages/Draft'));
// const ComposeTeam = lazy(async () => import('@football/pages/ComposeTeam'));
// const ComposeTeamDraft = lazy(async () => import('@football/pages/ComposeTeam/Draft'));
// const Draft = lazy(draftImport);
// const LobbyCompetitionDetails = lazy(
//   async () => import('@football/pages/Lobby/CompetitionDetails/index')
// );
// const UserGroupInviteLinkEntryPoint = lazy(
//   async () =>
//     import('pages/Lobby/Components/UserGroup/UserGroupInviteLinkEntryPoint')
// );
// const LobbyUpcoming = lazy(async () => import('@football/pages/Lobby/Upcoming/index'));
// const LobbyLive = lazy(async () => import('@football/pages/Lobby/Live/index'));
// const LobbyPast = lazy(async () => import('@football/pages/Lobby/Past/index'));
// const Swap = lazy(async () => import('@football/pages/Lobby/Upcoming/Swap'));
// const LobbyPrizePool = lazy(async () => import('@football/pages/Lobby/PrizePool/index'));
// const UserGroups = lazy(async () => import('@football/pages/Lobby/UserGroups/index'));
// const StarterBundlesPage = lazy(
//   async () => import('@football/pages/Lobby/StarterBundles')
// );
// const League = lazy(async () => import('@football/pages/League'));
// const Club = lazy(async () => import('@football/pages/Club'));

const FOOTBALL_LOBBY_UPCOMING = goToLobby('upcoming');

const WithDialog = ({
  defaultBackUrl,
  component,
}: {
  defaultBackUrl: string;
  component: ReactElement;
}) => {
  const bgLocation = useBgLocation();
  return (
    <Suspense fallback={bgLocation ? <Backdrop /> : null}>
      {bgLocation ? (
        <Dialog
          open
          defaultBackUrl={defaultBackUrl}
          fullWidth
          body={component}
        />
      ) : (
        <PrivateRoute withLayout element={component} />
      )}
    </Suspense>
  );
};

export const AppSwitch = () => {
  // const {
  //   flags: {
  //     disableClubShopPage = false,
  //     enablePrizePoolPage = false,
  //     enableNoCardEntry = false,
  //   },
  // } = useFeatureFlags();
  const currentUser = undefined;//const { currentUser } = useCurrentUserContext();
  // const { landingTheme } = useConfigContext();
  // const location = useLocation();
  // const getSplat = useGetSplat();

  return (
    <RoutesWithDialogs
      basePath={FOOTBALL_PATH}
      dialogRoutes={({ isDialog }) => (
        <>DIalogRoutes</>
      )}
    >
      <Route
        path={FOOTBALL_NEW_SIGNINGS}
        element={
          <EnsureTopVisibleOnMount>
            <Layout>
              <NewSignings />
            </Layout>
          </EnsureTopVisibleOnMount>
        }
      />
      <Route
        path={FOOTBALL_MARKET}
        element={
          <EnsureTopVisibleOnMount>
            <Layout>
              <MarketHome />
            </Layout>
          </EnsureTopVisibleOnMount>
        }
      />
      {!currentUser && (
        <>
          <Route
            path={FOOTBALL_HOME}
            element={
              <EnsureTopVisibleOnMount>
                <Layout>
                  <HomePublic />
                </Layout>
              </EnsureTopVisibleOnMount>
            }
          />
        </>
      )}
      <Route
        path={FOOTBALL_USER_GALLERY_WILDCARD}
        element={
          <EnsureTopVisibleOnMount>
            <Layout>
              <Home />
            </Layout>
          </EnsureTopVisibleOnMount>
        }
      />
    </RoutesWithDialogs>
  );
};

export default AppSwitch;

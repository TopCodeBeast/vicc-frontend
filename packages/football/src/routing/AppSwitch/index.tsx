import { ReactElement, Suspense } from 'react';
import { Outlet, Route, useNavigate } from 'react-router-dom';

import Backdrop from '@sorare/core/src/atoms/loader/Backdrop';
import Dialog from '@sorare/core/src/components/dialog/index';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import { AppLayout as ReorgAppLayout } from '@sorare/core/src/components/navigation/AppLayout';
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
  FOOTBALL_LIVE,
  FOOTBALL_LIVE_GAME,
  FOOTBALL_LOBBY_LIVE_WILDCARD,
  FOOTBALL_LOBBY_PAST_WILDCARD,
  FOOTBALL_LOBBY_PRIVATE_LEAGUES,
  FOOTBALL_LOBBY_PRIZE_POOL,
  FOOTBALL_LOBBY_STARTER_BUNDLES,
  FOOTBALL_LOBBY_UPCOMING_SWAP,
  FOOTBALL_LOBBY_UPCOMING_WILDCARD,
  FOOTBALL_LOBBY_WILDCARD,
  FOOTBALL_MARKET,
  FOOTBALL_MARKET_MANAGER_SALES,
  FOOTBALL_MARKET_STARTER_PACKS,
  FOOTBALL_MY_CLUB,
  FOOTBALL_MY_CLUB_HONORS,
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
  FOOTBALL_PLAY,
  FOOTBALL_PLAYER_SHOW_WILDCARD,
  FOOTBALL_PLAY_PRIVATE_LEAGUES,
  FOOTBALL_PLAY_WEEKLY,
  FOOTBALL_PRIVATE_LEAGUES,
  FOOTBALL_PRIVATE_LEAGUES_CREATE,
  FOOTBALL_PRIVATE_LEAGUES_CREATED,
  FOOTBALL_PRIVATE_LEAGUES_DETAILS,
  FOOTBALL_PRIVATE_LEAGUES_PRIVATE,
  FOOTBALL_PRIVATE_LEAGUES_PUBLIC,
  FOOTBALL_PRIVATE_LEAGUES_PUBLIC_USER_DETAILS,
  FOOTBALL_PRIVATE_LEAGUES_WILDCARD,
  FOOTBALL_SCARCITIES,
  FOOTBALL_STARTER_BUNDLE_PAGE,
  FOOTBALL_TRANSFER_MARKET,
  FOOTBALL_TRANSFER_MARKET_STACK_SHOW,
  FOOTBALL_USER_CARD_COLLECTION,
  FOOTBALL_USER_CARD_COLLECTION_CARDS,
  FOOTBALL_USER_CARD_COLLECTION_LEADERBOARD,
  FOOTBALL_USER_GALLERY_WILDCARD,
  FOOTBALL_VIDEOS,
  LALIGA_LANDING,
  LALIGA_SANTANDER_LANDING,
  LOBBY_TABS,
  MLS_LANDING,
  MLS_LANDING_SHORT,
  REWARDS,
  SERIEA_LANDING,
  goToLobby,
} from '@sorare/core/src/constants/routes';
import { useConfigContext } from '@sorare/core/src/contexts/config';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useIsLoggedIn from '@sorare/core/src/hooks/auth/useIsLoggedIn';
import useRedirectToLogIn from '@sorare/core/src/hooks/auth/useRedirectToLogIn';
import useIsReorgApp from '@sorare/core/src/hooks/ui/useIsReorgApp';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import useSafePreviousNavigate from '@sorare/core/src/hooks/useSafePreviousNavigate';
import { importFactory } from '@sorare/core/src/lib/importFactory';
import { lazy } from '@sorare/core/src/lib/retry';
import { catchAll, relative } from '@sorare/core/src/lib/routing';
import { EnsureTopVisibleOnMount } from '@sorare/core/src/routing/EnsureTopVisibleOnMount';
import { Navigate } from '@sorare/core/src/routing/Navigate';
import { RoutesWithDialogs } from '@sorare/core/src/routing/Router';
import WithItemDialog from '@sorare/core/src/routing/WithItemDialog';

import Landing from '@sorare/shared-pages/src/Landing';
import BundledAuctionPage from '@football/components/auction/BundledAuctionPage';
import EditDeckCards from '@football/components/deck/EditDeckCards';
import ClubShop from '@football/pages/ClubShop';
import Collection from '@football/pages/Collections/Collection';
import Country from '@football/pages/Country';
import CustomDeck from '@football/pages/CustomDeck';
import DiscoverScarcities from '@football/pages/DiscoverScarcities';
import EPLLanding from '@football/pages/EPLLanding';
import Home from '@football/pages/Home';
import HomePublic from '@football/pages/Home/Public';
import ManagerHomeVideos from '@football/pages/Home/Videos';
import LaLigaLanding from '@football/pages/LaLigaLanding';
import LineupSharing from '@football/pages/LineupSharing';
import MLSLanding from '@football/pages/MLSLanding';
import NoCardEntryAccept from '@football/pages/NoCardEntry/Accept/index';
import NoCardEntryCancel from '@football/pages/NoCardEntry/Cancel/index';
import NoCardEntryConfirm from '@football/pages/NoCardEntry/Confirm/index';
import NoCardEntryRequestLeaderboards from '@football/pages/NoCardEntry/RequestLeaderboards/index';
import NoCardEntry from '@football/pages/NoCardEntry/index';
import PickLeague from '@football/pages/PickLeague';
import Player from '@football/pages/Player';
import Rewards from '@football/pages/Rewards';
import SerieALanding from '@football/pages/SerieALanding';
import StarterBundlePage from '@football/pages/StarterBundle';
import MarketHome from '@football/pages/TransferMarket/Home';
import NewSignings from '@football/pages/TransferMarket/NewSignings';
import StarterBundles from '@football/pages/TransferMarket/StarterBundles';
import TransferMarket from '@football/pages/TransferMarket/TransferMarket';
import TransferMarketStack from '@football/pages/TransferMarket/TransferMarketStack';
import Bundesliga from '@football/pages/bundesliga';
import Card from '@football/pages/cards/slug';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import CurrentAppLayout from '@football/routing/Layout';
import PrivateRoute from '@football/routing/PrivateRoute';

import MyClubLayout from './MyClubLayout';

const draftImport = importFactory(async () => import('@football/pages/Draft'));
const ComposeTeam = lazy(async () => import('@football/pages/ComposeTeam'));
// const ComposeTeamDraft = lazy(async () => import('@football/pages/ComposeTeam/Draft'));
const Draft = lazy(draftImport);
const LobbyCompetitionDetails = lazy(
  async () => import('@football/pages/Lobby/CompetitionDetails/index')
);
const LobbyUpcoming = lazy(async () => import('@football/pages/Lobby/Upcoming/index'));
const LobbyLive = lazy(async () => import('@football/pages/Lobby/Live/index'));
const LobbyPast = lazy(async () => import('@football/pages/Lobby/Past/index'));
// const Swap = lazy(async () => import('@football/pages/Lobby/Upcoming/Swap'));
const LobbyPrizePool = lazy(async () => import('@football/pages/Lobby/PrizePool/index'));
const UserGroups = lazy(async () => import('@football/pages/userGroups/list/index'));
// const PrivateUserGroups = lazy(async () => import('@football/pages/userGroups/private'));
// const PublicUserGroups = lazy(async () => import('@football/pages/userGroups/public'));
// const PublicUserGroupOverview = lazy(
//   async () => import('@football/pages/userGroups/public/overview')
// );
// const PrivateUserGroupOverview = lazy(
//   async () => import('@football/pages/userGroups/private/overview')
// );
// const Live = lazy(async () => import('@football/pages/live'));
// const LiveGame = lazy(async () => import('@football/pages/live/game'));
// const Market = lazy(async () => import('@football/pages/market'));
// const MyClub = lazy(async () => import('@football/pages/my-club'));
// const MyClubHonors = lazy(async () => import('@football/pages/my-club/honors'));

// const StarterBundlesPage = lazy(
//   async () => import('@football/pages/Lobby/StarterBundles')
// );
// const Play = lazy(async () => import('@football/pages/play/index'));
// const PlayPrivateLeagues = lazy(
//   async () => import('@football/pages/play/private-leagues')
// );
// const PlayWeekly = lazy(async () => import('@football/pages/play/weekly'));

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
  const navigate = useNavigate();
  return (
    <Suspense fallback={bgLocation ? <Backdrop /> : null}>
      {bgLocation ? (
        <Dialog
          open
          fullWidth
          onClose={() => navigate(defaultBackUrl)}
          body={component}
        />
      ) : (
        <PrivateRoute withLayout element={component} />
      )}
    </Suspense>
  );
};

const relativePath = (path: string) => {
  return relative(FOOTBALL_PATH, path);
};

const FootballLayout = ({ isPrivate }: { isPrivate?: boolean }) => {
  const isReorgApp = useIsReorgApp();
  const LayoutComponent = isReorgApp ? ReorgAppLayout : CurrentAppLayout;
  const redirectToLogIn = useRedirectToLogIn();
  const isLoggedIn = useIsLoggedIn();

  return (
    <EnsureTopVisibleOnMount>
      <LayoutComponent>
        {isPrivate && !isLoggedIn ? redirectToLogIn() : <Outlet />}
      </LayoutComponent>
    </EnsureTopVisibleOnMount>
  );
};

export const AppSwitch = () => {
  const {
    flags: {
      disableClubShopPage = false,
      enablePrizePoolPage = false,
      enableNoCardEntry = false,
      enableLongFormatCompetition = false,
    },
  } = useFeatureFlags();
  const safePreviousNavigate = useSafePreviousNavigate(
    goToLobby('upcoming', LOBBY_TABS.MY_TEAMS)
  );
  const competitionDetailsOnClose = () => safePreviousNavigate();
  const { currentUser } = useCurrentUserContext();
  const { landingTheme } = useConfigContext();

  const isReorgApp = useIsReorgApp();
  const DialogLayout = isReorgApp ? ReorgAppLayout : CurrentAppLayout;

  return (
    <RoutesWithDialogs
      basePath={FOOTBALL_PATH}
      dialogRoutes={({ isDialog }) => (
        <>
          <Route
            path={relativePath(FOOTBALL_COMPETITION_DETAILS_WILDCARD)}
            element={
              isDialog ? (
                <Suspense fallback={<Backdrop />}>
                  <Dialog
                    open
                    hideHeader
                    maxWidth="md"
                    fullWidth
                    fullHeight
                    onClose={competitionDetailsOnClose}
                    body={({ CloseButton }) => (
                      <LobbyCompetitionDetails
                        closeButton={
                          <CloseButton onClose={competitionDetailsOnClose} />
                        }
                      />
                    )}
                  />
                </Suspense>
              ) : (
                <PrivateRoute
                  withLayout
                  element={<LobbyCompetitionDetails />}
                />
              )
            }
          />
          <Route
            path={relativePath(FOOTBALL_VIDEOS)}
            element={<ManagerHomeVideos />}
          />
          {/* <Route
            path={relativePath(FOOTBALL_LOBBY_STARTER_BUNDLES)}
            element={
              <WithDialog
                component={<StarterBundlesPage />}
                defaultBackUrl={FOOTBALL_LOBBY_UPCOMING}
              />
            }
          />
          <Route
            path={relativePath(FOOTBALL_LOBBY_UPCOMING_SWAP)}
            element={
              <Suspense fallback={<Backdrop />}>
                <PrivateRoute element={<Swap />} />
              </Suspense>
            }
          /> */}
          <Route
            path={relativePath(FOOTBALL_BUNDLED_AUCTION)}
            element={
              <Suspense fallback={null}>
                <WithItemDialog
                  isDialog={isDialog}
                  Layout={DialogLayout}
                  Component={BundledAuctionPage}
                />
              </Suspense>
            }
          />
          <Route
            path={relativePath(FOOTBALL_CARD_SHOW)}
            element={
              <Suspense fallback={null}>
                <WithItemDialog
                  isDialog={isDialog}
                  Layout={DialogLayout}
                  Component={Card}
                />
              </Suspense>
            }
          />
          <Route
            path={relativePath(FOOTBALL_CUSTOM_DECK_EDIT)}
            element={
              <PrivateRoute
                element={
                  isDialog ? (
                    <Suspense fallback={<Backdrop />}>
                      <Dialog open fullScreen body={<EditDeckCards />} />
                    </Suspense>
                  ) : (
                    <PrivateRoute withLayout element={<EditDeckCards />} />
                  )
                }
              />
            }
          />
          <Route
            path={relativePath(FOOTBALL_STARTER_BUNDLE_PAGE)}
            element={
              <Suspense fallback={<Backdrop />}>
                <WithItemDialog
                  isDialog={isDialog}
                  Layout={DialogLayout}
                  Component={StarterBundlePage}
                />
              </Suspense>
            }
          />
        </>
      )}
    >
      <Route path={relativePath(EPL_LANDING)} element={<EPLLanding />} />
      <Route
        path={relativePath(EPLV_LANDING_V2_SHORT)}
        element={<EPLLanding short />}
      />
      <Route
        path={relativePath(EPL_LANDING_V2)}
        element={<Navigate to={EPLV_LANDING_V2_SHORT} />}
      />
      <Route path={relativePath(SERIEA_LANDING)} element={<SerieALanding />} />
      <Route
        path={relativePath(MLS_LANDING_SHORT)}
        element={<Navigate to={MLS_LANDING} />}
      />
      <Route path={relativePath(MLS_LANDING)} element={<MLSLanding />} />
      <Route path={relativePath(LALIGA_LANDING)} element={<LaLigaLanding />} />
      <Route
        path={relativePath(LALIGA_SANTANDER_LANDING)}
        element={<Navigate to={LALIGA_LANDING} />}
      />
      <Route path={relativePath(BUNDESLIGA_LANDING)} element={<Bundesliga />} />
      {[FOOTBALL_COMPOSE_TEAM_LINEUP, FOOTBALL_COMPOSE_TEAM].map(path => (
        <Route
          path={relativePath(path)}
          key={path}
          element={<PrivateRoute element={<ComposeTeam />} />}
        />
      ))}

      <Route element={<FootballLayout />}>
        {[
          FOOTBALL_USER_CARD_COLLECTION,
          FOOTBALL_USER_CARD_COLLECTION_CARDS,
          FOOTBALL_USER_CARD_COLLECTION_LEADERBOARD,
        ].map(path => (
          <Route
            path={relativePath(path)}
            key={path}
            element={<Collection />}
          />
        ))}
        <Route
          path={relativePath(FOOTBALL_TRANSFER_MARKET)}
          element={
            isReorgApp ? (
              <Navigate to={FOOTBALL_MARKET_MANAGER_SALES} replace keepParams />
            ) : (
              <TransferMarket />
            )
          }
        />
        {!isReorgApp && (
          <>
            <Route
              path={relativePath(FOOTBALL_NEW_SIGNINGS)}
              element={<NewSignings />}
            />
            <Route
              path={relativePath(FOOTBALL_MARKET_STARTER_PACKS)}
              element={<StarterBundles />}
            />
            <Route
              path={relativePath(FOOTBALL_MARKET)}
              element={<MarketHome />}
            />
          </>
        )}
        {/* {isReorgApp && (
          <Route
            path={catchAll(relativePath(FOOTBALL_MARKET))}
            element={<Market />}
          />
        )} */}
        <Route
          path={relativePath(FOOTBALL_TRANSFER_MARKET_STACK_SHOW)}
          element={<TransferMarketStack />}
        />

        <Route
          path={relativePath(FOOTBALL_CUSTOM_DECK_SHOW)}
          element={<CustomDeck />}
        />
        <Route
          path={relativePath(FOOTBALL_PLAYER_SHOW_WILDCARD)}
          element={<Player />}
        />
        <Route
          path={relativePath(FOOTBALL_COUNTRY_SHOW)}
          element={<Country />}
        />
        {/* <Route
          path={relativePath(FOOTBALL_CLUB_SHOW_WILDCARD)}
          element={<Club />}
        />
        <Route
          path={relativePath(FOOTBALL_LEAGUE_SHOW_WILDCARD)}
          element={<League />}
        /> */}
        <Route path={relativePath(REWARDS)} element={<Rewards />} />
        <Route
          path={relativePath(FOOTBALL_USER_GALLERY_WILDCARD)}
          element={<Home />}
        />

        {currentUser ? (
          !isReorgApp && (
            <Route path={relativePath(FOOTBALL_HOME)} element={<Home />} />
          )
        ) : (
          <Route index element={<HomePublic />} />
        )}
      </Route>
      {!currentUser &&
        /* Eg. sorare.com/football/laligasantander_22_23 */
        landingTheme &&
        landingTheme.slug !== 'default-landing-theme' && (
          <Route path="*" element={<Landing />} />
        )}
      <Route element={<FootballLayout isPrivate />}>
        {/* {isReorgApp && (
          <>
            <Route
              path={catchAll(relativePath(FOOTBALL_LIVE))}
              element={<Live />}
            />
            <Route element={<MyClubLayout />}>
              <Route
                path={catchAll(relativePath(FOOTBALL_MY_CLUB))}
                element={<MyClub />}
              />
              <Route
                path={relativePath(FOOTBALL_MY_CLUB_HONORS)}
                element={<MyClubHonors />}
              />
            </Route>
            <Route
              path={relativePath(FOOTBALL_PLAY_WEEKLY)}
              element={<PlayWeekly />}
            />
            <Route
              path={relativePath(FOOTBALL_PLAY_PRIVATE_LEAGUES)}
              element={<PlayPrivateLeagues />}
            />
            <Route path={relativePath(FOOTBALL_PLAY)} element={<Play />} />
            <Route
              path={catchAll(relativePath(FOOTBALL_LIVE_GAME))}
              element={<LiveGame />}
            />
          </>
        )} */}

        <Route
          path={relativePath(FOOTBALL_LOBBY_UPCOMING_WILDCARD)}
          element={<LobbyUpcoming />}
        />
        {enablePrizePoolPage && (
          <Route
            path={relativePath(FOOTBALL_LOBBY_PRIZE_POOL)}
            element={<LobbyPrizePool />}
          />
        )}
        <Route
          path={relativePath(FOOTBALL_LOBBY_LIVE_WILDCARD)}
          element={<LobbyLive />}
        />
        <Route
          path={relativePath(FOOTBALL_LOBBY_PAST_WILDCARD)}
          element={<LobbyPast />}
        />
        {!disableClubShopPage && (
          <>
            <Route
              path={relativePath(FOOTBALL_CLUB_SHOP_WILDCARD)}
              element={<ClubShop />}
            />
            <Route
              path={relativePath(FOOTBALL_CLUB_SHOP)}
              element={<ClubShop />}
            />
          </>
        )}
        {[
          { path: FOOTBALL_PRIVATE_LEAGUES_WILDCARD, props: {} },
          {
            path: FOOTBALL_PRIVATE_LEAGUES_CREATE,
            props: { showDialog: true },
          },
          {
            path: FOOTBALL_PRIVATE_LEAGUES_CREATED,
            props: { showDialog: true },
          },
        ].map(({ path, props }) => (
          <Route
            path={relativePath(path)}
            key={path}
            element={<UserGroups {...props} />}
          />
        ))}
      </Route>

      {/* {enableLongFormatCompetition && (
        <>
          <Route
            path={relativePath(FOOTBALL_PRIVATE_LEAGUES_PUBLIC)}
            key={relativePath(FOOTBALL_PRIVATE_LEAGUES_PUBLIC)}
            element={<PublicUserGroups />}
          />
          <Route
            path={relativePath(FOOTBALL_PRIVATE_LEAGUES_PRIVATE)}
            key={relativePath(FOOTBALL_PRIVATE_LEAGUES_PRIVATE)}
            element={<PrivateUserGroups />}
          />
          <Route
            path={relativePath(FOOTBALL_PRIVATE_LEAGUES_PUBLIC_USER_DETAILS)}
            key={relativePath(FOOTBALL_PRIVATE_LEAGUES_PUBLIC_USER_DETAILS)}
            element={<PublicUserGroupOverview />}
          />
        </>
      )}
      <Route
        path={relativePath(FOOTBALL_PRIVATE_LEAGUES_DETAILS)}
        key={relativePath(FOOTBALL_PRIVATE_LEAGUES_DETAILS)}
        element={<PrivateUserGroupOverview />}
      /> */}
      {[FOOTBALL_ONBOARDING_WILDCARD, FOOTBALL_ONBOARDING].map(path => (
        <Route
          path={relativePath(path)}
          key={path}
          element={<PickLeague preloads={[draftImport]} />}
        />
      ))}
      <Route
        path={relativePath(FOOTBALL_PICK_LEAGUE)}
        element={<PickLeague preloads={[draftImport]} allowClosing />}
      />

      <Route
        path={relativePath(FOOTBALL_SCARCITIES)}
        element={<DiscoverScarcities />}
      />

      <Route
        path={relativePath(FOOTBALL_LOBBY_PRIVATE_LEAGUES)}
        element={<Navigate to={FOOTBALL_PRIVATE_LEAGUES} />}
      />
      <Route
        path={relativePath(FOOTBALL_LOBBY_WILDCARD)}
        element={<Navigate to={goToLobby('upcoming')} replace />}
      />
      <Route path={relativePath(FOOTBALL_DRAFT)} element={<Draft />} />
      {/* <Route
        path={relativePath(FOOTBALL_COMPOSE_TEAM_DRAFT)}
        element={<ComposeTeamDraft />}
      /> */}
      <Route
        path={relativePath(FOOTBALL_LINEUP_SHARING)}
        element={<LineupSharing />}
      />

      {currentUser && enableNoCardEntry && (
        <>
          <Route
            path={relativePath(FOOTBALL_NO_CARD_ROUTE_REQUEST)}
            element={<PrivateRoute element={<NoCardEntry />} />}
          />

          <Route
            path={relativePath(FOOTBALL_NO_CARD_ROUTE_CONFIRM)}
            element={<PrivateRoute element={<NoCardEntryConfirm />} />}
          />
          <Route
            path={relativePath(FOOTBALL_NO_CARD_ROUTE_CANCEL)}
            element={<PrivateRoute element={<NoCardEntryCancel />} />}
          />
          <Route
            path={relativePath(FOOTBALL_NO_CARD_ROUTE_ACCEPT)}
            element={<PrivateRoute element={<NoCardEntryAccept />} />}
          />
          <Route
            path={relativePath(FOOTBALL_NO_CARD_ROUTE_LEADERBOARDS)}
            element={
              <PrivateRoute element={<NoCardEntryRequestLeaderboards />} />
            }
          />
        </>
      )}
      <Route
        path="*"
        element={
          <Navigate to={isReorgApp ? FOOTBALL_PLAY : FOOTBALL_HOME} replace />
        }
      />
    </RoutesWithDialogs>
  );
};

export default AppSwitch;

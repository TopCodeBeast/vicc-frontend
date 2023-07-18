import { Fragment, ReactNode, Suspense } from 'react';
import { Navigate, Route, Routes, generatePath } from 'react-router-dom';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import Backdrop from '@sorare/core/src/atoms/loader/Backdrop';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import {
  ACCEPT_INVITATION,
  ACTIVITY,
  ACTIVITY_NEWS,
  ACTIVITY_NEWS_SHOW,
  AFFILIATE_PROGRAM,
  CAREERS,
  CONFIRM_DEVICE,
  CONFIRM_EMAIL,
  CONTENT_PREVIEW_WILDCARD,
  COOKIE_POLICY,
  DEBUG_DEVICE,
  GAME_RULES,
  LANDING,
  LICENSED_PARTNERS,
  LICENSED_PARTNERS_BY_SPORT,
  LICENSED_PARTNERS_FOOTBALL_TAB,
  LINK,
  LOCKEDON,
  MLB_LOCKEDON,
  MOBILE_SIGN_UP,
  MY_SORARE_HOME,
  MY_SORARE_NEW,
  MY_SORARE_WILDCARD,
  OAUTH_AUTORIZE,
  PRESS,
  PRIVACY_POLICY,
  PROMO_CLAIM,
  PROMO_SIGNUP,
  REFERRER_LINK,
  SETTINGS_ACCOUNT,
  SETTINGS_HOME,
  SETTINGS_WILDCARD,
  TERMS,
  VERIFY_STRIPE_ACCOUNT,
} from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';
import { Lifecycle } from '@sorare/core/src/hooks/useLifecycle';
import {
  SESSION_STORAGE,
  useSessionStorage,
} from '@sorare/core/src/hooks/useSessionStorage';
import { lazy } from '@sorare/core/src/lib/retry';
import { DarkTheme } from '@sorare/core/src/routing/DarkTheme';
import { EnsureTopVisibleOnMount } from '@sorare/core/src/routing/EnsureTopVisibleOnMount';
import RequireAuth from '@sorare/core/src/routing/RequireAuth';
import { RoutesWithDialogs } from '@sorare/core/src/routing/Router';

// import { AppLayout } from '@sorare/us-sports/src/components/AppLayout';

import Landing from '@sorare/shared-pages/src/Landing';
import RedirectRouter from './RedirectRouter';

const Dialog = lazy(
  async () => import('@sorare/core/src/components/dialog/index')
);
const WalletDrawer = lazy(
  async () => import('@sorare/core/src/components/wallet/WalletDrawer')
);
const BlockchainProvider = lazy(
  async () => import('@sorare/core/src/contexts/blockchain/Provider')
);
const Web3Provider = lazy(
  async () => import('@sorare/core/src/contexts/web3/Provider')
);
const Settings = lazy(async () => import('@sorare/shared-pages/src/Settings'));
const FootballRoot = lazy(async () => import('@sorare/football/src/main'));

export const BlockchainProviders = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<LoadingIndicator fullHeight />}>
      <Web3Provider>
        <BlockchainProvider>
          {children}
          <WalletDrawer />
        </BlockchainProvider>
      </Web3Provider>
    </Suspense>
  );
};

const AppsRouter = () => {
  const bgLocation = useBgLocation();
  return (
    <Routes location={bgLocation}>
      <Route path={'/*'} element={<FootballRoot />} />
    </Routes>
  );
};

// Here we are trying to include the blockchain providers only when needed, and only once
// It is not needed on the Logged out Landing page
// It is not needed on the Logged in Landing page
// It is needed on the logged out Football Player page (for instance)
export const Router = ({ appRoutes }: { appRoutes: ReactNode }) => {
  const { currentUser } = useCurrentUserContext();

  const { getValue: getSport } = useSessionStorage(SESSION_STORAGE.sport);
  const sessionSport = getSport();
  const sport =
    sessionSport ||
    (currentUser?.userSettings?.lifecycle as Lifecycle)?.lastVisitedSport;

  const SharedPagesTheme = sport === Sport.FOOTBALL ? DarkTheme : Fragment;

  return (
    <>
      <RedirectRouter />
      <RoutesWithDialogs
        basePath="/"
        dialogRoutes={({ isDialog }) => (
          <Route
            path={ACTIVITY_NEWS_SHOW}
            element={
              isDialog ? (
                <Suspense fallback={<Backdrop />}>
                  <Dialog
                    defaultBackUrl={ACTIVITY}
                    open
                    fullWidth
                    maxWidth="sm"
                  >
                    <>SpecificNews5</>
                    {/* <SpecificNews /> */}
                  </Dialog>
                </Suspense>
              ) : (
                <DarkTheme>
                  <>AppLayout6666</>
                  {/* <AppLayout>
                    <SpecificNews />
                  </AppLayout> */}
                </DarkTheme>
              )
            }
          />
        )}
      >
        <Route path={LANDING} element={<Landing />} />
        <Route
          path={SETTINGS_HOME}
          element={
            <EnsureTopVisibleOnMount>
              <Navigate to={SETTINGS_ACCOUNT} replace />
            </EnsureTopVisibleOnMount>
          }
        />
        <Route
          path={SETTINGS_WILDCARD}
          element={
            <RequireAuth>
              <SharedPagesTheme>
                <EnsureTopVisibleOnMount>
                  <Settings />
                </EnsureTopVisibleOnMount>
              </SharedPagesTheme>
            </RequireAuth>
          }
        />
        <Route
          path={MY_SORARE_HOME}
          element={<Navigate to={MY_SORARE_NEW} replace />}
        />
        <Route
          path={'/*'}
          element={
            currentUser ? (
              appRoutes
            ) : (
              <BlockchainProviders>{appRoutes}</BlockchainProviders>
            )
          }
        />
      </RoutesWithDialogs>
    </>
  );
};

export const SmartRouter = () => {
  const { currentUser } = useCurrentUserContext();

  return currentUser ? (
    <BlockchainProviders>
      <Router appRoutes={<AppsRouter />} />
    </BlockchainProviders>
  ) : (
    <Router appRoutes={<AppsRouter />} />
  );
};

export default SmartRouter;

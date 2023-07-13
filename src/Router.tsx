import { Fragment, ReactNode, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import {
  LANDING,
  MY_SORARE_HOME,
  MY_SORARE_NEW,
  SETTINGS_ACCOUNT,
  SETTINGS_HOME,
  SETTINGS_WILDCARD,
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

import Landing from '@sorare/shared-pages/src/Landing';

const Settings = lazy(async () => import('@sorare/shared-pages/src/Settings'));
const FootballRoot = lazy(async () => import('@sorare/football/src/main'));

export const BlockchainProviders = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<LoadingIndicator fullHeight />}>
      {children}
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
      <RoutesWithDialogs
        basePath="/"
      >
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
        <Route path={LANDING} element={<Landing />} />
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

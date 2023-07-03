import { Fragment, ReactNode, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import {
  LANDING,
} from '@sorare/core/src/constants/routes';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';
import { RoutesWithDialogs } from '@sorare/core/src/routing/Router';

import Landing from '@sorare/shared-pages/src/Landing';

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
      <Route path={'/*'} element={<>FootballRoot</>} />
    </Routes>
  );
};

// Here we are trying to include the blockchain providers only when needed, and only once
// It is not needed on the Logged out Landing page
// It is not needed on the Logged in Landing page
// It is needed on the logged out Football Player page (for instance)
export const Router = ({ appRoutes }: { appRoutes: ReactNode }) => {
  return (
    <>
      <RoutesWithDialogs
        basePath="/"
      >
        <Route path={LANDING} element={<Landing />} />
        <Route
          path={'/*'}
          element={<BlockchainProviders>{appRoutes}</BlockchainProviders>}
        />
      </RoutesWithDialogs>
    </>
  );
};

export const SmartRouter = () => {
  return (
    <Router appRoutes={<AppsRouter />} />
  );
};

export default SmartRouter;

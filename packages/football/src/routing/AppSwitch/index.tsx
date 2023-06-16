import { ReactElement, Suspense, cloneElement } from 'react';
import { Navigate, Route, useLocation } from 'react-router-dom';

import {
  FOOTBALL_MARKET,
  FOOTBALL_PATH,
  FOOTBALL_TRANSFER_MARKET,
} from '@sorare/core/src/constants/routes';
import useGetSplat from '@sorare/core/src/hooks/useGetSplat';
import { EnsureTopVisibleOnMount } from '@sorare/core/src/routing/EnsureTopVisibleOnMount';
import { RoutesWithDialogs } from '@sorare/core/src/routing/Router';

import MarketHome from '@sorare/football/src/pages/TransferMarket/Home';
import TransferMarket from '@sorare/football/src/pages/TransferMarket/TransferMarket';
import Layout from '@sorare/football/src/routing/Layout';

export const AppSwitch = () => {
  const location = useLocation();
  const getSplat = useGetSplat();

  return (
    <RoutesWithDialogs
      basePath={FOOTBALL_PATH}
      dialogRoutes={({ isDialog }) => (
        <>
          Football Dialog: {isDialog}
        </>
      )}
    >
      <Route
        path={FOOTBALL_TRANSFER_MARKET}
        element={
          <EnsureTopVisibleOnMount>
            <Layout>
              <TransferMarket />
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
      {/* Force all Football routes to be prefixed with /football now */}
      <Route
        path="/*"
        element={
          <Navigate
            to={getSplat('/*', '/football/*') + location.search}
            replace
          />
        }
      />
    </RoutesWithDialogs>
  );
};

export default AppSwitch;

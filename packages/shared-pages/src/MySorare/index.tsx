import { FormattedMessage } from 'react-intl';
import { Route } from 'react-router-dom';

import { PageHeader } from '@sorare/core/src/components/navigation/PageHeader';
import {
  FOOTBALL_MARKET,
  MY_SORARE_AUCTIONS,
  MY_SORARE_FOLLOWS,
  MY_SORARE_HOME,
  MY_SORARE_MY_OFFER_RECEIVED,
  MY_SORARE_MY_OFFER_SENT,
  MY_SORARE_NEW,
  MY_SORARE_OFFERS_RECEIVED,
  MY_SORARE_OFFERS_SENT,
  MY_SORARE_PLAYERS_NOTIFICATIONS,
  MY_SORARE_PURCHASES,
  MY_SORARE_SALES,
  MY_SORARE_TRANSACTIONS,
} from '@sorare/core/src/constants/routes';
import useIsReorgApp from '@sorare/core/src/hooks/ui/useIsReorgApp';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';
import { navLabels } from '@sorare/core/src/lib/glossary';
import { EnsureTopVisibleOnMount } from '@sorare/core/src/routing/EnsureTopVisibleOnMount';
import { RootRoutes } from '@sorare/core/src/routing/RootRoutes';

import MySorareLayout from '@sorare/marketplace/src/components/mySorare/Layout';
import MyAuctions from '@sorare/marketplace/src/components/mySorare/MyAuctions';
import MyFollows from '@sorare/marketplace/src/components/mySorare/MyFollows';
import MyNews from '@sorare/marketplace/src/components/mySorare/MyNews';
import { MyOffer } from '@sorare/marketplace/src/components/mySorare/MyOffer';
import { MyOffers } from '@sorare/marketplace/src/components/mySorare/MyOffers';
import MyPurchases from '@sorare/marketplace/src/components/mySorare/MyPurchases';
import MySales from '@sorare/marketplace/src/components/mySorare/MySales';
import PlayersNotifications from '@sorare/marketplace/src/components/mySorare/PlayersNotifications';
import TransactionsHistory from '@sorare/marketplace/src/components/mySorare/TransactionsHistory';
import { MySorarePage } from '@sorare/marketplace/src/components/mySorare/common/pages';

export const MySorare = () => {
  const bgLocation = useBgLocation(true);
  const isReorgApp = useIsReorgApp();
  return (
    <>
      {isReorgApp && (
        <PageHeader
          title={<FormattedMessage {...navLabels.mySorare} />}
          defaultBackTo={FOOTBALL_MARKET}
        />
      )}
      <MySorareLayout>
        <RootRoutes location={bgLocation}>
          <Route
            path={MY_SORARE_NEW}
            element={
              <EnsureTopVisibleOnMount>
                <MyNews />
              </EnsureTopVisibleOnMount>
            }
          />
          <Route
            path={MY_SORARE_AUCTIONS}
            element={
              <EnsureTopVisibleOnMount>
                <MyAuctions />
              </EnsureTopVisibleOnMount>
            }
          />
          <Route
            path={MY_SORARE_SALES}
            element={
              <EnsureTopVisibleOnMount>
                <MySales />
              </EnsureTopVisibleOnMount>
            }
          />
          <Route
            path={MY_SORARE_PURCHASES}
            element={
              <EnsureTopVisibleOnMount>
                <MyPurchases />
              </EnsureTopVisibleOnMount>
            }
          />
          <Route
            path={MY_SORARE_OFFERS_RECEIVED}
            element={
              <EnsureTopVisibleOnMount>
                <MyOffers page={MySorarePage.OFFERS_RECEIVED} />
              </EnsureTopVisibleOnMount>
            }
          />
          <Route
            path={MY_SORARE_MY_OFFER_RECEIVED}
            element={
              <EnsureTopVisibleOnMount>
                <MyOffer page={MySorarePage.OFFERS_RECEIVED} />
              </EnsureTopVisibleOnMount>
            }
          />
          <Route
            path={MY_SORARE_OFFERS_SENT}
            element={
              <EnsureTopVisibleOnMount>
                <MyOffers page={MySorarePage.OFFERS_SENT} />
              </EnsureTopVisibleOnMount>
            }
          />
          <Route
            path={MY_SORARE_MY_OFFER_SENT}
            element={
              <EnsureTopVisibleOnMount>
                <MyOffer page={MySorarePage.OFFERS_SENT} />
              </EnsureTopVisibleOnMount>
            }
          />
          <Route
            path={MY_SORARE_FOLLOWS}
            element={
              <EnsureTopVisibleOnMount>
                <MyFollows />
              </EnsureTopVisibleOnMount>
            }
          />
          <Route
            path={MY_SORARE_PLAYERS_NOTIFICATIONS}
            element={
              <EnsureTopVisibleOnMount>
                <PlayersNotifications />
              </EnsureTopVisibleOnMount>
            }
          />
          <Route
            path={MY_SORARE_TRANSACTIONS}
            element={
              <EnsureTopVisibleOnMount>
                <TransactionsHistory />
              </EnsureTopVisibleOnMount>
            }
          />
          <Route
            path={MY_SORARE_HOME}
            element={
              <EnsureTopVisibleOnMount>
                <MyNews />
              </EnsureTopVisibleOnMount>
            }
          />
        </RootRoutes>
      </MySorareLayout>
    </>
  );
};

export default MySorare;

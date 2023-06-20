import { Suspense } from 'react';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import SportProvider from '@sorare/core/src/contexts/sport/Provider';

import DeckProvider '@sorare/football/src/contexts/deck/Provider';
import So5MarketplaceProvider '@sorare/football/src/contexts/marketplace/So5MarketplaceProvider';
import Router from 'routing/Router';

export const Root = () => {
  return (
    <SportProvider sport={Sport.FOOTBALL}>
      <DeckProvider>
        <So5MarketplaceProvider>
          <Suspense fallback={<LoadingIndicator fullScreen />}>
            <Router />
          </Suspense>
        </So5MarketplaceProvider>
      </DeckProvider>
    </SportProvider>
  );
};

export default Root;

import { ReactNode } from 'react';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { useConfigContext } from '@sorare/core/src/contexts/config';

import MarketplaceProvider from '@sorare/marketplace/src/contexts/Marketplace/Provider';

import BundledAuctionEligibilityByAssetIds from '@sorare/football/src/components/auction/BundledAuctionEligibilityByAssetIds';
import CardPropertiesByAssetId from '@sorare/football/src/components/card/CardPropertiesByAssetId';
import CardTeamsByAssetId from '@sorare/football/src/components/card/CardTeamsByAssetId';

const So5MarketplaceProvider = ({ children }: { children: ReactNode }) => {
  const { getMarketFeesRateBySport } = useConfigContext();
  return (
    <MarketplaceProvider
      secondaryMarketFeesBasisPoints={getMarketFeesRateBySport(Sport.FOOTBALL)}
      TokenPropertiesComponent={({ assetId }) => (
        <CardPropertiesByAssetId assetId={assetId} />
      )}
      TokenAuctionEligibility={({ auction }) => (
        <BundledAuctionEligibilityByAssetIds tokens={auction.nfts} />
      )}
      MobileTokenDetailsComponent={() => null}
      TokenTeamsComponent={({ assetId }) => (
        <CardTeamsByAssetId assetId={assetId} />
      )}
    >
      {children}
    </MarketplaceProvider>
  );
};

export default So5MarketplaceProvider;

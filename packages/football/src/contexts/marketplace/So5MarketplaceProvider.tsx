import { ReactNode } from 'react';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { useConfigContext } from '@sorare/core/src/contexts/config';

import MarketplaceProvider from '@sorare/marketplace/src/contexts/Marketplace/Provider';

import BundledAuctionEligibilityByAssetIds from '@football/components/auction/BundledAuctionEligibilityByAssetIds';
import CardPropertiesByAssetId from '@football/components/card/CardPropertiesByAssetId';
import CardTeamsByAssetId from '@football/components/card/CardTeamsByAssetId';

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

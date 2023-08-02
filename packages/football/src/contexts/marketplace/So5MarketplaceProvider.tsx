import { ReactNode, useState } from 'react';

import MarketplaceProvider from '@sorare/marketplace/src/contexts/Marketplace/Provider';

import BundledAuctionEligibilityByAssetIds from '@football/components/auction/BundledAuctionEligibilityByAssetIds';
import CardPropertiesByAssetId from '@football/components/card/CardPropertiesByAssetId';
import CardTeamsByAssetId from '@football/components/card/CardTeamsByAssetId';

const So5MarketplaceProvider = ({ children }: { children: ReactNode }) => {
  const [hideDetails, setHideDetails] = useState(false);
  return (
    <MarketplaceProvider
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
      hideDetails={hideDetails}
      setHideDetails={setHideDetails}
    >
      {children}
    </MarketplaceProvider>
  );
};

export default So5MarketplaceProvider;

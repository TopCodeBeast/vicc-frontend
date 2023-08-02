import { ReactNode, useState } from 'react';

import MarketplaceProvider from '../Marketplace/Provider';
// This provider has been created because child components call useMarketplaceContext().
// Props are not used.
const MySorareMarketplaceProvider = ({ children }: { children: ReactNode }) => {
  const [hideDetails, setHideDetails] = useState(false);

  return (
    <MarketplaceProvider
      TokenPropertiesComponent={() => null}
      TokenAuctionEligibility={() => null}
      MobileTokenDetailsComponent={() => null}
      TokenTeamsComponent={() => null}
      hideDetails={hideDetails}
      setHideDetails={setHideDetails}
    >
      {children}
    </MarketplaceProvider>
  );
};

export default MySorareMarketplaceProvider;

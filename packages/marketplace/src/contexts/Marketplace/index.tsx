import { createContext, useContext } from 'react';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { TokenComponentType } from '@sorare/core/src/types';

import { BidField_auction } from 'components/buyActions/BidField/__generated__/index.graphql';

export interface MarketplaceContextType {
  secondaryMarketFeesRate: number;
  TokenPropertiesComponent: TokenComponentType;
  TokenAuctionEligibility: TokenComponentType;
  MobileTokenDetailsComponent: TokenComponentType;
  TokenTeamsComponent: TokenComponentType;
  trackClickBundle: (
    auctionId: string,
    assetIds: string[],
    sport: Sport,
    subPath?: string
  ) => void;
  trackClickBid: (
    auction: BidField_auction,
    eurAmount: number,
    assetIds: string[],
    sport: Sport,
    subPath?: string
  ) => void;
  trackClickBuy: (
    offerId: string,
    priceInWei: string,
    eurAmount: number,
    assetIds: string[],
    sport: Sport,
    subPath?: string
  ) => void;
  trackClickCard: (assetId: string, sport: Sport) => void;
  trackClickTrade: (counterOfferId?: string) => void;
  trackRemoveMarketFilterChip: (
    attribute: string,
    value: string,
    sport: Sport
  ) => void;
}

export const MarketplaceContext = createContext<MarketplaceContextType | null>(
  null
);

export const useMarketplaceContext = () => useContext(MarketplaceContext)!;

export default MarketplaceContext.Provider;

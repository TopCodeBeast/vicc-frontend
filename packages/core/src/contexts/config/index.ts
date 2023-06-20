import { createContext, useContext } from 'react';

import { Sport } from '__generated__/globalTypes';
import { Currency } from '@sorare/core/src/lib/fiat';

import {
  ConfigQuery_config_bannerSet,
  ConfigQuery_config_counts,
  ConfigQuery_config_heroBannerSet,
  ConfigQuery_config_landingTheme,
  ConfigQuery_config_marketplacePromotionalEvents,
  ConfigQuery_config_responsiveBannerSet,
  ConfigQuery_currentLocation,
  ConfigQuery_currentUser,
} from './types';

export interface AlgoliaCardIndexes {
  // cards indices
  'Cards New': string;
  'Cards Highest Average Score': string;
  'Cards Highest Price': string;
  'Cards Lowest Price': string;
  'Cards Player Name': string;

  // blockchain cards indices
  'Ending Soon': string;
  'Newly Listed': string;
  'Highest Price': string;
  'Lowest Price': string;
  'Highest Average Score': string;
  'Best Value': string;
  'Popular Player': string;
  Hottest: string;
  'Home Page Best Value': string; // TODO(su): remove once not used through LD anymore
  'Home Page Popular Player': string; // TODO(su): remove once not used through LD anymore
}

export interface AlgoliaIndexes extends AlgoliaCardIndexes {
  User: string;
  Player: string;
  Club: string;
  League: string;
  Country: string;
  Competition: string;
}

export type AlgoliaCardIndexesName = keyof AlgoliaCardIndexes;

export type AlgoliaCardIndexesNames = AlgoliaCardIndexesName[];

export interface LandingClub {
  logo: string;
  name: string;
  league: string;
}

export interface Team {
  slug: string;
}

export interface ConfigContext {
  landingTheme: ConfigQuery_config_landingTheme | null;
  algoliaIndexes: AlgoliaIndexes;
  algoliaCardIndexes: AlgoliaCardIndexes;
  algoliaApplicationId: string;
  algoliaSearchApiKey: string;
  ethereumNetworkId: string;
  ethereumEndpoint: string;
  sorareTokensAddress: string;
  baseballTokensAddress: string;
  nbaTokensAddress: string;
  sorareCardsAddress: string;
  footballNationalSeriesTokensAddress: string;
  sorareEncryptionKey: string;
  sponsorAccountAddress: string;
  migratorAddress?: string | null;
  bankAddress: string;
  ethAssetType: string | null;
  ethQuantum: string;
  starkExchangeAddress: string | null;
  relayAddress: string;
  so5: {
    so5LeaguesAlgoliaFilters: Record<string, string>;
    nextSo5FixtureTeams: Team[];
    noCardRoute: {
      nextOpenDate: ISO8601DateTime | null;
      nextCloseDate: ISO8601DateTime | null;
    };
  };
  transferMarket: {
    cardEthMinPrice: number;
    cardWeiMinPrice: string;
  };
  currentUser: ConfigQuery_currentUser | null;
  refetch: () => Promise<any>;
  updateQuery: (user: ConfigQuery_currentUser) => void;
  exchangeRate: { [key: string]: any };
  marketFeesBasisPoints: Record<Sport, number>;
  getMarketFeesRateBySport: (sport: Sport) => number;
  defaultFiatCurrency: Currency;
  heroBannerSet: ConfigQuery_config_heroBannerSet[];
  responsiveBannerSet: ConfigQuery_config_responsiveBannerSet[];
  bannerSet: ConfigQuery_config_bannerSet[];
  marketplacePromotionalEvents: ConfigQuery_config_marketplacePromotionalEvents[];
  minimumReceiveWeiAmount: string;
  currentLocation: ConfigQuery_currentLocation;
  counts: ConfigQuery_config_counts;
}

export const configContext = createContext<ConfigContext | null>(null);

export const useConfigContext = () => useContext(configContext)!;

export default configContext.Provider;

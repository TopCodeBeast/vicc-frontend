import { createContext, useContext } from 'react';

import { Currency } from '@core/lib/fiat';

import {
  ConfigQuery_config_landingTheme,
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

export interface ConfigContext {
  landingTheme?: ConfigQuery_config_landingTheme | null;
  algoliaIndexes: AlgoliaIndexes;
  algoliaCardIndexes?: AlgoliaCardIndexes;
  algoliaApplicationId?: string;
  algoliaSearchApiKey?: string;
  ethereumNetworkId?: string;
  ethereumEndpoint?: string;
  viccTokensAddress?: string;
  viccCardsAddress?: string;
  cricketNationalSeriesTokensAddress?: string;
  viccEncryptionKey?: string;
  sponsorAccountAddress?: string;
  migratorAddress?: string | null;
  bankAddress?: string;
  ethAssetType?: string | null;
  ethQuantum?: string;
  starkExchangeAddress?: string | null;
  relayAddress?: string;
  vicc5: {
    vicc5LeaguesAlgoliaFilters: Record<string, string>;
  };
  currentUser: ConfigQuery_currentUser | null;
  refetch: () => Promise<any>;
  updateQuery: (user: ConfigQuery_currentUser) => void;
  exchangeRate: { [key: string]: any };
  marketFeeRateBasisPoints: number;
  defaultFiatCurrency: Currency;
  minimumReceiveWeiAmount: string;
  currentLocation: ConfigQuery_currentLocation;
}

export const configContext = createContext<ConfigContext | null>(null);

export const useConfigContext = () => useContext(configContext)!;

export default configContext.Provider;

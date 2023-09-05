import { IndexUiState } from 'instantsearch.js';

import { Sport } from '__generated__/globalTypes';
import { AlgoliaIndexes } from '@core/contexts/config';

export type SearchProps = {
  analyticsTags: AnalyticTag[];
  indexes?: (keyof AlgoliaIndexes)[];
  defaultHitsPerPage?: number;
  sport: Sport;
  defaultFilters?: string[];
  urlState?: boolean;
  initialIndexUIState?: ExtendedIndexUIState;
};

export type Props = {
  analyticsTags: AnalyticTag[];
  indexes: (keyof AlgoliaIndexes)[];
  distinct: boolean | number;
  defaultHitsPerPage: number;
  attributesToRetrieve?: string[];
  sport?: Sport;
  defaultFilters?: string[];
  getOptionalFilters?: (index: string) => string[];
  urlState?: boolean;
  initialIndexUIState?: ExtendedIndexUIState;
};

export enum SEARCH_PARAMS {
  QUERY = 'q',
  SORT = 's',
  PAGE = 'p',
  DOMESTIC_LEAGUE = 'league',
  PROMOTION = 'promo',
  TEAM = 'team',
  RARITY = 'rarity',
  POSITION = 'pos',
  PLAYER_NAME = 'player',
  NATIONAL_TEAM = 'nt',
  NATIONALITY = 'nationality',
  SEASON = 'season',
  LEAGUE = 'vicc5League',
  CLUB = 'club',
  ACTIVE_TEAM = 'currentTeam',
  EDITION = 'edition',
  BUNDLED = 'b',
  DECK = 'deck',
  GRADE = 'level',
  AGE = 'age',
  ON_SALE = 'sale',
  LATEST_SEASON = 'ls',
  FAVORITE_FILTER = 'ff',
  NON_PLAYABLE_CARDS = 'co',
  LEGEND = 'legend',
  LEAGUE_FILTER = 'lf',
  PLAYING_NEXT = 'pn',
  PRICE = 'price',
  SERIAL_NUMBER = 'sn',
  MLB_15_AVERAGE = 'mlbL15Avg',
  MLB_SEASON_AVG = 'mlbSAvg',
  SO5_15_AVERAGE = 'vicc5L15Avg',
  SO5_5_AVERAGE = 'vicc5L5Avg',
  SO5_15_APPEARANCES = 'vicc5L15App',
  SO5_5_APPEARANCES = 'vicc5L5App',
  NBA_10_AVERAGE = 'nbaL10Avg',
  GLOBAL_CUP = 'sgc',
  UNSTACKED = 'u',
  NOT_IN_LINEUP = 'nl',
  JERSEY_SERIAL = 'js',
}

type DeprecatedRouteState = {
  refinementList: Record<string, string[]>;
  range: Record<string, { min?: string; max?: string }>;
  page: number;
  sortBy: string;
};

export type RouteState = Record<SEARCH_PARAMS, string> &
  Partial<DeprecatedRouteState>;

export type ExtendedIndexUIState = IndexUiState & {
  virtualToggle?: Record<string, any>;
  shouldReplace?: boolean;
};

export type ExtendedUIState = {
  [indexName: string]: Partial<ExtendedIndexUIState>;
};

export type AnalyticTag =
  | 'TransferMarket'
  | 'TransferMarketStack'
  | 'NewSignings'
  | 'StarterBundles'
  | 'Featured'
  | 'Player'
  | 'Club'
  | 'Team'
  | 'League'
  | 'Country'
  | 'Football'
  | 'NBA'
  | 'Baseball'
  | 'Gallery'
  | 'NewOffer'
  | 'BuyOnAuction'
  | 'CardOnSale'
  | 'LineupToDiscover'
  | 'CardPicker'
  | 'SearchBar'
  | 'AvailableOnPrimary'
  | 'FavoriteCards';

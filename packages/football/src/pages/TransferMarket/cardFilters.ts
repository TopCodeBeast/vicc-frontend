import {
  CollectibleFilter,
  FavoriteFilter,
  LeagueFilter,
  PlayingNextGameweekFilter,
  PromotedCardsFilter,
  RefineActiveClub,
  RefineActiveNationalTeam,
  RefineAppearances,
  RefineAverageScore,
  RefineBundledSale,
  RefineCardEdition,
  RefineCardLevel,
  RefineCardPlayerAge,
  RefineLeague,
  RefineNationality,
  RefinePlayer,
  RefinePrice,
  RefineRarity,
  RefineSeason,
  RefineSerialNumber,
  RefineTeam,
  filterSeparator,
} from '@sorare/marketplace/src/searchCards';

// import { RefineFootballPosition } from '@football/components/searchCards/RefinePosition';

const marketFilters = [
  RefineRarity(),
  filterSeparator,
  RefineLeague,
  // RefineFootballPosition,
  RefineTeam,
  RefineAverageScore(),
  RefineAppearances(),
  RefinePrice(),
  filterSeparator,
  PlayingNextGameweekFilter,
  filterSeparator,
];

const advancedMarketFilters = [
  LeagueFilter,
  RefineCardPlayerAge,
  RefinePlayer,
  RefineSeason,
  PromotedCardsFilter,
  RefineCardEdition,
  RefineSerialNumber({ withJerseySerial: true }),
  FavoriteFilter,
  RefineBundledSale,
  RefineCardLevel,
  RefineActiveClub,
  RefineActiveNationalTeam,
  RefineNationality,
];

export const primaryMarketFilters = marketFilters;

export const advancedPrimaryMarketFilters = advancedMarketFilters.filter(
  e => e !== RefineCardLevel
);

export const secondaryMarketFilters = marketFilters;

export const advancedSecondaryMarketFilters = [
  ...advancedMarketFilters.filter(
    e => ![PromotedCardsFilter, RefineBundledSale].includes(e)
  ),
  CollectibleFilter(),
];

export const starterBundlesMarketFilters = [
  RefineLeague,
  RefineTeam,
  RefinePlayer,
];

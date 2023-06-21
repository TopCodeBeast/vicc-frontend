import { Rarity } from '@sorare/core/src/__generated__/globalTypes';

export type CollectionsFiltersState = {
  rarities?: Rarity[];
  seasonStartYears?: number[];
  query?: string;
  startedOnly?: boolean;
};

export type StringifiedCollectionsFiltersState = {
  rarities?: string;
  seasonStartYears?: string;
  query?: string;
  startedOnly?: string;
};

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';

import {
  CollectionsFiltersState,
  StringifiedCollectionsFiltersState,
} from './types';

export const stringifyFiltersState = (
  state: CollectionsFiltersState
): StringifiedCollectionsFiltersState => {
  return {
    rarities: state.rarities?.join(',') || undefined,
    seasonStartYears: state.seasonStartYears?.join(',') || undefined,
    query: state.query || undefined,
    startedOnly: state.startedOnly ? 'true' : undefined,
  };
};

export const parseFiltersState = (
  stringifiedState: StringifiedCollectionsFiltersState
): CollectionsFiltersState => {
  return {
    rarities: stringifiedState.rarities
      ? (stringifiedState.rarities.split(',') as Rarity[])
      : undefined,
    seasonStartYears: stringifiedState.seasonStartYears
      ? stringifiedState.seasonStartYears.split(',').map(Number)
      : undefined,
    query: stringifiedState.query || '',
    startedOnly: stringifiedState.startedOnly === 'true',
  };
};

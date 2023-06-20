// Works for football only
import { RefinementListItem } from 'instantsearch.js/es/connectors/refinement-list/connectRefinementList';

import { FILTERS } from '@sorare/core/src/lib/filters';
import {
  PlayablePosition,
  positionNames,
  sortByPosition as sortByPositionFn,
} from '@sorare/core/src/lib/players';

import { RefineListProps } from '@sorare/marketplace/src/search/RefineList';
import { makeFilter } from '@sorare/marketplace/src/searchCards/RefineList';

const formatPositionOption: NonNullable<RefineListProps['formatOption']> = (
  position,
  formatMessage
) => {
  const msg = positionNames[position as PlayablePosition];
  return msg ? formatMessage(msg) : position;
};

const sortByPosition = (items: RefinementListItem[]) => {
  return items.sort((a, b) =>
    sortByPositionFn(b.value as PlayablePosition, a.value as PlayablePosition)
  );
};

export const RefineFootballPosition = makeFilter(FILTERS.position, {
  formatOption: formatPositionOption,
  transformItems: sortByPosition,
});

export const RefineMultipleFootballPositions = makeFilter(FILTERS.position, {
  formatOption: formatPositionOption,
  hide: items => items.length < 2,
  transformItems: sortByPosition,
});

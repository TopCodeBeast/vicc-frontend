import {
  useCurrentRefinements,
  useInstantSearch,
} from 'react-instantsearch-hooks-web';

import { useSearchCardsContext } from '@sorare/core/src/contexts/searchCards';
import {
  APPEARANCES_15_MAX,
  APPEARANCES_5_MAX,
  APPEARANCES_MIN,
  LEVEL_MAX,
  LEVEL_MIN,
} from '@sorare/core/src/lib/cards';
import { FILTERS, TOGGLE_FILTERS } from '@sorare/core/src/lib/filters';

type Props = {
  countQuery?: boolean;
};

export default ({ countQuery = true }: Props = {}) => {
  const { items } = useCurrentRefinements();
  const {
    playingNextGameweekFilter,
    favoriteFilter,
    notInLineUpFilter,
    hasCollectibleFilter,
    nonPlayableCards,
    legend,
    leagueFilter,
    promotion,
    customDecksFilter,
  } = useSearchCardsContext();
  const {
    indexUiState: { query },
  } = useInstantSearch();

  // Work-around range bug: forcing the min/max of the connectRange triggers a refinement
  const refinements = items.filter(item => {
    if (item.attribute === FILTERS.cardLevel.attribute) {
      return (
        item.refinements.length !== 2 ||
        item.refinements[0].value !== LEVEL_MIN ||
        item.refinements[1].value !== LEVEL_MAX
      );
    }
    if (item.attribute === FILTERS.lastFiveAppearances.attribute) {
      return (
        item.refinements.length !== 2 ||
        item.refinements[0].value !== APPEARANCES_MIN ||
        item.refinements[1].value !== APPEARANCES_5_MAX
      );
    }
    if (item.attribute === FILTERS.lastFifteenAppearances.attribute) {
      return (
        item.refinements.length !== 2 ||
        item.refinements[0].value !== APPEARANCES_MIN ||
        item.refinements[1].value !== APPEARANCES_15_MAX
      );
    }
    return item.attribute !== TOGGLE_FILTERS.latestSeasonFilter.attribute;
  });

  return (
    refinements.length +
    (playingNextGameweekFilter ? 1 : 0) +
    (favoriteFilter ? 1 : 0) +
    (notInLineUpFilter ? 1 : 0) +
    (hasCollectibleFilter && nonPlayableCards ? 1 : 0) +
    (hasCollectibleFilter && legend ? 1 : 0) +
    (leagueFilter ? 1 : 0) +
    (promotion ? 1 : 0) +
    (countQuery && query ? 1 : 0) +
    (customDecksFilter?.length || 0)
  );
};

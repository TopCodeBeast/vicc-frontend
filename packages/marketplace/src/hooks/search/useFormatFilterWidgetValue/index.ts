import { useIntl } from 'react-intl';

import { useSearchCardsContext } from '@sorare/core/src/contexts/searchCards';
import {
  TOGGLE_FILTERS,
  VIRTUAL_TOGGLE_FILTERS,
  VirtualToggleFilter,
} from '@sorare/core/src/lib/filters';

import useFormatFilters from '@marketplace/hooks/filters/useFormatFilters';
import { RefinementItem } from '@marketplace/search/ActiveFilters/types';

import {
  formatListFilterWidgetValue,
  formatRangeFilterWidgetValue,
} from './utils';

export const isListFilterWidget = (item: RefinementItem): boolean =>
  item.refinements[0]?.type === 'disjunctive';

export const isRangeFilterWidget = (item: RefinementItem): boolean =>
  (item.refinements.length === 1 || item.refinements.length === 2) &&
  item.refinements[0]?.type === 'numeric';

export const useFormatFilterWidgetValue = () => {
  const { formatMessage } = useIntl();
  const { formatPrice } = useFormatFilters();
  const {
    leagueFilter,
    promotion,
    hasCollectibleFilter,
    nonPlayableCards,
    legend,
    customDecksFilter,
  } = useSearchCardsContext();

  const formatFilterWidgetValue = (
    item: RefinementItem | VirtualToggleFilter
  ): string[] => {
    const isRefinementItem = 'attribute' in item;

    if (isRefinementItem) {
      const toggleFilter = Object.values(TOGGLE_FILTERS).find(
        f => f.attribute === item.attribute
      );
      if (toggleFilter) {
        return [formatMessage(toggleFilter.label)];
      }
      if (isListFilterWidget(item)) {
        return formatListFilterWidgetValue(item, { formatMessage });
      }
      if (isRangeFilterWidget(item)) {
        return formatRangeFilterWidgetValue(item, { formatPrice });
      }
    } else {
      if (item.name === VIRTUAL_TOGGLE_FILTERS.leagueFilter.name) {
        return [leagueFilter || ''];
      }
      if (item.name === VIRTUAL_TOGGLE_FILTERS.promotedCardsFilter.name) {
        return [promotion || ''];
      }
      if (item.name === VIRTUAL_TOGGLE_FILTERS.customDecksFilter.name) {
        return [customDecksFilter || ''];
      }
      if (item.name === VIRTUAL_TOGGLE_FILTERS.nonPlayableCardsFilter.name) {
        return [
          ...(hasCollectibleFilter &&
          nonPlayableCards &&
          VIRTUAL_TOGGLE_FILTERS.nonPlayableCardsFilter.label
            ? [
                formatMessage(
                  VIRTUAL_TOGGLE_FILTERS.nonPlayableCardsFilter.label
                ),
              ]
            : []),
          ...(hasCollectibleFilter &&
          legend &&
          VIRTUAL_TOGGLE_FILTERS.legendFilter.label
            ? [formatMessage(VIRTUAL_TOGGLE_FILTERS.legendFilter.label)]
            : []),
        ];
      }
      return [item.label ? formatMessage(item.label) : ''];
    }

    return [''];
  };

  return {
    formatFilterWidgetValue,
  };
};

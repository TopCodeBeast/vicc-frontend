import {
  useCurrentRefinements,
  useSearchBox,
} from 'react-instantsearch-hooks-web';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { useSportContext } from '@sorare/core/src/contexts/sport';
import { useVirtualToggleManager } from '@sorare/core/src/hooks/useVirtualToggleManager';
import {
  APPEARANCES_15_MAX,
  APPEARANCES_5_MAX,
  APPEARANCES_MIN,
  LEVEL_MAX,
  LEVEL_MIN,
} from '@sorare/core/src/lib/cards';
import { FILTERS, TOGGLE_FILTERS } from '@sorare/core/src/lib/filters';
import { filters } from '@sorare/core/src/lib/glossary';
import { theme } from '@sorare/core/src/style/theme';

import { useMarketplaceContext } from '@sorare/marketplace/src/contexts/Marketplace';
import {
  isListFilterWidget,
  isRangeFilterWidget,
  useFormatFilterWidgetValue,
} from '@sorare/marketplace/src/hooks/search/useFormatFilterWidgetValue';
import { useClearAllFilters } from '@sorare/marketplace/src/search/ClearAllFilters';
import useFiltersCount from '@sorare/marketplace/src/search/FiltersManager/useFiltersCount';

import { FilterChip } from './FilterChip';
import { ListActiveFilter } from './ListActiveFilter';
import { RangeActiveFilter } from './RangeActiveFilter';
import { VirtualToggleActiveFilters } from './VirtualToggleActiveFilters';
import { RefinementItem } from './types';

const Container = styled.div`
  display: flex;
  gap: var(--unit);
  flex-wrap: nowrap;
  overflow-x: auto;
  & > * {
    flex: none;
  }

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    flex-wrap: wrap;
    & > * {
      flex: initial;
    }
  }
`;

const ActiveFilter = ({ item }: { item: RefinementItem }) => {
  const { sport } = useSportContext();
  const { trackRemoveMarketFilterChip } = useMarketplaceContext();
  const { formatFilterWidgetValue } = useFormatFilterWidgetValue();

  if (item.attribute === TOGGLE_FILTERS.onSaleFilter.attribute) {
    const [label] = formatFilterWidgetValue(item);

    return (
      <FilterChip
        label={label}
        onClose={() => {
          item.refine(item.refinements?.[0]);
          if (sport) {
            trackRemoveMarketFilterChip(item.attribute, 'false', sport);
          }
        }}
      />
    );
  }

  if (isListFilterWidget(item)) {
    return <ListActiveFilter item={item} />;
  }

  if (isRangeFilterWidget(item)) {
    return <RangeActiveFilter item={item} />;
  }

  return null;
};

export const ActiveFilters = () => {
  const { sport } = useSportContext();
  const { trackRemoveMarketFilterChip } = useMarketplaceContext();
  const filtersCount = useFiltersCount();
  const { items } = useCurrentRefinements();
  const { query, clear } = useSearchBox();
  const clearAllFilters = useClearAllFilters();
  const setVirtualToggleFilters = useVirtualToggleManager();

  const relevantItems = items.filter(item => {
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

  if (!filtersCount) {
    return null;
  }

  return (
    <Container>
      {query && (
        <FilterChip
          label={
            <FormattedMessage
              id="ActiveFilters.search"
              defaultMessage="Search: {query}"
              values={{ query }}
            />
          }
          onClose={() => {
            clear();
            if (sport) {
              trackRemoveMarketFilterChip('query', query, sport);
            }
          }}
        />
      )}
      {relevantItems.map(item => (
        <ActiveFilter key={item.attribute} item={item as RefinementItem} />
      ))}
      <VirtualToggleActiveFilters
        setVirtualToggleFilters={setVirtualToggleFilters}
      />
      <FilterChip
        label={<FormattedMessage {...filters.clearAll} />}
        onClick={clearAllFilters}
        transparent
      />
    </Container>
  );
};

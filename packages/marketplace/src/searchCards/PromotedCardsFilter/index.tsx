import { useCallback, useMemo } from 'react';
import { useInstantSearch } from 'react-instantsearch-hooks-web';

import { FilterSection } from '@sorare/core/src/components/search/FilterSection';
import FilterTitle from '@sorare/core/src/components/search/FilterTitle';
import { ExtendedUIState } from '@sorare/core/src/components/search/InstantSearch/types';
import Option from '@sorare/core/src/components/search/Option';
import { useConfigContext } from '@sorare/core/src/contexts/config';
import { useSportContext } from '@sorare/core/src/contexts/sport';
import useVirtualToggle from '@sorare/core/src/hooks/useVirtualToggle';
import { useVirtualToggleManager } from '@sorare/core/src/hooks/useVirtualToggleManager';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import {
  FilterWidget,
  VIRTUAL_TOGGLE_FILTERS,
} from '@sorare/core/src/lib/filters';

const FILTER = VIRTUAL_TOGGLE_FILTERS.promotedCardsFilter;

export const usePromotionalEventsEntries = () => {
  const { sport } = useSportContext();
  const { marketplacePromotionalEvents } = useConfigContext();
  return useMemo(
    () =>
      marketplacePromotionalEvents.find(e => e.sport === sport)?.events || [],
    [marketplacePromotionalEvents, sport]
  );
};

const Filter = () => {
  const track = useEvents();
  const entries = usePromotionalEventsEntries();
  const setVirtualToggle = useVirtualToggleManager();
  const { currentRefinement } = useVirtualToggle<string>({
    name: FILTER.name,
  });

  const handleChange = useCallback(
    (promo: string) => {
      const isActive = currentRefinement === promo;
      const newValue = isActive ? undefined : promo;
      setVirtualToggle({
        [FILTER.name]: newValue,
      });

      if (!isActive) {
        track('Use Market Filter', {
          filterName: FILTER.trackingName,
          filterValue: promo,
        });
      }
    },
    [currentRefinement, setVirtualToggle, track]
  );

  return (
    <FilterSection hidden={!entries.length}>
      {entries.map(item => (
        <Option
          key={item.name}
          label={item.name}
          active={currentRefinement === item.name}
          onClick={() => handleChange(item.name)}
          variant="radio"
        />
      ))}
    </FilterSection>
  );
};

const Title = () => {
  const { indexUiState } = useInstantSearch<ExtendedUIState>();
  const selected = !!indexUiState?.virtualToggle?.[FILTER.name];

  return <FilterTitle name={FILTER.title!} selected={selected} />;
};

const widget: FilterWidget = {
  key: FILTER.name,
  type: 'virtualToggle',
  filter: FILTER,
  title: <Title />,
  component: <Filter />,
  accordionOptions: { startsOpen: false },
};

export default widget;

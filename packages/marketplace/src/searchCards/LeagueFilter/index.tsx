import { useCallback } from 'react';
import { useInstantSearch } from 'react-instantsearch-hooks-web';

import { FilterSection } from '@sorare/core/src/components/search/FilterSection';
import FilterTitle from '@sorare/core/src/components/search/FilterTitle';
import { ExtendedUIState } from '@sorare/core/src/components/search/InstantSearch/types';
import Option from '@sorare/core/src/components/search/Option';
import { useConfigContext } from '@sorare/core/src/contexts/config';
import useVirtualToggle from '@sorare/core/src/hooks/useVirtualToggle';
import { useVirtualToggleManager } from '@sorare/core/src/hooks/useVirtualToggleManager';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import {
  FilterWidget,
  VIRTUAL_TOGGLE_FILTERS,
} from '@sorare/core/src/lib/filters';

export const DEFAULT_VALUE = 'global:all_star';

const FILTER = VIRTUAL_TOGGLE_FILTERS.leagueFilter;

const LeagueFilter = () => {
  const {
    so5: { so5LeaguesAlgoliaFilters },
  } = useConfigContext();
  const setVirtualToggle = useVirtualToggleManager();
  const { currentRefinement } = useVirtualToggle<string>({
    name: FILTER.name,
  });
  const track = useEvents();
  const onChange = useCallback(
    (league: any) => {
      const isActive = currentRefinement === league;
      const newValue = isActive ? undefined : league;
      setVirtualToggle({
        [FILTER.name]: newValue,
      });

      if (!isActive) {
        track('Use Market Filter', {
          filterName: FILTER.trackingName,
          filterValue: league,
        });
      }
    },
    [currentRefinement, setVirtualToggle, track]
  );

  return (
    <FilterSection>
      {Object.keys(so5LeaguesAlgoliaFilters).map(k => (
        <Option
          key={k}
          label={k}
          active={currentRefinement === k}
          onClick={() => onChange(k)}
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
  component: <LeagueFilter />,
  title: <Title />,
};

export default widget;

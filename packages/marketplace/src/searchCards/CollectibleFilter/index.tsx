import { ChangeEvent, useCallback } from 'react';
import { useInstantSearch } from 'react-instantsearch-hooks-web';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Text14 } from '@sorare/core/src/atoms/typography';
import FilterTitle from '@sorare/core/src/components/search/FilterTitle';
import { ExtendedUIState } from '@sorare/core/src/components/search/InstantSearch/types';
import Switch from '@sorare/core/src/components/search/Switch';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import useVirtualToggle from '@sorare/core/src/hooks/useVirtualToggle';
import { useVirtualToggleManager } from '@sorare/core/src/hooks/useVirtualToggleManager';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import {
  FilterWidget,
  VIRTUAL_TOGGLE_FILTERS,
  VirtualToggleFilter,
} from '@sorare/core/src/lib/filters';
import { filters } from '@sorare/core/src/lib/glossary';

const NON_PLAYABLE_CARDS_FILTER = VIRTUAL_TOGGLE_FILTERS.nonPlayableCardsFilter;
const LEGEND_FILTER = VIRTUAL_TOGGLE_FILTERS.legendFilter;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

type SharedProps = {
  withCustomSeries: boolean;
  withLegend: boolean;
};

const Filter = ({ filter }: { filter: VirtualToggleFilter }) => {
  const { formatMessage } = useIntl();
  const track = useEvents();
  const setVirtualToggle = useVirtualToggleManager();
  const { currentRefinement } = useVirtualToggle<boolean>({
    name: filter.name,
  });

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.checked;
      setVirtualToggle({
        [filter.name]: newValue,
      });
      track('Use Market Filter', {
        filterName: filter.trackingName,
        filterValue: newValue.toString(),
      });
    },
    [filter, setVirtualToggle, track]
  );

  return (
    <Switch
      checked={!!currentRefinement}
      onChange={handleChange}
      label={<Text14>{formatMessage(filter.label!)}</Text14>}
    />
  );
};

const Filters = ({ withCustomSeries, withLegend }: SharedProps) => {
  const {
    flags: { useLegendMarketplaceFilter = false },
  } = useFeatureFlags();

  return (
    <Root>
      {[
        ...(withCustomSeries ? [NON_PLAYABLE_CARDS_FILTER] : []),
        ...(useLegendMarketplaceFilter && withLegend ? [LEGEND_FILTER] : []),
      ].map(filter => (
        <Filter key={filter.name} filter={filter} />
      ))}
    </Root>
  );
};

const Title = ({ withCustomSeries, withLegend }: SharedProps) => {
  const { indexUiState } = useInstantSearch<ExtendedUIState>();

  const selected =
    (withCustomSeries &&
    indexUiState.virtualToggle?.[NON_PLAYABLE_CARDS_FILTER.name]
      ? 1
      : 0) +
    (withLegend && indexUiState.virtualToggle?.[LEGEND_FILTER.name] ? 1 : 0);

  return (
    <FilterTitle name={filters.collectibleFilterTitle} selected={selected} />
  );
};

export default ({
  withCustomSeries = true,
  withLegend = true,
}: {
  withCustomSeries?: boolean;
  withLegend?: boolean;
} = {}): FilterWidget => ({
  key: 'collectible',
  type: 'virtualToggle',
  filter: NON_PLAYABLE_CARDS_FILTER,
  title: <Title withCustomSeries={withCustomSeries} withLegend={withLegend} />,
  component: (
    <Filters withCustomSeries={withCustomSeries} withLegend={withLegend} />
  ),
});

import { ChangeEvent } from 'react';
import {
  useInstantSearch,
  useToggleRefinement,
} from 'react-instantsearch-hooks-web';
import { useIntl } from 'react-intl';

import { Text16 } from '@sorare/core/src/atoms/typography';
import Switch from '@sorare/core/src/components/search/Switch';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { FilterWidget, TOGGLE_FILTERS } from '@sorare/core/src/lib/filters';

const FILTER = TOGGLE_FILTERS.onSaleFilter;

const Filter = () => {
  const { formatMessage } = useIntl();
  const {
    value: { isRefined },
    refine,
  } = useToggleRefinement({ attribute: FILTER.attribute });
  const { indexUiState } = useInstantSearch();
  const track = useEvents();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    track('Use Market Filter', {
      filterName: FILTER.attribute,
      filterValue: event.target.checked.toString(),
    });

    refine({ isRefined });
  };

  // we rather consider the refinement state from the UI
  // so that we don't rely on the Algolia answer to come back to reflect the slider state
  const optimisticRefined = !!indexUiState.toggle?.[FILTER.attribute];

  return (
    <Switch
      checked={optimisticRefined}
      onChange={handleChange}
      label={<Text16 bold>{formatMessage(FILTER.label)}</Text16>}
    />
  );
};

export default ({
  startsOpen = true,
}: {
  startsOpen?: boolean;
} = {}): FilterWidget => ({
  key: FILTER.attribute,
  type: 'toggle',
  attribute: FILTER.attribute,
  component: <Filter />,
  accordionOptions: { startsOpen },
});

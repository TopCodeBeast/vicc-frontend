import { ChangeEvent } from 'react';
import { useIntl } from 'react-intl';

import { Text16 } from '@sorare/core/src/atoms/typography';
import Switch from '@sorare/core/src/components/search/Switch';
import useFavoriteFilterValue from '@sorare/core/src/contexts/searchCards/useFavoriteFilterValue';
import useLoggedCallback from '@sorare/core/src/hooks/useLoggedCallback';
import useVirtualToggle from '@sorare/core/src/hooks/useVirtualToggle';
import { useVirtualToggleManager } from '@sorare/core/src/hooks/useVirtualToggleManager';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import {
  FilterWidget,
  VIRTUAL_TOGGLE_FILTERS,
} from '@sorare/core/src/lib/filters';

const FILTER = VIRTUAL_TOGGLE_FILTERS.favoriteFilter;

const Filter = () => {
  const { formatMessage } = useIntl();
  const favoriteFilters = useFavoriteFilterValue();
  const track = useEvents();
  const setVirtualToggle = useVirtualToggleManager();
  const { currentRefinement } = useVirtualToggle<boolean>({
    name: FILTER.name,
  });

  const loggedHandleChange = useLoggedCallback<ChangeEvent<HTMLInputElement>>(
    event => {
      const newValue = event.target.checked;
      setVirtualToggle({
        [FILTER.name]: newValue,
      });
      track('Use Market Filter', {
        filterName: FILTER.trackingName,
        filterValue: newValue.toString(),
      });
    }
  );

  return (
    <Switch
      checked={!!currentRefinement}
      onChange={loggedHandleChange}
      disabled={!favoriteFilters}
      label={<Text16 bold>{formatMessage(FILTER.label!)}</Text16>}
    />
  );
};

const widget: FilterWidget = {
  key: FILTER.name,
  type: 'virtualToggle',
  filter: FILTER,
  component: <Filter />,
};

export default widget;

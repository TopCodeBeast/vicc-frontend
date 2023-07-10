import { ChangeEvent, useCallback } from 'react';
import { useIntl } from 'react-intl';

import { Text16 } from '@sorare/core/src/atoms/typography';
import Switch from '@sorare/core/src/components/search/Switch';
import useVirtualToggle from '@sorare/core/src/hooks/useVirtualToggle';
import { useVirtualToggleManager } from '@sorare/core/src/hooks/useVirtualToggleManager';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import {
  FilterWidget,
  VIRTUAL_TOGGLE_FILTERS,
} from '@sorare/core/src/lib/filters';

const FILTER = VIRTUAL_TOGGLE_FILTERS.playingNextGameweekFilter;

export const PlayingNextGameweekFilter = () => {
  const { formatMessage } = useIntl();
  const track = useEvents();
  const setVirtualToggle = useVirtualToggleManager();
  const { currentRefinement } = useVirtualToggle<boolean>({
    name: FILTER.name,
  });

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.checked;
      setVirtualToggle({
        [FILTER.name]: newValue,
      });
      track('Use Market Filter', {
        filterName: FILTER.trackingName,
        filterValue: newValue.toString(),
      });
    },
    [setVirtualToggle, track]
  );

  return (
    <Switch
      checked={!!currentRefinement}
      onChange={handleChange}
      label={<Text16 bold>{formatMessage(FILTER.label!)}</Text16>}
    />
  );
};

const widget: FilterWidget = {
  key: FILTER.name,
  type: 'virtualToggle',
  filter: FILTER,
  component: <PlayingNextGameweekFilter />,
};

export default widget;

import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import Switch from '@sorare/core/src/components/search/Switch';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { FilterWidget, TOGGLE_FILTERS } from '@sorare/core/src/lib/filters';

import { useMarketplaceContext } from '@marketplace/contexts/Marketplace';

const StyledText16 = styled(Text16)`
  display: inline-flex;
  align-items: center;
  gap: var(--unit);
`;

const FILTER = TOGGLE_FILTERS.showDetails;

const Filter = () => {
  const { hideDetails, setHideDetails } = useMarketplaceContext();
  const track = useEvents();

  return (
    <Switch
      checked={!hideDetails}
      onChange={event => {
        track('Use Market Filter', {
          filterName: FILTER.attribute,
          filterValue: event.target.checked.toString(),
        });
        setHideDetails(!event.target.checked);
      }}
      label={
        <StyledText16 bold>
          <FormattedMessage
            id="ShowDetails.label"
            defaultMessage="Show details"
          />
        </StyledText16>
      }
    />
  );
};

const widget: FilterWidget = {
  key: 'hideDetails',
  type: 'toggle',
  attribute: '',
  component: <Filter />,
};

export default widget;

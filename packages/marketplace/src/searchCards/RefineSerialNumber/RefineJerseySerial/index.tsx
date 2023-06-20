import { ChangeEvent, useCallback } from 'react';
import {
  useInstantSearch,
  useToggleRefinement,
} from 'react-instantsearch-hooks-web';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import Checkbox from '@sorare/core/src/atoms/inputs/Checkbox';
import { Text14 } from '@sorare/core/src/atoms/typography';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { FilterWidget, TOGGLE_FILTERS } from '@sorare/core/src/lib/filters';

const FILTER = TOGGLE_FILTERS.jerseySerialFilter;

const Root = styled.label`
  display: flex;
  gap: var(--unit);
`;
const StyledCheckbox = styled(Checkbox)`
  padding: 0;
`;

const Filter = () => {
  const { formatMessage } = useIntl();
  const {
    value: { isRefined },
    refine,
  } = useToggleRefinement({
    attribute: FILTER.attribute,
  });
  const track = useEvents();
  const { indexUiState } = useInstantSearch();

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      track('Use Market Filter', {
        filterName: FILTER.attribute,
        filterValue: event.target.checked.toString(),
      });

      refine({ isRefined });
    },
    [track, refine, isRefined]
  );

  const optimisticRefined = !!indexUiState.toggle?.[FILTER.attribute];

  return (
    <Root htmlFor="jersey_serial">
      <StyledCheckbox
        id="jersey_serial"
        checked={optimisticRefined}
        onChange={handleChange}
      />
      <Text14 color="var(--c-neutral-600)">
        {formatMessage(FILTER.label!)}
      </Text14>
    </Root>
  );
};

export const jerseySerialWidget: FilterWidget = {
  key: FILTER.attribute,
  type: 'toggle',
  attribute: FILTER.attribute,
  component: <Filter />,
};

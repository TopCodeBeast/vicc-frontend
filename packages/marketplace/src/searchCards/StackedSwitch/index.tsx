import { usePagination } from 'react-instantsearch-hooks-web';
import styled from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { StackedCards } from '@sorare/core/src/atoms/icons/StackedCards';
import useVirtualToggle from '@sorare/core/src/hooks/useVirtualToggle';
import { useVirtualToggleManager } from '@sorare/core/src/hooks/useVirtualToggleManager';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { VIRTUAL_TOGGLE_FILTERS } from '@sorare/core/src/lib/filters';

const CardSymbol = styled.div`
  width: 8px;
  height: 12px;
  border-radius: 2px;
  background-color: currentColor;
`;

const StackedSwitch = () => {
  const track = useEvents();
  const FILTER = VIRTUAL_TOGGLE_FILTERS.unstackedFilter;

  const setVirtualToggle = useVirtualToggleManager();
  const { currentRefinement: unstacked } = useVirtualToggle<boolean>({
    name: FILTER.name,
  });

  const trackSwitch = (unstackedValue: boolean) => {
    track('Switch Stacked View', {
      stacked: !unstackedValue,
    });
  };

  const { refine: setPage } = usePagination();

  return (
    <IconButton
      small
      color="white"
      onClick={() => {
        setPage(0);
        setVirtualToggle({ [FILTER.name]: !unstacked });
        trackSwitch(!unstacked);
      }}
    >
      {unstacked ? <StackedCards /> : <CardSymbol />}
    </IconButton>
  );
};

export default StackedSwitch;

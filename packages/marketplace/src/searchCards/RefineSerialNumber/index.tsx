import { useInstantSearch } from 'react-instantsearch-hooks-web';
import styled from 'styled-components';

import FilterTitle from '@sorare/core/src/components/search/FilterTitle';
import {
  FILTERS,
  FilterWidget,
  TOGGLE_FILTERS,
} from '@sorare/core/src/lib/filters';
import { powerAlgorithm } from '@sorare/core/src/lib/slider';

import RangeSlider from '@marketplace/search/RangeSlider';
import { makeRangeFilter } from '@marketplace/searchCards/RangeSlider';

import { jerseySerialWidget } from './RefineJerseySerial';

const FILTER = FILTERS.serialNumber;

const refineSerialNumberAlgorithm = powerAlgorithm({ power: 2 });

const SerialNumberRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const SerialNumberTitle = () => {
  const { indexUiState } = useInstantSearch();

  const selected =
    !!indexUiState.range?.[FILTER.attribute] ||
    !!indexUiState.toggle?.[TOGGLE_FILTERS.jerseySerialFilter.attribute];

  return <FilterTitle name={FILTER.title} selected={selected} />;
};

export const RefineSerialNumber = ({
  withJerseySerial,
}: {
  withJerseySerial?: boolean;
} = {}): FilterWidget => {
  const serialNumberWidget = makeRangeFilter(() => {
    return (
      <SerialNumberRoot>
        <RangeSlider
          attribute={FILTERS.serialNumber.attribute}
          algorithm={refineSerialNumberAlgorithm}
          toInput={(value: number) => Math.round(value).toString()}
        />
        {withJerseySerial && jerseySerialWidget.component}
      </SerialNumberRoot>
    );
  }, FILTERS.serialNumber);

  return {
    ...serialNumberWidget,
    title: <SerialNumberTitle />,
  };
};

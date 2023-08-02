import { defineMessages } from 'react-intl';

import {
  AvailableDraftPlayersSortInput,
  AvailableDraftPlayersSorting,
  SortingOption,
} from '@sorare/core/src/__generated__/globalTypes';

const messages = defineMessages({
  valueDescending: {
    id: 'DraftFilters.Sort.ValueDescending',
    defaultMessage: 'Highest points',
  },
  valueAscending: {
    id: 'DraftFilters.Sort.ValueAscending',
    defaultMessage: 'Lowest points',
  },
  percentageDescending: {
    id: 'DraftFilters.Sort.PercentageDescending',
    defaultMessage: 'Most selected',
  },
  percentageAscending: {
    id: 'DraftFilters.Sort.PercentageAscending',
    defaultMessage: 'Least selected',
  },
});

const valueSortOptions = [
  {
    value: 'valueDescending',
    label: messages.valueDescending,
    sortType: {
      direction: SortingOption.DESC,
      type: AvailableDraftPlayersSorting.VALUE,
    },
  },
  {
    value: 'valueAscending',
    label: messages.valueAscending,
    sortType: {
      direction: SortingOption.ASC,
      type: AvailableDraftPlayersSorting.VALUE,
    },
  },
];

const percentageSortOptions = [
  {
    value: 'percentageDescending',
    label: messages.percentageDescending,
    sortType: {
      direction: SortingOption.DESC,
      type: AvailableDraftPlayersSorting.PERCENTAGE,
    },
  },
  {
    value: 'percentageAscending',
    label: messages.percentageAscending,
    sortType: {
      direction: SortingOption.ASC,
      type: AvailableDraftPlayersSorting.PERCENTAGE,
    },
  },
];

export const sortOptions = [...percentageSortOptions, ...valueSortOptions];

export const getSortType = (value: string) => {
  return (
    sortOptions.find(option => option.value === value)?.sortType ||
    sortOptions[0].sortType
  );
};

export const getSortValue = (type: AvailableDraftPlayersSortInput | null) => {
  const correspondingOption = sortOptions.find(
    ({ sortType }) =>
      sortType.direction === type?.direction && sortType.type === type?.type
  );
  return correspondingOption?.value;
};

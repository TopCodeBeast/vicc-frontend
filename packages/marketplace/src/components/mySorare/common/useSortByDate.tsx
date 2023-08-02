import { useMemo } from 'react';
import { defineMessages } from 'react-intl';

import { SortingOption } from '@sorare/core/src/__generated__/globalTypes';
import Select from '@sorare/core/src/atoms/inputs/Select';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { useQueryState } from '@sorare/core/src/hooks/useQueryState';
import { toCamelCase } from '@sorare/core/src/lib/toCamelCase';

import { DefaultSortType } from './types';

const messages = defineMessages({
  latest: {
    id: 'useSortByDate.latest',
    defaultMessage: 'Latest',
  },
  oldest: {
    id: 'useSortByDate.oldest',
    defaultMessage: 'Oldest',
  },
});

export default () => {
  const { formatMessage } = useIntlContext();

  const [{ sortType }, setSortType] = useQueryState({
    sortType: DefaultSortType.LATEST,
  });

  const onSortTypeChange = (item: {
    label: DefaultSortType;
    value: DefaultSortType;
  }) => {
    setSortType({ sortType: item.value });
  };

  const sortAsVariable =
    sortType === DefaultSortType.LATEST
      ? SortingOption.DESC
      : SortingOption.ASC;

  const sortOptions = useMemo(
    () =>
      Object.values(DefaultSortType).map(element => ({
        label: formatMessage(
          messages[toCamelCase(element) as keyof typeof messages]
        ),
        value: element,
      })),
    [formatMessage]
  );

  const SortSelect = () => (
    <Select
      menuLateralAlignment="right"
      value={{
        label: formatMessage(
          messages[toCamelCase(sortType) as keyof typeof messages]
        ),
        value: sortType,
      }}
      onChange={option =>
        onSortTypeChange(
          option as { label: DefaultSortType; value: DefaultSortType }
        )
      }
      options={sortOptions}
    />
  );

  return { sortOptions, sortType, SortSelect, sortAsVariable };
};

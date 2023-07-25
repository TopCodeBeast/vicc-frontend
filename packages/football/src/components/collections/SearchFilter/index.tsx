import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useDebounce } from 'react-use';

import SearchInput from '@sorare/core/src/atoms/inputs/SearchInput';
import { glossary } from '@sorare/core/src/lib/glossary';

import { CollectionsFiltersState } from '@football/components/collections/types';

type Props = {
  onSearchChange: (newState: CollectionsFiltersState) => void;
  filtersState: CollectionsFiltersState;
};

export const SearchFilter = ({ onSearchChange, filtersState }: Props) => {
  const { formatMessage } = useIntl();
  const [search, setSearch] = useState(filtersState.query);

  useDebounce(
    () => {
      onSearchChange({ ...filtersState, query: search });
    },
    300,
    [search]
  );

  return (
    <SearchInput
      fullWidth
      small
      rounded
      withIcon
      withClearIcon
      value={search}
      onChange={event => setSearch(event.target.value)}
      placeholder={formatMessage(glossary.search)}
      onClear={() => {
        setSearch('');
      }}
    />
  );
};

import { defineMessages, useIntl } from 'react-intl';

import { Position } from '@sorare/core/src/__generated__/globalTypes';
import SearchInput from '@sorare/core/src/atoms/inputs/SearchInput';

type Props = {
  onChange: (value: string) => void;
  value: string;
  onClear: () => void;
  fullWidth?: boolean;
  currentPosition: Position;
  doNotHideClearIcon?: boolean;
  autoFocus?: boolean;
  className?: string;
};

const messages = defineMessages<Position>({
  Bowler: {
    id: 'DraftFilters.SearchFilter.placeholder.bowler',
    defaultMessage: 'Search a bowler',
  },
  Fielder: {
    id: 'DraftFilters.SearchFilter.placeholder.fielder',
    defaultMessage: 'Search a fielder',
  },
  Batsman: {
    id: 'DraftFilters.SearchFilter.placeholder.batsman',
    defaultMessage: 'Search a batsman',
  },
  Wicketkeeper: {
    id: 'DraftFilters.SearchFilter.placeholder.wicketkeeper',
    defaultMessage: 'Search a wicketkeeper',
  },
  AllRounder: {
    id: 'DraftFilters.SearchFilter.placeholder.allrounder',
    defaultMessage: 'Search all rounder',
  },
  Unknown: {
    id: 'DraftFilters.SearchFilter.placeholder.default',
    defaultMessage: 'Search players',
  },
});

export const SearchFilter = ({
  onChange,
  value,
  onClear,
  fullWidth = false,
  currentPosition,
  doNotHideClearIcon = false,
  autoFocus = false,
}: Props) => {
  const { formatMessage } = useIntl();

  return (
    <SearchInput
      rounded
      value={value}
      onChange={event => {
        onChange(event?.target.value);
      }}
      placeholder={formatMessage(messages[currentPosition || 'Unknown'])}
      withIcon
      withClearIcon
      doNotHideClearIcon={doNotHideClearIcon}
      onClear={onClear}
      largeFont
      fullWidth={fullWidth}
      small
      autoFocus={autoFocus}
    />
  );
};

export default SearchFilter;

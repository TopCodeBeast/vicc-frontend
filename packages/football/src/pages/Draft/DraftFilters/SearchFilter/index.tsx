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
  Forward: {
    id: 'DraftFilters.SearchFilter.placeholder.forward',
    defaultMessage: 'Search a forward',
  },
  Midfielder: {
    id: 'DraftFilters.SearchFilter.placeholder.midfielder',
    defaultMessage: 'Search a midfielder',
  },
  Defender: {
    id: 'DraftFilters.SearchFilter.placeholder.defender',
    defaultMessage: 'Search a defender',
  },
  Goalkeeper: {
    id: 'DraftFilters.SearchFilter.placeholder.goalkeeper',
    defaultMessage: 'Search a goalkeeper',
  },
  Coach: {
    id: 'DraftFilters.SearchFilter.placeholder.default',
    defaultMessage: 'Search players',
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

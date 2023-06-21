import { faCaretLeft, faFilter } from '@fortawesome/pro-solid-svg-icons';
import { useContext, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDebounce } from 'react-use';
import styled from 'styled-components';

import ButtonBase from '@sorare/core/src/atoms/buttons/ButtonBase';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import SearchInput from '@sorare/core/src/atoms/inputs/SearchInput';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useToggle from '@sorare/core/src/hooks/useToggle';
import { useUseCustomLists } from '@sorare/core/src/lib/featureFlags';
import { glossary } from '@sorare/core/src/lib/glossary';

import Context from '@football/components/so5/ComposeTeam/Context';
import CustomListFilter from '@football/components/so5/ComposeTeam/responsive/CustomListFilter';
import useShortcut from '@football/hooks/useShortcut';

import CollapsibleFilterContent from './CollapsibleFilterContent';
import FilterDropdown from './FilterDropdown';

const Wrapper = styled.div`
  background: var(--c-neutral-100);
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const SearchRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--unit);
`;
const AvgScoreFilterButton = styled(ButtonBase)`
  color: var(--c-neutral-1000);
  font-weight: var(--t-bold);
  border: 2px solid transparent;
  background: linear-gradient(0deg, var(--c-neutral-200), var(--c-neutral-200))
      padding-box,
    linear-gradient(90deg, #ffc700, #db00ff 63.2%, #0038ff 100%) border-box;
  border-radius: var(--double-unit);
  box-sizing: border-box;
  height: 40px;
  padding: 0 var(--unit);
`;

export const BenchFilter = () => {
  const { formatMessage } = useIntl();
  const {
    activePosition,
    onboarding,
    filters,
    setSearch,
    search,
    displayedAverageScore,
    setBenchOpen,
    isMobile,
    isCappedMode,
    averageScoreOptions,
    toggleAvgScore,
  } = useContext(Context)!;

  const useCustomLists = useUseCustomLists();
  const [filtersOpen, toggleFiltersOpen] = useToggle(false);
  const inputRef = useRef<HTMLInputElement>();
  const { includeNoGameCards } = filters;
  const [searchInput, setSearchInput] = useState(search);
  const [lastPosition, setLastPosition] = useState(activePosition);
  const [lastNoGameCards, setLastNoGameCards] = useState(includeNoGameCards);

  useDebounce(() => setSearch(searchInput), 300, [searchInput]);

  const { Icon: SearchShortcut } = useShortcut('cmdk', () =>
    // need to wrapp this in an arrow function to update the reference
    inputRef.current?.focus()
  );
  useShortcut('f', toggleFiltersOpen);

  const { up: isTablet } = useScreenSize('tablet');

  if (activePosition !== lastPosition) {
    setLastPosition(activePosition);
    if (searchInput) {
      setSearch('');
      setSearchInput('');
    }
  }
  if (includeNoGameCards !== lastNoGameCards) {
    setLastNoGameCards(includeNoGameCards);
  }

  const currentAverageScore = averageScoreOptions.find(
    ({ value }) => value === displayedAverageScore
  );

  return (
    <Wrapper>
      <SearchRow>
        {isMobile && (
          <IconButton
            color="white"
            icon={faCaretLeft}
            onClick={() => setBenchOpen(false)}
          />
        )}
        <SearchInput
          fullWidth
          inputRef={inputRef}
          value={searchInput}
          onKeyDown={event => {
            if (event.key === 'Escape' || event.key === 'ArrowDown') {
              inputRef.current?.blur();
            } else {
              event.stopPropagation();
            }
          }}
          endAdornment={SearchShortcut}
          onChange={event => {
            setSearchInput(event.target.value);
          }}
          placeholder={formatMessage(glossary.search)}
          withIcon
        />
        {!onboarding &&
          (isTablet ? (
            <IconButton
              disableDebounce
              color="white"
              icon={faFilter}
              onClick={toggleFiltersOpen}
            />
          ) : (
            <FilterDropdown />
          ))}
        {!isCappedMode && (
          <AvgScoreFilterButton disableDebounce onClick={toggleAvgScore}>
            {currentAverageScore?.label}
          </AvgScoreFilterButton>
        )}

        {useCustomLists && <CustomListFilter />}
      </SearchRow>
      {!onboarding && isTablet && (
        <CollapsibleFilterContent open={filtersOpen} />
      )}
    </Wrapper>
  );
};

export default BenchFilter;

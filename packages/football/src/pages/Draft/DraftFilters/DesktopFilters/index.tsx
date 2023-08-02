import { TypedDocumentNode, gql } from '@apollo/client';
import { Dispatch, ReactNode, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDebounce } from 'react-use';
import styled from 'styled-components';

import { Position } from '@sorare/core/src/__generated__/globalTypes';
import diamond from '@sorare/core/src/assets/animations/diamond.png';
import { RangeValues } from '@sorare/core/src/atoms/inputs/RangeSlider';
import FilterInDropdown from '@sorare/core/src/components/FilterInDropdown';
import RangeSliderWithInputs from '@sorare/core/src/components/search/RangeSliderWithInputs';

import SearchFilter from '@football/pages/Draft/DraftFilters/SearchFilter';
import SortFilter from '@football/pages/Draft/DraftFilters/SortFilter';
import TeamsFilter from '@football/pages/Draft/DraftFilters/TeamsFilter';
import { getSortValue } from '@football/pages/Draft/DraftFilters/draftFilters';
import {
  Action,
  State,
  isRangeFilterSelected,
} from '@football/pages/Draft/DraftFilters/useFiltersReducer';

import { DesktopFilters_team } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  gap: var(--unit);
  flex-wrap: wrap;
`;

const SliderWrapper = styled.div`
  padding: calc(3 * var(--unit));
  max-width: 400px;
`;

const SortWrapper = styled.div`
  margin-left: auto;
`;

const SearchFilterWrapper = styled.div`
  flex: 1;
  display: flex;
  & > *:first-child {
    flex: 1;
  }
`;

type Props = {
  teams?: DesktopFilters_team[];
  state: State;
  dispatch: Dispatch<Action>;
  currentPosition: Position;
  children?: ReactNode;
};

export const DesktopFilters = ({
  teams,
  state,
  dispatch,
  currentPosition,
  children,
}: Props) => {
  const [appliedValue, setAppliedValue] = useState<RangeValues>();
  const [appliedSearch, setAppliedSearch] = useState<string>();
  const { selectedFilters, appliedFilters, boundariesRange } = state;

  const rangeFilterSelected = isRangeFilterSelected(
    selectedFilters.value,
    boundariesRange
  );

  useDebounce(
    () => {
      if (appliedValue) {
        dispatch({ type: 'changeAppliedValueRange', payload: appliedValue });
      }
    },
    300,
    [appliedValue]
  );

  useDebounce(
    () => {
      if (appliedSearch !== undefined) {
        dispatch({ type: 'changeAppliedSearch', payload: appliedSearch });
      }
    },
    300,
    [appliedSearch]
  );

  const onTeamsFilterChange = (teamSlugs: string[]) => {
    dispatch({
      type: 'changeSelectedTeams',
      payload: teamSlugs,
    });
    dispatch({
      type: 'changeAppliedTeams',
      payload: teamSlugs,
    });
  };

  const onPointsFilterChange = (payload: RangeValues) => {
    dispatch({ type: 'changeSelectedValueRange', payload });
    setAppliedValue(payload);
  };

  const onClearPointsFilter = () => {
    onPointsFilterChange({
      low: boundariesRange.min,
      high: boundariesRange.max,
    });
  };

  const onSortChange = (payload: string) => {
    dispatch({ type: 'changeSelectedSort', payload });
    dispatch({ type: 'changeAppliedSort', payload });
  };

  const onSearchChange = (payload: string) => {
    dispatch({ type: 'changeSelectedSearch', payload });
    setAppliedSearch(payload);
  };

  const onSearchClear = () => {
    dispatch({ type: 'clearSearch' });
  };

  const rangeValues = {
    low: selectedFilters.value.min,
    high: selectedFilters.value.max,
  };

  return (
    <div>
      <Wrapper>
        {children}
        <SearchFilterWrapper>
          <SearchFilter
            value={selectedFilters.query || ''}
            onChange={onSearchChange}
            onClear={onSearchClear}
            currentPosition={currentPosition}
          />
        </SearchFilterWrapper>
        <FilterInDropdown
          darkTheme
          buttonLabel={
            rangeFilterSelected ? (
              <FormattedMessage
                id="ValueFilter.labelWithValues"
                defaultMessage="Points {low}-{high}"
                values={rangeValues}
              />
            ) : (
              <FormattedMessage
                id="ValueFilter.label"
                defaultMessage="Points"
              />
            )
          }
          filterSelected={rangeFilterSelected}
          onClearFilter={onClearPointsFilter}
        >
          <SliderWrapper>
            <RangeSliderWithInputs
              id="value-filter"
              min={boundariesRange.min}
              max={boundariesRange.max}
              rangeValues={rangeValues}
              icon={<img src={diamond} alt="" />}
              onChange={onPointsFilterChange}
              inputBorderColor="var(--c-neutral-400)"
            />
          </SliderWrapper>
        </FilterInDropdown>
        {teams && (
          <TeamsFilter
            isMobile={false}
            teams={teams}
            onChange={onTeamsFilterChange}
          />
        )}

        <SortWrapper>
          <FilterInDropdown
            darkTheme
            buttonLabel={
              <FormattedMessage
                id="SortFilter.label"
                defaultMessage="Sort by"
              />
            }
          >
            <SortFilter
              onChange={onSortChange}
              initiallySelectedValue={getSortValue(appliedFilters.sortType)}
            />
          </FilterInDropdown>
        </SortWrapper>
      </Wrapper>
    </div>
  );
};

export default DesktopFilters;

DesktopFilters.fragments = {
  teams: gql`
    fragment DesktopFilters_team on Team {
      ...TeamsFilter_team
    }
    ${TeamsFilter.fragments.teams}
  ` as TypedDocumentNode<DesktopFilters_team>,
};

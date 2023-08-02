import { TypedDocumentNode, gql } from '@apollo/client';
import { faFilter, faSearch } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch, ReactNode, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDebounce } from 'react-use';
import styled from 'styled-components';

import { Position } from '@sorare/core/src/__generated__/globalTypes';
import diamond from '@sorare/core/src/assets/animations/diamond.png';
import Button from '@sorare/core/src/atoms/buttons/Button';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { RangeValues } from '@sorare/core/src/atoms/inputs/RangeSlider';
import { Text16, Title6 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import RangeSliderWithInputs from '@sorare/core/src/components/search/RangeSliderWithInputs';
import useToggle from '@sorare/core/src/hooks/useToggle';

import SearchFilter from '@football/pages/Draft/DraftFilters/SearchFilter';
import SortFilter from '@football/pages/Draft/DraftFilters/SortFilter';
import TeamsFilter from '@football/pages/Draft/DraftFilters/TeamsFilter';
import { getSortValue } from '@football/pages/Draft/DraftFilters/draftFilters';
import { Action, State } from '@football/pages/Draft/DraftFilters/useFiltersReducer';

import { MobileFilters_team } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 1;
  isolation: isolate;
  position: sticky;
  top: 0;
  gap: var(--unit);
  background-color: var(--c-neutral-100);
`;
const SearchLine = styled.div`
  display: flex;
  gap: var(--unit);
`;
const SearchWrapper = styled.div`
  width: 100%;
`;
const StyledIcon = styled(FontAwesomeIcon)`
  color: var(--c-neutral-1000);
`;
const CenteredText16 = styled(Text16)`
  text-align: center;
`;
const ButtonsWrapper = styled.div`
  display: flex;
  gap: var(--double-unit);
  padding: var(--triple-unit);
`;
const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  padding: var(--triple-unit);
`;

type Props = {
  teams?: MobileFilters_team[];
  state: State;
  dispatch: Dispatch<Action>;
  currentPosition: Position;
  children?: ReactNode;
};

export const MobileFilters = ({
  teams,
  state,
  dispatch,
  currentPosition,
  children,
}: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showSearch, toggleShowSearch] = useToggle(false);
  const [appliedSearch, setAppliedSearch] = useState<string>();

  const { selectedFilters, appliedFilters, boundariesRange } = state;

  useDebounce(
    () => {
      if (appliedSearch !== undefined) {
        dispatch({ type: 'changeAppliedSearch', payload: appliedSearch });
      }
    },
    300,
    [appliedSearch]
  );

  const onSortChange = (payload: string) => {
    dispatch({ type: 'changeSelectedSort', payload });
  };
  const onTeamsFilterChange = (payload: string[]) => {
    dispatch({
      type: 'changeSelectedTeams',
      payload,
    });
  };
  const onPointsFilterChange = (payload: RangeValues) => {
    dispatch({ type: 'changeSelectedValueRange', payload });
  };
  const onSearchChange = (payload: string) => {
    dispatch({ type: 'changeSelectedSearch', payload });
    setAppliedSearch(payload);
  };
  const onSearchClear = () => {
    toggleShowSearch();
    dispatch({ type: 'clearSearch' });
  };
  const onSave = () => {
    dispatch({ type: 'applyAllSelectedFilters' });
    setDialogOpen(false);
  };
  const onDelete = () => {
    dispatch({ type: 'clearMobileFilters' });
    setDialogOpen(false);
  };

  return (
    <Wrapper>
      <SearchLine>
        {!showSearch && (
          <>
            {children}
            <IconButton color="white" onClick={() => setDialogOpen(true)} small>
              <StyledIcon icon={faFilter} />
            </IconButton>
            <IconButton color="white" onClick={() => toggleShowSearch()} small>
              <StyledIcon icon={faSearch} />
            </IconButton>
          </>
        )}
        {showSearch && (
          <SearchWrapper>
            <SearchFilter
              value={selectedFilters.query || ''}
              onChange={onSearchChange}
              onClear={onSearchClear}
              currentPosition={currentPosition}
              doNotHideClearIcon
              fullWidth
              autoFocus
            />
          </SearchWrapper>
        )}
      </SearchLine>
      <Dialog
        darkTheme
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={
          <CenteredText16 bold>
            <FormattedMessage
              id="Draft.MobileFilters.title"
              defaultMessage="Filters"
            />
          </CenteredText16>
        }
        body={
          <DialogContent>
            <Title6>
              <FormattedMessage
                id="Draft.MobileFilters.sort"
                defaultMessage="Sort by"
              />
            </Title6>
            <SortFilter
              onChange={onSortChange}
              initiallySelectedValue={getSortValue(appliedFilters.sortType)}
              rounded
            />
            <Title6>
              <FormattedMessage
                id="Draft.MobileFilters.value"
                defaultMessage="Points"
              />
            </Title6>
            <RangeSliderWithInputs
              id="value-filter"
              min={boundariesRange.min}
              max={boundariesRange.max}
              rangeValues={{
                low: selectedFilters.value.min,
                high: selectedFilters.value.max,
              }}
              onChange={onPointsFilterChange}
              icon={<img src={diamond} alt="" />}
            />
            {teams && (
              <>
                <Title6>
                  <FormattedMessage
                    id="Draft.MobileFilters.teams"
                    defaultMessage="Teams"
                  />
                </Title6>
                <TeamsFilter
                  teams={teams}
                  initiallySelectedTeamSlugs={appliedFilters.teamSlugs || []}
                  onChange={onTeamsFilterChange}
                />
              </>
            )}
          </DialogContent>
        }
        footer={
          <ButtonsWrapper>
            <Button medium fullWidth color="white" onClick={onDelete}>
              <FormattedMessage
                id="Draft.MobileFilters.delete"
                defaultMessage="Clear"
              />
            </Button>
            <Button medium fullWidth color="blue" onClick={onSave}>
              <FormattedMessage
                id="Draft.MobileFilters.save"
                defaultMessage="Save"
              />
            </Button>
          </ButtonsWrapper>
        }
      />
    </Wrapper>
  );
};

export default MobileFilters;

MobileFilters.fragments = {
  teams: gql`
    fragment MobileFilters_team on Team {
      ...TeamsFilter_team
    }
    ${TeamsFilter.fragments.teams}
  ` as TypedDocumentNode<MobileFilters_team>,
};

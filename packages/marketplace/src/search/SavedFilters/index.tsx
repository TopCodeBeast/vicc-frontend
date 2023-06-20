import { gql } from '@apollo/client';
import {
  faBookmark,
  faPlusLarge,
  faTrash,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import isEqual from 'lodash.isequal';
import {
  ChangeEvent,
  FormEvent,
  Fragment,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useInstantSearch } from 'react-instantsearch-hooks-web';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import Dropdown from '@sorare/core/src/atoms/dropdowns/Dropdown';
import SearchInput from '@sorare/core/src/atoms/inputs/SearchInput';
import Dialog from '@sorare/core/src/atoms/layout/Dialog';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { ExtendedUIState } from '@sorare/core/src/components/search/InstantSearch/types';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useSportContext } from '@sorare/core/src/contexts/sport';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useMutation from '@sorare/core/src/hooks/graphql/useMutation';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import useToggle from '@sorare/core/src/hooks/useToggle';
import { useVirtualToggleManager } from '@sorare/core/src/hooks/useVirtualToggleManager';
import { getInteractionContext } from '@sorare/core/src/lib/events';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { VIRTUAL_TOGGLE_FILTERS } from '@sorare/core/src/lib/filters';
import { glossary } from '@sorare/core/src/lib/glossary';

import useFiltersCount from '@sorare/marketplace/src/search/FiltersManager/useFiltersCount';

import {
  SavedFiltersQuery,
  SavedFiltersQueryVariables,
  UpdateSavedFiltersMutation,
  UpdateSavedFiltersMutationVariables,
} from './__generated__/index.graphql';

type CardFilters = {
  query?: string;
  refinementList?: Record<string, string[]>;
  range?: Record<string, string>;
  toggle?: Record<string, boolean>;
  virtualToggle?: Record<string, string | boolean>;
};

const SAVED_FILTERS_QUERY = gql`
  query SavedFiltersQuery($sport: Sport!) {
    currentUser {
      slug
      cardFilters(sport: $sport)
    }
  }
`;
const UPDATE_SAVED_FILTERS_MUTATION = gql`
  mutation UpdateSavedFiltersMutation(
    $input: updateCardFiltersInput!
    $sport: Sport!
  ) {
    updateCardFilters(input: $input) {
      currentUser {
        slug
        cardFilters(sport: $sport)
      }
      errors {
        code
        message
      }
    }
  }
`;

const DropdownContent = styled.div`
  width: 240px;
  background-color: var(--c-neutral-200);
`;

const Row = styled.div`
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: stretch;

  &:hover {
    background-color: var(--c-neutral-300);
  }

  & > *:first-child {
    flex: 1;
    overflow: hidden;
  }
`;
const StyledButton = styled.button`
  text-align: left;
  padding: 0 var(--double-unit);
  color: var(--c-neutral-600);

  &.active {
    color: var(--c-brand-300);
  }
`;
const AddButton = styled(StyledButton)`
  width: 100%;
  height: 56px;
  display: inline-flex;
  align-items: center;
  gap: var(--unit);
  color: var(--c-neutral-1000);

  &:not(:disabled):hover {
    background-color: var(--c-neutral-300);
  }

  &:disabled {
    color: var(--c-neutral-400);
    cursor: initial;
  }
`;
const StyledText16 = styled(Text16)`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
const DeleteButton = styled(StyledButton)`
  width: 46px;
  color: var(--c-neutral-500);

  &:hover {
    color: var(--c-neutral-1000);
  }
`;
const DialogForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  margin-bottom: 0;
`;

const FilterRow = ({
  label,
  onClick,
  onDelete,
  active,
}: {
  label: string;
  onClick: () => void;
  onDelete: () => void;
  active: boolean;
}) => {
  const [hovering, setHovering] = useState(false);
  const { up: isLaptop } = useScreenSize('laptop');

  const showDeleteBtn = !isLaptop || hovering;
  return (
    <Row
      onMouseOver={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <StyledButton
        type="button"
        onClick={onClick}
        className={classNames({ active })}
      >
        <StyledText16 title={label} bold>
          {label}
        </StyledText16>
      </StyledButton>
      {showDeleteBtn && (
        <DeleteButton type="button" onClick={onDelete}>
          <FontAwesomeIcon icon={faTrash} />
        </DeleteButton>
      )}
    </Row>
  );
};

export const SavedFilters = () => {
  const { sport } = useSportContext();
  const { currentUser } = useCurrentUserContext();
  const track = useEvents();
  const { indexUiState, setIndexUiState } = useInstantSearch<ExtendedUIState>();
  const filtersCount = useFiltersCount();
  const { up: isLaptop } = useScreenSize('laptop');
  const setVirtualToggleFilters = useVirtualToggleManager();
  const [open, toggleOpen] = useToggle(false);
  const [name, setName] = useState<string>('');

  const currentUiState: CardFilters = useMemo(() => {
    const uiStateWithVirtualToggle: CardFilters = indexUiState;

    return {
      ...(uiStateWithVirtualToggle.query
        ? { query: uiStateWithVirtualToggle.query }
        : {}),
      toggle: uiStateWithVirtualToggle.toggle ?? {},
      refinementList: uiStateWithVirtualToggle.refinementList ?? {},
      range: uiStateWithVirtualToggle.range ?? {},
      virtualToggle: uiStateWithVirtualToggle.virtualToggle ?? {},
    };
  }, [indexUiState]);

  const { data } = useQuery<SavedFiltersQuery, SavedFiltersQueryVariables>(
    SAVED_FILTERS_QUERY,
    {
      variables: {
        sport: sport!,
      },
      skip: !sport || !currentUser,
    }
  );
  const [updateFilters] = useMutation<
    UpdateSavedFiltersMutation,
    UpdateSavedFiltersMutationVariables
  >(UPDATE_SAVED_FILTERS_MUTATION);

  const cardFilters = useMemo(
    () => data?.currentUser?.cardFilters || {},
    [data]
  );

  const activeFiltersKey = useMemo(() => {
    return Object.entries(cardFilters || {}).find(([, filters]) =>
      isEqual(currentUiState, filters)
    )?.[0];
  }, [currentUiState, cardFilters]);

  const toTrackingFilters = (filters: CardFilters): Record<string, string> => {
    const flattenFilters = {
      ...(filters.query ? { query: filters.query } : {}),
      ...Object.values({
        refinementList: filters.refinementList,
        range: filters.range,
        toggle: filters.toggle,
        virtualToggle: filters.virtualToggle,
      }).reduce<Record<string, string | string[] | boolean>>(
        (acc, value) => ({ ...acc, ...value }),
        {}
      ),
    };

    return Object.fromEntries(
      Object.entries(flattenFilters).map(([filterName, value]) => {
        const matchingVirtualToggle = Object.values(
          VIRTUAL_TOGGLE_FILTERS
        ).find(
          ({ name: virtualToggleName }) => virtualToggleName === filterName
        );

        return [
          matchingVirtualToggle?.trackingName || filterName,
          value.toString(),
        ];
      })
    );
  };

  const onSubmit = useCallback(
    (event: FormEvent) => {
      if (!sport) return;

      updateFilters({
        variables: {
          input: {
            sport,
            filters: {
              [name]: currentUiState,
            },
          },
          sport,
        },
      });

      track('Create Saved Search', {
        interactionContext: getInteractionContext(),
        sport,
        name,
        filters: toTrackingFilters(currentUiState),
      });

      toggleOpen();
      setName('');
      event.preventDefault();
    },
    [currentUiState, sport, name, toggleOpen, updateFilters, track]
  );

  const applyFilters = useCallback(
    filters => {
      setVirtualToggleFilters(
        {
          ...Object.fromEntries(
            Object.values(VIRTUAL_TOGGLE_FILTERS).map(filter => [
              filter.name,
              filter.defaultValue,
            ])
          ),
          ...filters.virtualToggle,
        },
        false
      );
      setIndexUiState(filters);

      track('Select Saved Search', {
        name,
        filters: toTrackingFilters(filters),
      });
    },
    [setIndexUiState, setVirtualToggleFilters, track, name]
  );

  const deleteFilters = useCallback(
    (key: string, filters: CardFilters) => {
      if (!sport) return;

      updateFilters({
        variables: {
          input: {
            sport,
            filters: {
              [key]: null,
            },
          },
          sport,
        },
      });

      track('Delete Saved Search', {
        name: key,
        filters: toTrackingFilters(filters),
      });
    },
    [sport, updateFilters, track]
  );

  if (!sport || !currentUser) return null;

  const DropdownContainer = !isLaptop ? Fragment : DropdownContent;

  return (
    <div>
      <Dropdown
        align="right"
        label={
          <IconButton
            disableDebounce
            color={activeFiltersKey ? 'blue' : 'white'}
            stroke={!!activeFiltersKey}
            icon={faBookmark}
            small
          />
        }
        gap={16}
      >
        {({ closeDropdown }) => (
          <DropdownContainer>
            <AddButton
              type="button"
              disabled={!!activeFiltersKey || !filtersCount}
              onClick={() => {
                closeDropdown();
                toggleOpen();
              }}
            >
              <FontAwesomeIcon icon={faPlusLarge} size="xs" />
              <StyledText16 bold>
                <FormattedMessage
                  id="Search.SavedFilters.addToSavedSearches"
                  defaultMessage="Add to Saved searches"
                />
              </StyledText16>
            </AddButton>
            {Object.entries(cardFilters).map(([key, filters]) => (
              <FilterRow
                key={key}
                label={key}
                onClick={() => {
                  closeDropdown();
                  applyFilters(filters);
                }}
                onDelete={() => deleteFilters(key, filters)}
                active={activeFiltersKey === key}
              />
            ))}
          </DropdownContainer>
        )}
      </Dropdown>
      <Dialog
        open={open}
        onClose={toggleOpen}
        title={
          <Text16>
            <FormattedMessage
              id="Search.SavedFilters.nameYourSavedSearch"
              defaultMessage="Name your Saved Search"
            />
          </Text16>
        }
      >
        <DialogForm onSubmit={onSubmit}>
          <SearchInput
            autoFocus
            value={name}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value);
            }}
            rounded
            small
          />
          <Button color="blue" small type="submit">
            <FormattedMessage {...glossary.save} />
          </Button>
        </DialogForm>
      </Dialog>
    </div>
  );
};

import { gql } from '@apollo/client';
import { faList } from '@fortawesome/pro-solid-svg-icons';
import { Badge } from '@material-ui/core';
import { useContext } from 'react';
import styled from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import Dropdown, {
  DropdownOptionLabel,
} from '@sorare/core/src/atoms/dropdowns/Dropdown';
import { first50DecksOnCurrentUserFragment } from '@sorare/core/src/hooks/decks/fragments';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import Context from '@football/components/so5/ComposeTeam/Context';

import {
  GetCustomDecksQuery,
  GetCustomDecksQueryVariables,
} from './__generated__/index.graphql';

const GET_CUSTOM_DECKS_QUERY = gql`
  query GetCustomDecksQuery {
    currentUser {
      slug
      ...first50DecksOnCurrentUserFragment
    }
  }
  ${first50DecksOnCurrentUserFragment}
`;

const StyledDropdownOptionLabel = styled(DropdownOptionLabel)`
  padding-right: var(--double-unit);
`;
const Label = styled.span`
  display: flex;
  justify-content: space-between;
  width: 100%;
  min-width: 100px;
  i {
    font-style: italic;
  }
`;

export const CustomListFilter = () => {
  const { data } = useQuery<GetCustomDecksQuery, GetCustomDecksQueryVariables>(
    GET_CUSTOM_DECKS_QUERY
  );
  const { customListFilter, setCustomListFilter } = useContext(Context)!;

  if (!data) return null;

  const selectOptions = data.currentUser?.customDecks.nodes.map(deck => ({
    value: deck.id,
    label: (
      <Label>
        {deck.name}
        <span>({deck.cardsCount})</span>
      </Label>
    ),
  }));

  return (
    <Dropdown
      label={
        <Badge
          overlap="circular"
          color="primary"
          variant="dot"
          invisible={!customListFilter}
        >
          <IconButton disableDebounce color="white" icon={faList} />
        </Badge>
      }
    >
      {({ closeDropdown }) =>
        selectOptions?.map(({ label, value }) => (
          <StyledDropdownOptionLabel key={value} onClick={closeDropdown}>
            {label}
            <input
              className="sr-only"
              type="checkbox"
              value={value}
              checked={customListFilter === value}
              onChange={({ target }) => {
                const { checked } = target;
                setCustomListFilter(checked ? value : undefined);
              }}
            />
          </StyledDropdownOptionLabel>
        ))
      }
    </Dropdown>
  );
};

export default CustomListFilter;

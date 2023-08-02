import { faCardsBlank, faPen, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { useCallback, useState } from 'react';
import { useInstantSearch } from 'react-instantsearch-hooks-web';
import { FormattedMessage } from 'react-intl';
import { generatePath, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@sorare/core/src/atoms/buttons/Button';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import CreateDeckDialog from '@sorare/core/src/components/deck/CreateDeckDialog';
import EditDeckDialog from '@sorare/core/src/components/deck/EditDeckDialog';
import { FilterSearchInput } from '@sorare/core/src/components/search/FilterSearchInput';
import { FilterSection } from '@sorare/core/src/components/search/FilterSection';
import FilterTitle from '@sorare/core/src/components/search/FilterTitle';
import { ExtendedUIState } from '@sorare/core/src/components/search/InstantSearch/types';
import Option from '@sorare/core/src/components/search/Option';
import { FOOTBALL_CUSTOM_DECK_EDIT } from '@sorare/core/src/constants/routes';
import { useSearchCardsContext } from '@sorare/core/src/contexts/searchCards';
import useCustomDecks from '@sorare/core/src/hooks/decks/useCustomDecks';
import useVirtualToggle from '@sorare/core/src/hooks/useVirtualToggle';
import { useVirtualToggleManager } from '@sorare/core/src/hooks/useVirtualToggleManager';
import {
  FilterWidget,
  VIRTUAL_TOGGLE_FILTERS,
} from '@sorare/core/src/lib/filters';
import { Link } from '@sorare/core/src/routing/Link';

export const DEFAULT_VALUE = 'global:all_star';

const FILTER = VIRTUAL_TOGGLE_FILTERS.customDecksFilter;

const StyledIconButton = styled(IconButton)`
  color: var(--c-neutral-500);
  &.darker {
    color: var(--c-neutral-400);
  }
  :hover,
  :focus,
  :active {
    color: var(--c-neutral-700);
  }
`;
const DecksContainer = styled.div`
  position: relative;
  max-height: calc(20 * var(--unit));
  overflow: hidden;
  &.expanded {
    max-height: none;
  }
`;
const ShowMore = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  color: var(--c-neutral-1000);
  background: linear-gradient(transparent 20%, var(--c-neutral-100));
`;
const Search = styled.div`
  display: grid;
  gap: var(--unit);
  grid-template-columns: 1fr min-content;
  width: 100%;
`;
const New = styled.button`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
  color: var(--c-neutral-500);
  font-weight: var(--t-bold);
  :hover,
  :focus,
  :active {
    color: var(--c-neutral-700);
  }
`;

const AfterOptionWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const AfterOption = ({
  name,
  onEdit,
}: {
  name: string;
  onEdit: () => void;
}) => {
  const location = useLocation();

  return (
    <AfterOptionWrapper>
      <StyledIconButton icon={faPen} onClick={onEdit} small />
      <StyledIconButton
        component={Link}
        icon={faCardsBlank}
        small
        to={
          generatePath(FOOTBALL_CUSTOM_DECK_EDIT, {
            name,
          }) + location.search || ''
        }
      />
    </AfterOptionWrapper>
  );
};
const CustomDecksFilter = () => {
  const { editableLists, galleryOwnerSlug } = useSearchCardsContext();
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [createDialogOpened, setCreateDialogOpened] = useState(false);
  const { decks, loading } = useCustomDecks(
    search,
    editableLists ? undefined : galleryOwnerSlug
  );
  const [editingDeck, setEditingDeck] = useState<
    (typeof decks)[number] | undefined
  >();
  const setVirtualToggle = useVirtualToggleManager();
  const { currentRefinement } = useVirtualToggle<string>({
    name: FILTER.name,
  });
  const onChange = useCallback(
    (deck: any) => {
      const isActive = currentRefinement === deck;
      const newValue = isActive ? undefined : deck;
      setVirtualToggle({
        [FILTER.name]: newValue,
      });
    },
    [currentRefinement, setVirtualToggle]
  );

  const displayShowMore = !expanded && decks.length > 5;

  return (
    <>
      <FilterSection
        search={
          <Search>
            <FilterSearchInput
              handleChange={e => {
                setSearch(e.target.value);
              }}
              value={search}
            />
            {editableLists && (
              <New type="button" onClick={() => setCreateDialogOpened(true)}>
                <FormattedMessage
                  id="CustomDecksFiler.add"
                  defaultMessage="{icon} new"
                  values={{
                    icon: <FontAwesomeIcon icon={faPlus} size="xs" />,
                  }}
                />
              </New>
            )}
          </Search>
        }
      >
        <DecksContainer className={classnames({ expanded: !displayShowMore })}>
          {loading && !decks.length && <LoadingIndicator small />}
          {decks.map(deck => {
            const { name, slug, cardsCount } = deck;
            return (
              <Option
                key={slug}
                label={name}
                active={currentRefinement === name}
                onClick={() => onChange(name)}
                variant="checkbox"
                count={cardsCount}
                after={
                  editableLists && (
                    <AfterOption
                      name={name}
                      onEdit={() => setEditingDeck(deck)}
                    />
                  )
                }
              />
            );
          })}
          {displayShowMore && (
            <ShowMore>
              <Button
                small
                fullWidth
                color="transparent"
                onClick={() => setExpanded(true)}
              >
                <FormattedMessage
                  id="CustomDecksFilter.showMore"
                  defaultMessage="Show more"
                />
              </Button>
            </ShowMore>
          )}
        </DecksContainer>
      </FilterSection>
      <CreateDeckDialog
        open={createDialogOpened}
        onClose={() => {
          setCreateDialogOpened(false);
        }}
        skipRedirection
      />
      <EditDeckDialog
        open={!!editingDeck}
        onClose={() => {
          setEditingDeck(undefined);
        }}
        deck={editingDeck}
      />
    </>
  );
};

const Title = () => {
  const { indexUiState } = useInstantSearch<ExtendedUIState>();
  const selected = !!indexUiState?.virtualToggle?.[FILTER.name];

  return <FilterTitle name={FILTER.title!} selected={selected} />;
};

const widget: FilterWidget = {
  key: FILTER.name,
  type: 'virtualToggle',
  filter: FILTER,
  component: <CustomDecksFilter />,
  title: <Title />,
  accordionOptions: { startsOpen: true },
};

export default widget;

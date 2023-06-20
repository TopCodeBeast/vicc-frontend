import { gql } from '@apollo/client';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEvent, useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import Checkbox from '@sorare/core/src/atoms/inputs/Checkbox';
import SearchInput from '@sorare/core/src/atoms/inputs/SearchInput';
import { Actions } from '@sorare/core/src/atoms/layout/Dialog';
import DialogWithNavigation from '@sorare/core/src/atoms/layout/DialogWithNavigation';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Caption } from '@sorare/core/src/atoms/typography';
import useCustomDecks from '@sorare/core/src/hooks/decks/useCustomDecks';
import { glossary } from '@sorare/core/src/lib/glossary';

import useAddCardsToDeck from 'hooks/decks/useAddCardsToDeck';
import useRemoveCardFromDeck from 'hooks/decks/useRemoveCardFromDeck';

import { AddCardToDeck_card } from './__generated__/index.graphql';

interface Props {
  card: AddCardToDeck_card;
  onClose: () => void;
  addList: () => void;
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const List = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

const DeckName = styled.div`
  margin-right: auto;
`;

export const AddCardToDeck = ({ card, onClose, addList }: Props) => {
  const [query, setQuery] = useState<string | undefined>(undefined);
  const { decks } = useCustomDecks(query);

  const addCard = useAddCardsToDeck();
  const removeCard = useRemoveCardFromDeck();
  const { formatMessage } = useIntl();

  const onCheckboxChange = useCallback(
    (deck: { slug: string }) => (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        addCard(deck.slug)([card.slug]);
      } else {
        removeCard(deck.slug)(card.slug);
      }
    },
    [addCard, removeCard, card.slug]
  );

  return (
    <DialogWithNavigation
      open
      onClose={onClose}
      title={
        <FormattedMessage
          id="AddCardToDeck.addToList"
          defaultMessage="Add to list"
        />
      }
    >
      <Content>
        <SearchInput
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={formatMessage(glossary.search)}
        />
        {decks ? (
          decks.map(deck => (
            <List key={deck.slug}>
              <DeckName>{deck.name}</DeckName>
              <Caption>{deck.cardsCount}</Caption>
              <Checkbox
                checked={card.customDecks.map(d => d.slug).includes(deck.slug)}
                onChange={onCheckboxChange(deck)}
              />
            </List>
          ))
        ) : (
          <LoadingIndicator />
        )}
        <Actions>
          <Button
            startIcon={<FontAwesomeIcon icon={faPlus} />}
            color="mediumGray"
            medium
            onClick={addList}
          >
            <FormattedMessage
              id="AddCardToDeck.newList"
              defaultMessage="New list"
            />
          </Button>
          <Button color="blue" medium onClick={onClose}>
            <FormattedMessage {...glossary.confirm} />
          </Button>
        </Actions>
      </Content>
    </DialogWithNavigation>
  );
};

AddCardToDeck.fragments = {
  card: gql`
    fragment AddCardToDeck_card on Card {
      slug
      assetId
      customDecks {
        slug
      }
    }
  `,
};

export default AddCardToDeck;

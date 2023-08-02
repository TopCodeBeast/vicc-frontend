import { TypedDocumentNode, gql } from '@apollo/client';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEvent, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import Checkbox from '@sorare/core/src/atoms/inputs/Checkbox';
import SearchInput from '@sorare/core/src/atoms/inputs/SearchInput';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Caption, Title6 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import useCustomDecks from '@sorare/core/src/hooks/decks/useCustomDecks';
import { glossary } from '@sorare/core/src/lib/glossary';

import useAddCardsToDeck from '@football/hooks/decks/useAddCardsToDeck';
import useRemoveCardFromDeck from '@football/hooks/decks/useRemoveCardFromDeck';

import { AddCardToDeck_card } from './__generated__/index.graphql';

interface Props {
  card: AddCardToDeck_card;
  onClose: () => void;
  addList: () => void;
}

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  padding: var(--triple-unit);
`;

const List = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;
const Title = styled(Title6)`
  text-align: center;
`;
const Footer = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--double-unit);
  padding: var(--triple-unit);
`;

const DeckName = styled.div`
  margin-right: auto;
`;

export const AddCardToDeck = ({ card, onClose, addList }: Props) => {
  const [query, setQuery] = useState<string | undefined>(undefined);
  const [confirming, setConfirming] = useState(false);
  const { decks: defaultDecks, loading } = useCustomDecks(query);
  const [decks, setDecks] = useState(defaultDecks);
  const defaultChecked = card.customDecks.map(d => d.slug);
  const [checked, setChecked] = useState<string[] | null>(null);
  const addCard = useAddCardsToDeck();
  const removeCard = useRemoveCardFromDeck();
  const { formatMessage } = useIntl();

  const updateDecksCount = (slug: string, amount: number) =>
    setDecks(d =>
      d.map(deck => {
        if (slug === deck.slug) {
          return { ...deck, cardsCount: deck.cardsCount + amount };
        }
        return deck;
      })
    );
  const onCheckboxChange =
    ({ slug }: { slug: string }) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        setChecked(c => (c ? [...c, slug] : [slug]));
        updateDecksCount(slug, 1);
      } else {
        setChecked(c => c?.filter(checkedSlug => checkedSlug !== slug) || []);
        updateDecksCount(slug, -1);
      }
    };
  const onConfirm = () => {
    setConfirming(true);
    const [cardToRemoveFrom, cardToAddTo] = decks.reduce<[string[], string[]]>(
      (prev, current) => {
        const deck = defaultDecks.find(({ slug }) => slug === current.slug);
        const toAdd = deck && current.cardsCount > deck.cardsCount;
        const toRemove = deck && current.cardsCount < deck.cardsCount;
        if (toAdd) {
          return [prev[0], [...prev[1], current.slug]];
        }
        if (toRemove) {
          return [[...prev[0], current.slug], prev[1]];
        }
        return prev;
      },
      [[], []]
    );
    Promise.all([
      ...cardToRemoveFrom.map(async slug => removeCard(slug)(card.slug)),
      ...cardToAddTo.map(async slug => addCard(slug)([card.slug])),
    ]).then(() => {
      setConfirming(false);
      onClose();
    });
  };

  if (!checked && defaultChecked?.length) {
    setChecked(defaultChecked);
  }
  if (defaultDecks.length !== decks.length) {
    setDecks(defaultDecks);
  }
  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open
      onClose={onClose}
      scroll="paper"
      title={
        <Title>
          <FormattedMessage
            id="AddCardToDeck.addToList"
            defaultMessage="Add to list"
          />
        </Title>
      }
      body={
        <Body>
          <SearchInput
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={formatMessage(glossary.search)}
          />
          {loading && !decks?.length ? (
            <LoadingIndicator small />
          ) : (
            decks?.map(deck => (
              <List key={deck.slug}>
                <DeckName>{deck.name}</DeckName>
                <Caption>{deck.cardsCount}</Caption>
                <Checkbox
                  checked={!!checked?.includes(deck.slug)}
                  onChange={onCheckboxChange(deck)}
                />
              </List>
            ))
          )}
        </Body>
      }
      footer={
        <Footer>
          <Button
            startIcon={<FontAwesomeIcon icon={faPlus} />}
            color="mediumGray"
            medium
            fullWidth
            onClick={addList}
          >
            <FormattedMessage
              id="AddCardToDeck.newList"
              defaultMessage="New list"
            />
          </Button>
          <LoadingButton
            color="blue"
            medium
            fullWidth
            onClick={onConfirm}
            loading={confirming}
          >
            <FormattedMessage {...glossary.confirm} />
          </LoadingButton>
        </Footer>
      }
    />
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
  ` as TypedDocumentNode<AddCardToDeck_card>,
};

export default AddCardToDeck;

import { gql, useMutation } from '@apollo/client';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import FlexFill from '@sorare/core/src/atoms/layout/FlexFill';
import ResponsiveRow from '@sorare/core/src/atoms/layout/ResponsiveRow';
import { Title4 } from '@sorare/core/src/atoms/typography';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { range } from '@sorare/core/src/lib/arrays';
import { theme } from '@sorare/core/src/style/theme';

import CardPicker from '@football/components/card/CardPicker';
import FlexCard from '@football/components/card/FlexCard';
import EditableDeckCard from '@football/components/deck/EditableDeckCard';
import Banner from '@football/components/user/Banner';
import useDragAndDrop from '@football/hooks/useDragAndDrop';

import {
  AddCardsToDeckMutation,
  AddCardsToDeckMutationVariables,
  EditCardInHighlightedDeckMutation,
  EditCardInHighlightedDeckMutationVariables,
  HighlightedCards_user,
  RemoveCardFromDeckMutation,
  RemoveCardFromDeckMutationVariables,
} from './__generated__/index.graphql';

type HighlightedCards_user_highlightedDeck_deckCards_nodes = NonNullable<
  HighlightedCards_user['highlightedDeck']
>['deckCards']['nodes'][number];

interface Props {
  user: HighlightedCards_user;
  readOnly: boolean;
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border-radius: ${theme.radius.sm}px;
  padding: var(--triple-unit);
`;

const fragments = {
  user: gql`
    fragment HighlightedCards_user on PublicUserInfoInterface {
      slug
      ...Banner_user
      highlightedDeck {
        slug
        deckCards(first: 5) {
          nodes {
            id
            cardIndex
            ...EditableDeckCard_deckCard
          }
        }
      }
    }
    ${EditableDeckCard.fragments.deckCard}
    ${Banner.fragments.user}
  `,
};

const REMOVE_CARD_FROM_DECK_MUTATION = gql`
  mutation RemoveCardFromDeckMutation($input: removeCardFromDeckInput!) {
    removeCardFromDeck(input: $input) {
      currentUser {
        slug
        ...HighlightedCards_user
      }
    }
  }
  ${fragments.user}
`;

const ADD_CARDS_TO_DECK_MUTATION = gql`
  mutation AddCardsToDeckMutation($input: addCardsToDeckInput!) {
    addCardsToDeck(input: $input) {
      currentUser {
        slug
        ...HighlightedCards_user
      }
    }
  }
  ${fragments.user}
`;

const EDIT_CARD_IN_HIGHLIGHTED_DECK_MUTATION = gql`
  mutation EditCardInHighlightedDeckMutation($input: editCardInDeckInput!) {
    editCardInDeck(input: $input) {
      currentUser {
        slug
        ...HighlightedCards_user
      }
    }
  }
  ${fragments.user}
`;

export const HighlightedCards = ({ user, readOnly }: Props) => {
  const deck = user.highlightedDeck;
  const { currentUser } = useCurrentUserContext();
  const [cardPickerOpened, setCardPickerOpened] = useState(false);
  const [removeCard] = useMutation<
    RemoveCardFromDeckMutation,
    RemoveCardFromDeckMutationVariables
  >(REMOVE_CARD_FROM_DECK_MUTATION);
  const [editCard] = useMutation<
    EditCardInHighlightedDeckMutation,
    EditCardInHighlightedDeckMutationVariables
  >(EDIT_CARD_IN_HIGHLIGHTED_DECK_MUTATION);
  const { dndContextProps, items, setItems, activeId } =
    useDragAndDrop<HighlightedCards_user_highlightedDeck_deckCards_nodes>(
      ({ activeObject, newIndex }) => {
        editCard!({
          variables: {
            input: {
              deckSlug: deck!.slug,
              cardSlug: activeObject.card.slug,
              newIndex,
            },
          },
        });
      }
    );

  const [addCards] = useMutation<
    AddCardsToDeckMutation,
    AddCardsToDeckMutationVariables
  >(ADD_CARDS_TO_DECK_MUTATION);

  const addCard = useCallback(
    (card: { objectID: string }) => {
      setCardPickerOpened(false);
      addCards({
        variables: {
          input: {
            deckSlug: deck?.slug || `${currentUser?.slug}-highlighted`,
            cardSlugs: [card.objectID],
          },
        },
      });
    },
    [addCards, deck, currentUser?.slug]
  );

  useEffect(
    () =>
      setItems(
        [...(deck?.deckCards.nodes || [])]
          .sort((dc1, dc2) => dc1.cardIndex! - dc2.cardIndex!)
          .filter(Boolean)
      ),
    [deck?.deckCards.nodes, setItems]
  );

  if (readOnly && !deck) return null;

  const deckCards = [...(deck?.deckCards.nodes || [])];

  return (
    <Root>
      {!readOnly && (
        <CardPicker
          open={cardPickerOpened}
          onPick={addCard}
          onClose={() => setCardPickerOpened(false)}
          excluding={deckCards.map(dc => dc.card.slug)}
          owner={currentUser!}
        />
      )}
      <Title4 color="var(--c-neutral-1000)">
        <FormattedMessage
          id="HighlightedCards.title"
          defaultMessage="Hall of fame"
        />
      </Title4>
      <Content>
        <Banner user={user} rounded="sm" />
        <DndContext {...dndContextProps}>
          <SortableContext items={items}>
            <ResponsiveRow>
              {items.map(dc => (
                <EditableDeckCard
                  readOnly={readOnly}
                  reorganizable={!readOnly}
                  deckCard={dc}
                  key={dc.id}
                  removeCard={() => {
                    removeCard({
                      variables: {
                        input: {
                          deckSlug: deck!.slug,
                          cardSlug: dc.card.slug,
                        },
                      },
                    });
                  }}
                  addCard={() => setCardPickerOpened(true)}
                />
              ))}
              {readOnly ? (
                <FlexFill count={5 - deckCards.length} />
              ) : (
                range(5 - deckCards.length).map((_, index) => (
                  <EditableDeckCard
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    addCard={() => setCardPickerOpened(true)}
                  />
                ))
              )}
            </ResponsiveRow>
            <DragOverlay>
              {activeId ? (
                <FlexCard card={activeId.card} draggableProps={{}} />
              ) : null}
            </DragOverlay>
          </SortableContext>
        </DndContext>
      </Content>
    </Root>
  );
};

HighlightedCards.fragments = fragments;

export default HighlightedCards;

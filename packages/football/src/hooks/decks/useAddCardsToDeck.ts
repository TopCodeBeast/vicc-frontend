import { gql, useMutation } from '@apollo/client';

import { deckFragment } from '@sorare/football/src/pages/CustomDeck/fragments';

import {
  AddCardsToCustomDeckMutation,
  AddCardsToCustomDeckMutationVariables,
} from './__generated__/useAddCardsToDeck.graphql';

const ADD_CARDS_TO_CUSTOM_DECK_MUTATION = gql`
  mutation AddCardsToCustomDeckMutation(
    $input: addCardsToDeckInput!
    $after: String
  ) {
    addCardsToDeck(input: $input) {
      deck {
        slug
        cardsCount
        ...CustomDeck_customDeck
      }
      cards {
        slug
        assetId
        customDecks {
          slug
        }
      }
    }
  }
  ${deckFragment}
`;

export default () => {
  const [addCards] = useMutation<
    AddCardsToCustomDeckMutation,
    AddCardsToCustomDeckMutationVariables
  >(ADD_CARDS_TO_CUSTOM_DECK_MUTATION);

  return (deckSlug: string) => async (cardSlugs: string[]) =>
    addCards({
      variables: {
        input: {
          deckSlug,
          cardSlugs,
        },
      },
    });
};

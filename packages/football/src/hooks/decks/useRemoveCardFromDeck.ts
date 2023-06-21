import { gql, useMutation } from '@apollo/client';

import { deckFragment } from '@football/pages/CustomDeck/fragments';

import {
  RemoveCardFromCustomDeckMutation,
  RemoveCardFromCustomDeckMutationVariables,
} from './__generated__/useRemoveCardFromDeck.graphql';

const REMOVE_CARD_FROM_CUSTOM_DECK_MUTATION = gql`
  mutation RemoveCardFromCustomDeckMutation(
    $input: removeCardFromDeckInput!
    $after: String
  ) {
    removeCardFromDeck(input: $input) {
      deck {
        slug
        cardsCount
        ...CustomDeck_customDeck
      }
      card {
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
  const [removeCard] = useMutation<
    RemoveCardFromCustomDeckMutation,
    RemoveCardFromCustomDeckMutationVariables
  >(REMOVE_CARD_FROM_CUSTOM_DECK_MUTATION);

  return (deckSlug: string) => async (cardSlug: string) =>
    removeCard({
      variables: {
        input: {
          deckSlug,
          cardSlug,
        },
      },
    });
};

import { gql, useMutation } from '@apollo/client';

import { deckFragment } from '@football/pages/CustomDeck/fragments';

import {
  EditCardInDeckMutation,
  EditCardInDeckMutationVariables,
} from './__generated__/useEditCard.graphql';

const EDIT_CARD_IN_DECK_MUTATION = gql`
  mutation EditCardInDeckMutation(
    $input: editCardInDeckInput!
    $after: String
  ) {
    editCardInDeck(input: $input) {
      deck {
        slug
        ...CustomDeck_customDeck
      }
    }
  }
  ${deckFragment}
`;

export default () => {
  const [editCard] = useMutation<
    EditCardInDeckMutation,
    EditCardInDeckMutationVariables
  >(EDIT_CARD_IN_DECK_MUTATION);

  return (deckSlug: string) => async (cardSlug: string, newIndex: number) =>
    editCard({
      variables: {
        input: {
          deckSlug,
          cardSlug,
          newIndex,
        },
      },
    });
};

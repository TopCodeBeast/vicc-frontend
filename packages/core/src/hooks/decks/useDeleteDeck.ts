import { TypedDocumentNode, gql } from '@apollo/client';

import useMutation from '@core/hooks/graphql/useMutation';

import {
  DeleteCustomDeckMutationV2,
  DeleteCustomDeckMutationV2Variables,
} from './__generated__/useDeleteDeck.graphql';
import { FIRST50_DECKS_ON_CURRENT_USER_FRAGMENT } from './fragments';

const DELETE_CUSTOM_DECK_MUTATION = gql`
  mutation DeleteCustomDeckMutationV2($input: deleteCustomDeckInput!) {
    deleteCustomDeck(input: $input) {
      currentUser {
        slug
        ...first50DecksOnCurrentUserFragment
      }
      errors {
        message
        code
      }
    }
  }
  ${FIRST50_DECKS_ON_CURRENT_USER_FRAGMENT}
` as TypedDocumentNode<
  DeleteCustomDeckMutationV2,
  DeleteCustomDeckMutationV2Variables
>;

export default () => {
  const [deleteDeck] = useMutation(DELETE_CUSTOM_DECK_MUTATION);

  return async (deck: { slug: string }) =>
    deleteDeck({
      variables: {
        input: {
          deckSlug: deck.slug,
        },
      },
      async onQueryUpdated(observableQuery) {
        return observableQuery.refetch();
      },
    });
};

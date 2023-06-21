import { gql } from '@apollo/client';

import useMutation from '@core/hooks/graphql/useMutation';

import {
  DeleteCustomDeckMutationV2,
  DeleteCustomDeckMutationV2Variables,
} from './__generated__/useDeleteDeck.graphql';
import { first50DecksOnCurrentUserFragment } from './fragments';

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
  ${first50DecksOnCurrentUserFragment}
`;

export default () => {
  const [deleteDeck] = useMutation<
    DeleteCustomDeckMutationV2,
    DeleteCustomDeckMutationV2Variables
  >(DELETE_CUSTOM_DECK_MUTATION);

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

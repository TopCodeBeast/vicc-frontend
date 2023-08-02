import { TypedDocumentNode, gql } from '@apollo/client';

import useMutation from '@core/hooks/graphql/useMutation';

import {
  EditCustomDeckMutationV2,
  EditCustomDeckMutationV2Variables,
} from './__generated__/useEditDeck.graphql';
import { FIRST50_DECKS_ON_CURRENT_USER_FRAGMENT } from './fragments';

const EDIT_CUSTOM_DECK_MUTATION = gql`
  mutation EditCustomDeckMutationV2($input: editCustomDeckInput!) {
    editCustomDeck(input: $input) {
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
  EditCustomDeckMutationV2,
  EditCustomDeckMutationV2Variables
>;

export default () => {
  const [editDeck] = useMutation(EDIT_CUSTOM_DECK_MUTATION, {
    showErrorsWithSnackNotification: true,
  });

  return async (
    deck: { slug: string },
    variables: { name: string; visible: boolean }
  ) => {
    return editDeck({
      variables: {
        input: {
          deckSlug: deck.slug,
          ...variables,
        },
      },
      async onQueryUpdated(observableQuery) {
        return observableQuery.refetch();
      },
    });
  };
};

import { gql } from '@apollo/client';

import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import {
  EditCustomDeckMutationV2,
  EditCustomDeckMutationV2Variables,
} from './__generated__/useEditDeck.graphql';
import { first50DecksOnCurrentUserFragment } from './fragments';

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
  ${first50DecksOnCurrentUserFragment}
`;

export default () => {
  const [editDeck] = useMutation<
    EditCustomDeckMutationV2,
    EditCustomDeckMutationV2Variables
  >(EDIT_CUSTOM_DECK_MUTATION, { showErrorsWithSnackNotification: true });

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

import { TypedDocumentNode, gql } from '@apollo/client';

import useMutation from '@core/hooks/graphql/useMutation';

import {
  CreateDeckMutationV2,
  CreateDeckMutationV2Variables,
} from './__generated__/useCreateDeck.graphql';
import { FIRST50_DECKS_ON_CURRENT_USER_FRAGMENT } from './fragments';

const CREATE_DECK_MUTATION = gql`
  mutation CreateDeckMutationV2($input: createCustomDeckInput!) {
    createCustomDeck(input: $input) {
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
` as TypedDocumentNode<CreateDeckMutationV2, CreateDeckMutationV2Variables>;

export default () => {
  const [createDeck] = useMutation(CREATE_DECK_MUTATION, {
    showErrorsWithSnackNotification: true,
  });
  return async (variables: { name: string; visible: boolean }) =>
    createDeck({
      variables: {
        input: variables,
      },
      async onQueryUpdated(observableQuery) {
        return observableQuery.refetch();
      },
    });
};

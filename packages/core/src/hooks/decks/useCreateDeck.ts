import { gql } from '@apollo/client';

import useMutation from '@sorare/core/src/hooks/graphql/useMutation';

import {
  CreateDeckMutationV2,
  CreateDeckMutationV2Variables,
} from './__generated__/useCreateDeck.graphql';
import { first50DecksOnCurrentUserFragment } from './fragments';

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
  ${first50DecksOnCurrentUserFragment}
`;

export default () => {
  const [createDeck] = useMutation<
    CreateDeckMutationV2,
    CreateDeckMutationV2Variables
  >(CREATE_DECK_MUTATION, { showErrorsWithSnackNotification: true });
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

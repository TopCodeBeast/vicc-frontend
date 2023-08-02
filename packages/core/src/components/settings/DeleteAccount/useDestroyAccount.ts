import { TypedDocumentNode, gql, useMutation } from '@apollo/client';

// eslint-disable-next-line import/named
import { destroyAccountInput } from '__generated__/globalTypes';

import {
  DestroyUserAccountMutation,
  DestroyUserAccountMutationVariables,
} from './__generated__/useDestroyAccount.graphql';

const DESTROY_USER_ACCOUNT_MUTATION = gql`
  mutation DestroyUserAccountMutation($input: destroyAccountInput!) {
    destroyAccount(input: $input) {
      currentUser {
        slug
      }

      errors {
        path
        message
        code
      }
    }
  }
` as TypedDocumentNode<
  DestroyUserAccountMutation,
  DestroyUserAccountMutationVariables
>;

export default () => {
  const [mutate] = useMutation(DESTROY_USER_ACCOUNT_MUTATION);

  return async (input: destroyAccountInput) => mutate({ variables: { input } });
};

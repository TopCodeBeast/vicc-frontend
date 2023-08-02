import { TypedDocumentNode, gql, useMutation } from '@apollo/client';

import {
  UnblockUserMutation,
  UnblockUserMutationVariables,
} from './__generated__/useUnblockUser.graphql';

const UNBLOCK_USER_MUTATION = gql`
  mutation UnblockUserMutation($input: unblockUserOffersInput!) {
    unblockUserOffers(input: $input) {
      currentUser {
        slug
      }
    }
  }
` as TypedDocumentNode<UnblockUserMutation, UnblockUserMutationVariables>;

const useUnblockUser = () => {
  const [mutate] = useMutation(UNBLOCK_USER_MUTATION);

  return {
    unblockUser: mutate,
  };
};

export default useUnblockUser;

import { gql, useMutation } from '@apollo/client';

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
`;

const useUnblockUser = () => {
  const [mutate] = useMutation<
    UnblockUserMutation,
    UnblockUserMutationVariables
  >(UNBLOCK_USER_MUTATION);

  return {
    unblockUser: mutate,
  };
};

export default useUnblockUser;

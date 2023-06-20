import { gql, useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { useSnackNotificationContext } from 'contexts/snackNotification';

import {
  BlockUserMutation,
  BlockUserMutationVariables,
} from './__generated__/useBlockUser.graphql';

export const BLOCK_USER_MUTATION = gql`
  mutation BlockUserMutation($input: blockUserOffersInput!) {
    blockUserOffers(input: $input) {
      currentUser {
        slug
      }
    }
  }
`;

export default () => {
  const [blockUser] = useMutation<
    BlockUserMutation,
    BlockUserMutationVariables
  >(BLOCK_USER_MUTATION);
  const { showNotification } = useSnackNotificationContext();

  return useCallback(
    async (user_slug: string) => {
      const { errors } = await blockUser({
        variables: {
          input: {
            userSlug: user_slug,
          },
        },
      });
      if (errors) {
        showNotification('errors', { errors });
        return errors;
      }
      return null;
    },
    [showNotification, blockUser]
  );
};

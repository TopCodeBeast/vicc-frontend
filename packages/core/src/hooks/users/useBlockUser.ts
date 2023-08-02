import { TypedDocumentNode, gql, useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { useSnackNotificationContext } from '@core/contexts/snackNotification';

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
` as TypedDocumentNode<BlockUserMutation, BlockUserMutationVariables>;

export default () => {
  const [blockUser] = useMutation(BLOCK_USER_MUTATION);
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

import { TypedDocumentNode, gql } from '@apollo/client';

import { useCurrentUserContext } from '@core/contexts/currentUser';

import { useActivityIndicator_user } from './__generated__/useActivityIndicator.graphql';

export const useActivityIndicator = (
  user: useActivityIndicator_user
): null | boolean => {
  const { currentUser } = useCurrentUserContext();

  if (!currentUser) {
    // no online indicator for non-authenticated users
    return null;
  }

  if (user.active === null) {
    // the user decided to hide their status, consider it offline
    return false;
  }

  return user.active;
};

useActivityIndicator.fragments = {
  user: gql`
    fragment useActivityIndicator_user on PublicUserInfoInterface {
      slug
      active
    }
  ` as TypedDocumentNode<useActivityIndicator_user>,
};

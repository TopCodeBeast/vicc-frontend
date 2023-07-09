import { gql } from '@apollo/client';

import { useCurrentUserContext } from '@core/contexts/currentUser';
import useFeatureFlags from '@core/hooks/useFeatureFlags';

import { useActivityIndicator_user } from './__generated__/useActivityIndicator.graphql';

export const useActivityIndicator = (
  user: useActivityIndicator_user
): null | boolean => {
  const { currentUser } = useCurrentUserContext();

  const {
    flags: { displayActiveUser = false },
  } = useFeatureFlags();

  if (!displayActiveUser) {
    return null;
  }

  if (!currentUser) {
    // no online indicator for non-authenticated users
    return null;
  }

  //TODO****
  // if (user.active === null) {
  //   // the user decided to hide their status, consider it offline
  //   return false;
  // }

  // return user.active;
  return true;
};

useActivityIndicator.fragments = {
  user: gql`
    fragment useActivityIndicator_user on PublicUserInfoInterface {
      slug
      # active
    }
  `,
};

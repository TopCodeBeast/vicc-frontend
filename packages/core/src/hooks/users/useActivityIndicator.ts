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

  if (user.active === null) {
    // the user decided to hide their status
    return null;
  }

  if (!currentUser) {
    // no online indicator for non-authenticated users
    return null;
  }
  // ensure currentUser is shown active regardless of lag/cache
  return user.slug === currentUser.slug || user.active;
};

useActivityIndicator.fragments = {
  user: gql`
    fragment useActivityIndicator_user on PublicUserInfoInterface {
      slug
      active
    }
  `,
};

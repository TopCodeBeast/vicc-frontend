import { gql } from '@apollo/client';

import { withFragments } from '@sorare/core/src/gql';

import { isFreeUser_user } from './__generated__/user.graphql';

export const isFreeUser = withFragments(
  (user: Nullable<isFreeUser_user>) => {
    return (
      (user?.cardCounts.limited || 0) +
        (user?.cardCounts.rare || 0) +
        (user?.cardCounts.superRare || 0) +
        (user?.cardCounts.unique || 0) ===
      0
    );
  },
  {
    user: gql`
      fragment isFreeUser_user on PublicUserInfoInterface {
        slug
        cardCounts {
          limited
          rare
          superRare
          unique
        }
      }
    `,
  }
);

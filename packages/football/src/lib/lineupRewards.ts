import { gql } from '@apollo/client';

import { withFragments } from '@sorare/core/src/lib/gql';

import { getRewardType_so5Fixture } from './__generated__/lineupRewards.graphql';
import { isFixtureClosed, isFixtureStarted } from './so5';

export enum RewardType {
  Eligible = 'eligible',
  Actual = 'actual',
  Generic = 'generic',
}

export const getRewardType = withFragments(
  (so5Fixture: getRewardType_so5Fixture | null | undefined) => {
    if (so5Fixture && isFixtureClosed(so5Fixture)) {
      return RewardType.Actual;
    }
    if (so5Fixture && isFixtureStarted(so5Fixture)) {
      return RewardType.Eligible;
    }

    return RewardType.Generic;
  },
  {
    so5Fixture: gql`
      fragment getRewardType_so5Fixture on Vicc5Fixture {
        slug
        aasmState
      }
    `,
  }
);

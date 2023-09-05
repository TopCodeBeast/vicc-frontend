import { TypedDocumentNode, gql } from '@apollo/client';

import { withFragments } from '@sorare/core/src/lib/gql';

import { getRewardType_vicc5Fixture } from './__generated__/lineupRewards.graphql';
import { isFixtureClosed, isFixtureStarted } from './so5';

export enum RewardType {
  Eligible = 'eligible',
  Actual = 'actual',
  Generic = 'generic',
}

export const getRewardType = withFragments(
  (vicc5Fixture: getRewardType_vicc5Fixture | null | undefined) => {
    if (vicc5Fixture && isFixtureClosed(vicc5Fixture)) {
      return RewardType.Actual;
    }
    if (vicc5Fixture && isFixtureStarted(vicc5Fixture)) {
      return RewardType.Eligible;
    }

    return RewardType.Generic;
  },
  {
    vicc5Fixture: gql`
      fragment getRewardType_vicc5Fixture on Vicc5Fixture {
        slug
        aasmState
      }
    ` as TypedDocumentNode<getRewardType_vicc5Fixture>,
  }
);

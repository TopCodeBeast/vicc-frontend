import { TypedDocumentNode, gql } from '@apollo/client';

import { withFragments } from '@sorare/core/src/gql';

import {
  getLineupDisplayName_vicc5Leaderboard,
  getLineupDisplayName_vicc5Lineup,
} from './__generated__/getLineupDisplayName.graphql';

const getLineupDisplayName = withFragments(
  (
    vicc5Lineup: Nullable<getLineupDisplayName_vicc5Lineup>,
    vicc5Leaderboard: Nullable<getLineupDisplayName_vicc5Leaderboard>
  ) => {
    return `${vicc5Leaderboard?.displayName}${
      vicc5Lineup?.name && (vicc5Leaderboard?.teamsCap || 0) > 1
        ? ` - ${vicc5Lineup.name}`
        : ''
    }`;
  },
  {
    vicc5Leaderboard: gql`
      fragment getLineupDisplayName_vicc5Leaderboard on Vicc5Leaderboard {
        slug
        displayName
        teamsCap
      }
    ` as TypedDocumentNode<getLineupDisplayName_vicc5Leaderboard>,
    vicc5Lineup: gql`
      fragment getLineupDisplayName_vicc5Lineup on Vicc5Lineup {
        id
        name
      }
    ` as TypedDocumentNode<getLineupDisplayName_vicc5Lineup>,
  }
);

export default getLineupDisplayName;

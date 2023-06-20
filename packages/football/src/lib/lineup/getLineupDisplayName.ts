import { gql } from '@apollo/client';

import { withFragments } from '@sorare/core/src/gql';

import {
  getLineupDisplayName_so5Leaderboard,
  getLineupDisplayName_so5Lineup,
} from './__generated__/getLineupDisplayName.graphql';

const getLineupDisplayName = withFragments(
  (
    so5Lineup: Nullable<getLineupDisplayName_so5Lineup>,
    so5Leaderboard: Nullable<getLineupDisplayName_so5Leaderboard>
  ) => {
    return `${so5Leaderboard?.displayName}${
      so5Lineup?.name && (so5Leaderboard?.teamsCap || 0) > 1
        ? ` - ${so5Lineup.name}`
        : ''
    }`;
  },
  {
    so5Leaderboard: gql`
      fragment getLineupDisplayName_so5Leaderboard on So5Leaderboard {
        slug
        displayName
        teamsCap
      }
    `,
    so5Lineup: gql`
      fragment getLineupDisplayName_so5Lineup on So5Lineup {
        id
        name
      }
    `,
  }
);

export default getLineupDisplayName;

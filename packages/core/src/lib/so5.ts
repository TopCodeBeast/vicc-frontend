import { gql } from '@apollo/client';

import { formatLineupDisplayName_so5Lineup } from './__generated__/so5.graphql';
import { withFragments } from './gql';

export const formatLineupDisplayName = withFragments(
  (so5Lineup: formatLineupDisplayName_so5Lineup) => {
    const { name, so5Leaderboard } = so5Lineup;

    const { displayName, trainingCenter } = so5Leaderboard || {};

    return [displayName, trainingCenter && name].filter(Boolean).join(' ');
  },
  {
    so5Lineup: gql`
      fragment formatLineupDisplayName_so5Lineup on So5Lineup {
        id
        name
        so5Leaderboard {
          slug
          displayName
          trainingCenter
        }
      }
    `,
  }
);

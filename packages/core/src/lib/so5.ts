import { TypedDocumentNode, gql } from '@apollo/client';

import { formatLineupDisplayName_vicc5Lineup } from './__generated__/so5.graphql';
import { withFragments } from './gql';

export const formatLineupDisplayName = withFragments(
  (vicc5Lineup: formatLineupDisplayName_vicc5Lineup) => {
    const { name, vicc5Leaderboard } = vicc5Lineup;

    const { displayName, trainingCenter } = vicc5Leaderboard || {};

    return [displayName, trainingCenter && name].filter(Boolean).join(' ');
  },
  {
    vicc5Lineup: gql`
      fragment formatLineupDisplayName_vicc5Lineup on Vicc5Lineup {
        id
        name
        vicc5Leaderboard {
          slug
          displayName
          trainingCenter
        }
      }
    ` as TypedDocumentNode<formatLineupDisplayName_vicc5Lineup>,
  }
);

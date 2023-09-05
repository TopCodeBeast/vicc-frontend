import { TypedDocumentNode, gql } from '@apollo/client';
import { ReactNode } from 'react';

import { Position } from '@sorare/core/src/__generated__/globalTypes';

import LastScores from '@football/components/stats/LastScores';

import { PlayerLastScores_player } from './__generated__/index.graphql';

type Props = {
  player: PlayerLastScores_player;
  setPosition?: (position: Position | undefined) => void;
  selectedPosition?: Position | undefined;
  InfiniteScrollLoader?: ReactNode;
};

const PlayerLastScores = ({
  player,
  setPosition,
  selectedPosition,
  InfiniteScrollLoader,
}: Props) => {
  const { cardPositions, lastFiveVicc5AverageScore, lastFifteenVicc5AverageScore } =
    player;

  if (!player.allVicc5Scores.nodes?.length) return null;

  return (
    <LastScores
      lastFifteenVicc5AverageScore={lastFifteenVicc5AverageScore}
      lastFiveVicc5AverageScore={lastFiveVicc5AverageScore}
      vicc5Scores={player.allVicc5Scores.nodes}
      cardPositions={cardPositions}
      player={player}
      setPosition={setPosition}
      selectedPosition={selectedPosition}
      InfiniteScrollLoader={InfiniteScrollLoader}
    />
  );
};

PlayerLastScores.fragments = {
  player: gql`
    fragment PlayerLastScores_player on Player {
      slug
      cardPositions
      activeClub {
        slug
      }
      lastFiveVicc5AverageScore: averageScore(
        type: LAST_FIVE_VICC5_AVERAGE_SCORE
        position: $position
      )
      lastFifteenVicc5AverageScore: averageScore(
        type: LAST_FIFTEEN_VICC5_AVERAGE_SCORE
        position: $position
      )
      allVicc5Scores(first: $first, after: $after, position: $position) {
        nodes {
          id
          ...LastScores_vicc5Score
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
      ...LastScores_player
    }
    ${LastScores.fragments.player}
    ${LastScores.fragments.vicc5Score}
  ` as TypedDocumentNode<PlayerLastScores_player>,
};

export default PlayerLastScores;

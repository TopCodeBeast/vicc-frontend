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
  const { cardPositions, lastFiveSo5AverageScore, lastFifteenSo5AverageScore } =
    player;

  if (!player.allSo5Scores.nodes?.length) return null;

  return (
    <LastScores
      lastFifteenSo5AverageScore={lastFifteenSo5AverageScore}
      lastFiveSo5AverageScore={lastFiveSo5AverageScore}
      so5Scores={player.allSo5Scores.nodes}
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
      lastFiveSo5AverageScore: averageScore(
        type: LAST_FIVE_SO5_AVERAGE_SCORE
        position: $position
      )
      lastFifteenSo5AverageScore: averageScore(
        type: LAST_FIFTEEN_SO5_AVERAGE_SCORE
        position: $position
      )
      allSo5Scores(first: $first, after: $after, position: $position) {
        nodes {
          id
          ...LastScores_so5Score
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
      ...LastScores_player
    }
    ${LastScores.fragments.player}
    ${LastScores.fragments.so5Score}
  ` as TypedDocumentNode<PlayerLastScores_player>,
};

export default PlayerLastScores;

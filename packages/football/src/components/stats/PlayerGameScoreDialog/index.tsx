import { gql } from '@apollo/client';

import idFromObject from '@sorare/core/src/gql/idFromObject';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import PlayerStatsDialog from '@sorare/football/src/components/stats/PlayerStatsDialog';

import {
  PlayerGameScoreDialogQuery,
  PlayerGameScoreDialogQueryVariables,
  PlayerGameScoreDialogQuery_player,
} from './__generated__/index.graphql';

const playerFragment = gql`
  fragment PlayerGameScoreDialogQuery_player on Player {
    slug
    ...PlayerStatsDialog_player
  }
  ${PlayerStatsDialog.fragments.player}
`;

export const PLAYER_GAME_SCORE_DIALOG_QUERY = gql`
  query PlayerGameScoreDialogQuery($id: ID!) {
    football {
      so5 {
        so5Score(id: $id) {
          id
          ...PlayerStatsDialog_so5Score
          player {
            slug
            ...PlayerGameScoreDialogQuery_player
          }
          playerGameStats {
            id
            game {
              id
              so5Fixture {
                slug
                gameWeek
              }
            }
            team {
              ... on TeamInterface {
                slug
                name
              }
            }
            player {
              slug
              ...PlayerStatsDialog_representativePlayer
            }
          }
        }
      }
    }
  }
  ${PlayerStatsDialog.fragments.so5Score}
  ${playerFragment}
  ${PlayerStatsDialog.fragments.representativePlayer}
`;

type Props = {
  open: boolean;
  onClose: () => void;
  so5ScoreId: string;
  player?: PlayerGameScoreDialogQuery_player;
};

export const PlayerGameScoreDialog = ({
  onClose,
  open,
  so5ScoreId,
  player: effectivePlayer,
}: Props) => {
  const { data, loading } = useQuery<
    PlayerGameScoreDialogQuery,
    PlayerGameScoreDialogQueryVariables
  >(PLAYER_GAME_SCORE_DIALOG_QUERY, {
    variables: { id: idFromObject(so5ScoreId)! },
    skip: !open,
  });

  if (data) {
    const { so5Score } = data.football.so5;
    const gameWeek = so5Score.playerGameStats.game.so5Fixture?.gameWeek;
    const {
      player,
      playerGameStats: { player: representativePlayer },
    } = so5Score;
    const teamName = so5Score.playerGameStats.team.name;

    return (
      <PlayerStatsDialog
        open={open}
        onClose={onClose}
        so5Score={so5Score}
        player={effectivePlayer || player}
        representativePlayer={representativePlayer}
        team={teamName}
        loading={loading}
        gameWeek={gameWeek}
      />
    );
  }
  return <PlayerStatsDialog open={open} onClose={onClose} loading />;
};

PlayerGameScoreDialog.fragments = {
  player: playerFragment,
};

export default PlayerGameScoreDialog;

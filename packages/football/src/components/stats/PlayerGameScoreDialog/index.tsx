import { TypedDocumentNode, gql } from '@apollo/client';

import idFromObject from '@sorare/core/src/gql/idFromObject';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import PlayerStatsDialog from '@football/components/stats/PlayerStatsDialog';

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
` as TypedDocumentNode<PlayerGameScoreDialogQuery_player>;

export const PLAYER_GAME_SCORE_DIALOG_QUERY = gql`
  query PlayerGameScoreDialogQuery($id: ID!) {
    football {
      vicc5 {
        vicc5Score(id: $id) {
          id
          ...PlayerStatsDialog_vicc5Score
          player {
            slug
            ...PlayerGameScoreDialogQuery_player
          }
          playerGameStats {
            id
            game {
              id
              vicc5Fixture {
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
  ${PlayerStatsDialog.fragments.vicc5Score}
  ${playerFragment}
  ${PlayerStatsDialog.fragments.representativePlayer}
` as TypedDocumentNode<
  PlayerGameScoreDialogQuery,
  PlayerGameScoreDialogQueryVariables
>;

type Props = {
  open: boolean;
  onClose: () => void;
  vicc5ScoreId: string;
  player?: PlayerGameScoreDialogQuery_player;
};

export const PlayerGameScoreDialog = ({
  onClose,
  open,
  vicc5ScoreId,
  player: effectivePlayer,
}: Props) => {
  const { data, loading } = useQuery(PLAYER_GAME_SCORE_DIALOG_QUERY, {
    variables: { id: idFromObject(vicc5ScoreId)! },
    skip: !open,
  });

  if (data) {
    const { vicc5Score } = data.football.vicc5;
    const gameWeek = vicc5Score.playerGameStats.game.vicc5Fixture?.gameWeek;
    const {
      player,
      playerGameStats: { player: representativePlayer },
    } = vicc5Score;
    const teamName = vicc5Score.playerGameStats.team.name;

    return (
      <PlayerStatsDialog
        open={open}
        onClose={onClose}
        vicc5Score={vicc5Score}
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

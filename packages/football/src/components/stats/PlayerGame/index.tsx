import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import { GameCoverageStatus } from '@sorare/core/src/__generated__/globalTypes';

import { Game } from '@football/components/stats/Game';
import GameCoverageBadge from '@football/components/stats/GameCoverageBadge';
import PlayerScore from '@football/components/stats/PlayerScore';
import { GameEventStatus, getPlayerScore } from '@football/lib/so5';

import {
  PlayerGame_game,
  PlayerGame_so5Score,
} from './__generated__/index.graphql';

type PlayerGameProps = {
  game: PlayerGame_game;
  so5Score: PlayerGame_so5Score | null;
};

const Score = styled.span`
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
`;
const Root = styled.div`
  width: 100%;
`;
const StyledGame = styled(Game)`
  width: 100%;
  display: flex;
`;

export const PlayerGame = (props: PlayerGameProps) => {
  const { so5Score, game } = props;
  const { coverageStatus, status } = game;
  const { score, status: scoreStatus } = getPlayerScore(so5Score);

  const showScore = [
    GameEventStatus.PLAYING,
    GameEventStatus.PLAYED,
    GameEventStatus.SUSPENDED,
  ].includes(status as GameEventStatus);

  const cardScore = (
    <Score>
      {coverageStatus !== GameCoverageStatus.NOT_COVERED ? (
        <PlayerScore score={score} status={scoreStatus} showReviewing />
      ) : (
        <GameCoverageBadge coverageStatus={GameCoverageStatus.NOT_COVERED} />
      )}
    </Score>
  );

  return (
    <Root>
      <StyledGame
        game={game}
        cardScore={showScore ? cardScore : undefined}
        withMatchView
      />
    </Root>
  );
};

PlayerGame.fragments = {
  game: gql`
    fragment PlayerGame_game on Game {
      id
      coverageStatus
      ...So5Game_game
      ...So5Game_gameWeek
      ...So5Game_competitionName
    }
    ${Game.fragments.game}
    ${Game.fragments.gameWeek}
    ${Game.fragments.competitionName}
  ` as TypedDocumentNode<PlayerGame_game>,
  so5Score: gql`
    fragment PlayerGame_so5Score on So5Score {
      id
      score
      scoringVersion
      ...getPlayerScore_so5Score
    }
    ${getPlayerScore.fragments.so5Score}
  ` as TypedDocumentNode<PlayerGame_so5Score>,
};

export default PlayerGame;

import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import { GameCoverageStatus } from '@sorare/core/src/__generated__/globalTypes';

import { Game } from '@football/components/stats/Game';
import GameCoverageBadge from '@football/components/stats/GameCoverageBadge';
import PlayerScore from '@football/components/stats/PlayerScore';
import { GameEventStatus, getPlayerScore } from '@football/lib/so5';

import {
  PlayerGame_game,
  PlayerGame_vicc5Score,
} from './__generated__/index.graphql';

type PlayerGameProps = {
  game: PlayerGame_game;
  vicc5Score: PlayerGame_vicc5Score | null;
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
  const { vicc5Score, game } = props;
  const { coverageStatus, status } = game;
  const { score, status: scoreStatus } = getPlayerScore(vicc5Score);

  const showScore = [
    GameEventStatus.PLAYING,
    GameEventStatus.PLAYED,
    GameEventStatus.SUSPENDED,
  ].includes(status as any as GameEventStatus);

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
      ...Vicc5Game_game
      ...Vicc5Game_gameWeek
      ...Vicc5Game_competitionName
    }
    ${Game.fragments.game}
    ${Game.fragments.gameWeek}
    ${Game.fragments.competitionName}
  ` as TypedDocumentNode<PlayerGame_game>,
  vicc5Score: gql`
    fragment PlayerGame_vicc5Score on Vicc5Score {
      id
      score
      scoringVersion
      ...getPlayerScore_vicc5Score
    }
    ${getPlayerScore.fragments.vicc5Score}
  ` as TypedDocumentNode<PlayerGame_vicc5Score>,
};

export default PlayerGame;

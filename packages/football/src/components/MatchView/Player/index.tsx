import { gql } from '@apollo/client';
import {
  faArrowDown,
  faRectangleVertical,
  faSoccerBall,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import { range } from '@sorare/core/src/lib/arrays';

import playerPlaceholder from '@football/assets/players/placeholder.png';
import WhistleIcon from '@football/assets/stats/WhistleIcon';
import glove from '@football/assets/stats/glove.svg';
import shoe from '@football/assets/stats/shoe.svg';
import PlayerScore from '@football/components/stats/PlayerScore';
import { statLabels } from '@football/lib/scoring';

import { Player_player } from './__generated__/index.graphql';

const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const PlayerImage = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 100%;
  border: 3px solid var(--c-static-neutral-300);
  background-position: center center;
  background-size: contain;
  background-color: var(--c-static-neutral-100);
  background-repeat: no-repeat;
`;
const PlayerScoreWrapper = styled.div`
  z-index: 1;
  margin: calc(-1 * var(--unit)) auto var(--half-unit) auto;
`;
const PlayerName = styled.div`
  background: rgba(var(--c-static-rgb-neutral-1000), 0.3);
  border-radius: var(--half-unit);
  color: var(--c-static-neutral-100);
  padding: 0 var(--half-unit);
  text-align: center;
  font-size: 12px;
`;
const BaseIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ArrowWrapper = styled(BaseIconWrapper)`
  font-size: 10px;
  width: 14px;
  height: 14px;
  border-radius: 100%;
  background-color: var(--c-static-neutral-100);
`;

const SubWrapper = styled.div`
  position: absolute;
  display: flex;
  gap: var(--half-unit);
  font-weight: var(--t-bold);
  left: 80%;
  top: -5px;
  font-size: 10px;
  color: var(--c-static-neutral-100);
`;

const DecisiveAction = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: flex-start;
`;

const NegativeDecisiveActions = styled(DecisiveAction)`
  top: 10%;
  right: calc(100% - var(--unit));
`;

const PositiveDecisiveActions = styled(DecisiveAction)`
  left: calc(100% - var(--half-unit));
`;

const IconWrapper = styled(BaseIconWrapper)`
  padding: 2px;
  height: var(--double-unit);
  width: var(--double-unit);
  border-radius: var(--double-unit);
  background-color: var(--c-static-neutral-100);

  &:not(:first-child) {
    margin-left: -6px;
  }
`;

const MinPlayedWrapper = styled.div`
  opacity: 0.6;
`;

const CardWrapper = styled(BaseIconWrapper)`
  position: absolute;
  right: calc(100% - var(--half-unit));
  top: calc(50% - var(--unit));
  background-color: var(--c-static-neutral-100);
  border: 2px solid var(--c-static-neutral-100);
  border-radius: 2px;
  transform: rotateZ(4deg);

  > *:not(:last-child) {
    margin-right: -4px;
  }
`;
const GoalText = styled.span`
  color: var(--c-red-600);
  font-size: 8px;
  letter-spacing: 0;
  font-weight: var(--t-bold);
  line-height: 12px;
  margin-right: 2px;
`;

type Props = {
  player: Player_player;
  gameDuration: number;
};
const Player = ({ player, gameDuration }: Props) => {
  const { formatMessage } = useIntl();
  if (!player?.so5Score) {
    return null;
  }

  const { playerGameStats, score } = player.so5Score;
  // The gameDuration var is containing the game duration INCLUDING extra time (we don't want it)
  let roundedGameDuration = gameDuration;
  if (roundedGameDuration > 120) {
    roundedGameDuration = 120;
  } else if (roundedGameDuration > 90) {
    roundedGameDuration = 90;
  }

  const playerMinutesPlayed = playerGameStats.minsPlayed || 0;
  const playerGoals = playerGameStats.goals || 0;
  const playerAssists = playerGameStats.goalAssist || 0;
  const ownGoals = playerGameStats.ownGoals || 0;
  const playerYellowCards = playerGameStats.yellowCard || 0;
  const playerRedCards = playerGameStats.redCard || 0;

  const penaltiesConceded = player.so5Score.negativeDecisiveStats.find(
    statItem => statItem.stat === 'penalty_conceded'
  );

  const penaltiesWon = player.so5Score.positiveDecisiveStats.find(
    statItem => statItem.stat === 'assist_penalty_won'
  );

  const penaltiesSaved = player.so5Score.positiveDecisiveStats.find(
    statItem => statItem.stat === 'penalty_save'
  );

  return (
    <Root>
      <PlayerImage
        style={{
          backgroundImage: `url(${player.pictureUrl || playerPlaceholder})`,
        }}
      >
        {playerMinutesPlayed < roundedGameDuration && (
          <SubWrapper>
            <ArrowWrapper>
              <FontAwesomeIcon
                icon={faArrowDown}
                style={{ color: 'var(--c-red-600)' }}
                size="xs"
              />
            </ArrowWrapper>
            <MinPlayedWrapper>
              {playerGameStats.minsPlayed}&apos;
            </MinPlayedWrapper>
          </SubWrapper>
        )}
        {(playerRedCards > 0 || playerYellowCards > 0) && (
          <CardWrapper>
            {playerYellowCards > 0 && (
              <FontAwesomeIcon
                icon={faRectangleVertical}
                style={{ color: 'var(--c-yellow-600)' }}
                size="xs"
              />
            )}
            {playerRedCards > 0 && (
              <FontAwesomeIcon
                icon={faRectangleVertical}
                style={{ color: 'var(--c-red-600)' }}
                size="xs"
              />
            )}
          </CardWrapper>
        )}
        <NegativeDecisiveActions>
          {penaltiesConceded && (
            <IconWrapper>
              {penaltiesConceded &&
                range(penaltiesConceded.statValue).map(i => (
                  <WhistleIcon
                    color="var(--c-red-600)"
                    title={formatMessage(statLabels.penalty_conceded)}
                    key={i}
                  />
                ))}
            </IconWrapper>
          )}
          {ownGoals > 0 &&
            range(ownGoals).map(i => (
              <IconWrapper key={i}>
                <GoalText>
                  <FormattedMessage
                    id="Player.stats.OwnGoalShort"
                    defaultMessage="OG"
                  />
                </GoalText>
              </IconWrapper>
            ))}
        </NegativeDecisiveActions>
        <PositiveDecisiveActions>
          {penaltiesSaved &&
            range(penaltiesSaved.statValue).map(i => (
              <IconWrapper key={i}>
                <img
                  src={glove}
                  title={formatMessage(statLabels.penalty_save)}
                  alt={formatMessage(statLabels.penalty_save)}
                />
              </IconWrapper>
            ))}
          {penaltiesWon &&
            range(penaltiesWon.statValue).map(i => (
              <IconWrapper key={i}>
                <WhistleIcon
                  color="var(--c-static-neutral-1000)"
                  title={formatMessage(statLabels.assist_penalty_won)}
                  key={i}
                />
              </IconWrapper>
            ))}

          {range(playerAssists).map(i => (
            <IconWrapper key={i}>
              <img
                key={i}
                src={shoe}
                alt={formatMessage(statLabels.goal_assist)}
              />
            </IconWrapper>
          ))}
          {range(playerGoals).map(i => (
            <IconWrapper key={i}>
              <FontAwesomeIcon
                title={formatMessage(statLabels.goals)}
                icon={faSoccerBall}
                size="xs"
              />
            </IconWrapper>
          ))}
        </PositiveDecisiveActions>
      </PlayerImage>
      <PlayerScoreWrapper>
        <PlayerScore score={score} size="smaller" />
      </PlayerScoreWrapper>
      <PlayerName>
        <strong>{player.lastName || player.firstName}</strong>
      </PlayerName>
    </Root>
  );
};

Player.fragments = {
  player: gql`
    fragment Player_player on Player {
      slug
      firstName
      lastName
      pictureUrl(derivative: "avatar")
      so5Score(gameId: $id) {
        id
        score
        negativeDecisiveStats {
          stat
          statValue
        }
        positiveDecisiveStats {
          stat
          statValue
        }
        playerGameStats {
          id
          goals
          ownGoals
          goalAssist
          yellowCard
          redCard
          minsPlayed
        }
      }
    }
  `,
};

export default Player;

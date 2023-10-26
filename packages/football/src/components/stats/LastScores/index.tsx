import { TypedDocumentNode, gql } from '@apollo/client';
import {
  IconDefinition,
  faCalendar,
  faCalendarXmark,
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { GameStatus, Position } from '@sorare/core/src/__generated__/globalTypes';
import Select from '@sorare/core/src/atoms/inputs/Select';
import { Text16, Text20, Title6 } from '@sorare/core/src/atoms/typography';
import { Tab, TabBar } from '@sorare/core/src/components/TabBar';
import { FixtureChart } from '@sorare/core/src/components/player/FixtureChart';
import { groupBy } from '@sorare/core/src/lib/arrays';
import {
  cardAttributes,
  playerGameStatusLabels,
} from '@sorare/core/src/lib/glossary';
import { positionNames } from '@sorare/core/src/lib/players';

import TeamAvatar from '@football/components/club/TeamAvatar';
import PlayerUnavailabilityBadge from '@football/components/player/PlayerUnavailabilityBadge';
import Status from '@football/components/so5/ComposeTeam/responsive/PlayerDetails/Status';
import PlayerGameScoreDialog from '@football/components/stats/PlayerGameScoreDialog';
import { THRESHOLD_COLORS, findThreshold } from '@football/components/stats/PlayerScore';
import useGetSuspensionsAndInjuries from '@football/hooks/useGetSuspensionsAndInjuries';
import { GameEventStatus, gameStatusMessages } from '@football/lib/so5';

import {
  LastScores_player,
  LastScores_vicc5Score,
} from './__generated__/index.graphql';

type Props = {
  lastFiveVicc5AverageScore: number | null;
  lastFifteenVicc5AverageScore: number | null;
  vicc5Scores: (LastScores_vicc5Score | null)[];
  player: LastScores_player;
  cardPositions?: Position[];
  setPosition?: (position?: Position) => void;
  selectedPosition?: Position;
  InfiniteScrollLoader?: ReactNode;
};

enum TabValue {
  all = 'all',
  home = 'home',
  away = 'away',
}

enum ScoreTabValue {
  l5 = 'L5',
  l15 = 'L15',
}

const tabLabels = defineMessages({
  home: {
    id: 'Score.home',
    defaultMessage: 'Home',
  },
  away: {
    id: 'Score.away',
    defaultMessage: 'Away',
  },
  all: {
    id: 'Score.all',
    defaultMessage: 'All',
  },
});

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--quadruple-unit);
  overflow: auto;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  overflow: auto;
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--unit);
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Games = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: var(--unit);
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: var(--triple-unit);
  flex-direction: row-reverse;
`;

const StyledTabBar = styled(TabBar)`
  align-self: flex-start;
  margin-bottom: var(--half-unit);
`;

const GamesContainer = styled.div`
  position: relative;
  mask-image: linear-gradient(to right, transparent 0%, black 10%);
`;

const isHomeGame = (
  gameStats: LastScores_vicc5Score['playerGameStats']
): boolean => {
  return gameStats.team.slug === gameStats.game.homeTeam?.slug;
};

const gameOpponent = (
  gameStats: LastScores_vicc5Score['playerGameStats']
):
  | LastScores_vicc5Score['playerGameStats']['game']['homeTeam']
  | LastScores_vicc5Score['playerGameStats']['game']['awayTeam']
  | null => {
  return isHomeGame(gameStats)
    ? gameStats.game.awayTeam
    : gameStats.game.homeTeam;
};

const Avatar = styled(TeamAvatar)`
  margin: auto;
  height: 20px;
  max-width: 20px;
  --size: 20px;
`;

const Label = styled.div`
  color: var(--c-neutral-400);
  font-weight: var(--t-bold);
  text-align: center;
  line-height: 12px;
  font-size: 10px;
  display: flex;
  gap: var(--half-unit);
  flex-direction: column;
`;

const StatusRow = styled.div`
  display: flex;
  gap: var(--double-unit);
  > div {
    --background-color: var(--c-neutral-300);
    flex: 1;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--unit);
`;

const StatusIcon: {
  [key in GameEventStatus]?: IconDefinition;
} = {
  [GameEventStatus.POSTPONED]: faCalendar,
  [GameEventStatus.CANCELLED]: faCalendarXmark,
};

const PerformancesSummary = ({
  player,
  lastFiveVicc5AverageScore,
  lastFifteenVicc5AverageScore,
}: {
  lastFiveVicc5AverageScore: number | null;
  lastFifteenVicc5AverageScore: number | null;
  player: LastScores_player;
}) => {
  const { formatNumber } = useIntl();

  const [tab, setTab] = useState<ScoreTabValue>(ScoreTabValue.l5);

  const summaryData = {
    [ScoreTabValue.l5]: {
      score: lastFiveVicc5AverageScore,
      appearanceRate: (player.lastFiveVicc5Appearances || 0) / 5,
    },
    [ScoreTabValue.l15]: {
      score: lastFifteenVicc5AverageScore,
      appearanceRate: (player.lastFifteenVicc5Appearances || 0) / 15,
    },
  };

  return (
    <>
      <StyledTabBar value={tab} compact>
        {Object.values(ScoreTabValue).map(value => (
          <Tab key={value} value={value} onClick={() => setTab(value)}>
            {value}
          </Tab>
        ))}
      </StyledTabBar>
      <StatusRow>
        <Status
          title={
            <Text16 bold color="var(--c-neutral-500)">
              <FormattedMessage {...cardAttributes.averageScore} />
            </Text16>
          }
          value={
            <Text20
              bold
              color={
                THRESHOLD_COLORS[findThreshold(summaryData[tab].score || 0)]
              }
            >
              {summaryData[tab].score}
            </Text20>
          }
        />
        <Status
          title={
            <Text16 bold color="var(--c-neutral-500)">
              <FormattedMessage
                id="Stat.gamesPlayed"
                defaultMessage="Games played"
              />
            </Text16>
          }
          value={
            <Text20 bold color="var(--c-neutral-1000)">
              {formatNumber(summaryData[tab].appearanceRate, {
                style: 'percent',
                maximumFractionDigits: 0,
              })}
            </Text20>
          }
        />
      </StatusRow>
    </>
  );
};

const LastScores = ({
  lastFifteenVicc5AverageScore,
  lastFiveVicc5AverageScore,
  cardPositions = [],
  setPosition,
  selectedPosition,
  vicc5Scores,
  player,
  InfiniteScrollLoader,
}: Props) => {
  const { formatMessage, formatDate } = useIntl();
  const [vicc5Score, setVicc5Score] = useState<LastScores_vicc5Score | undefined>();

  const [homeAwayTab, setHomeAwayTab] = useState<TabValue>(TabValue.all);

  const getSuspensionsAndInjuries = useGetSuspensionsAndInjuries(player);

  if (!vicc5Scores?.length) return null;

  const sortedScores = vicc5Scores.filter(Boolean).sort((a, b) => {
    const dateA = new Date(a.game.date);
    const dateB = new Date(b.game.date);
    return dateA > dateB ? 1 : -1;
  });

  const gamesByMonth = groupBy(t => {
    const date = new Date(t.game.date);
    return new Date(date.getFullYear(), date.getMonth(), 1).toString();
  }, sortedScores);

  const normalized = Object.keys(gamesByMonth).map(key => ({
    key,
    label: formatDate(key, { month: 'short', year: '2-digit' }),
    games: gamesByMonth[key].map(score => {
      const gamePlayed =
        score.playerGameStats.game.status !== GameStatus.POSTPONED &&
        score.playerGameStats.game.status !== GameStatus.CANCELLED;
      const isDNP = !score.playerGameStats.minsPlayed;
      const playerScore =
        !isDNP && gamePlayed && typeof score.score === 'number'
          ? score.score
          : undefined;
      return {
        id: score.game.id,
        playerScore,
        startDate: score.game.date,
        gameLabel: (
          <Label>
            <Avatar team={gameOpponent(score.playerGameStats)} />
            <div>{score.playerGameStats.game.vicc5Fixture?.shortDisplayName}</div>
          </Label>
        ),
        color:
          homeAwayTab === TabValue.all ||
          (homeAwayTab === TabValue.away &&
            !isHomeGame(score.playerGameStats)) ||
          (homeAwayTab === TabValue.home && isHomeGame(score.playerGameStats))
            ? THRESHOLD_COLORS[findThreshold(score.score || 0)]
            : 'var(--c-neutral-500)',
        onClick: () => {
          setVicc5Score(score);
        },
        dnpLabel: !gamePlayed ? (
          <FontAwesomeIcon
            icon={
              StatusIcon[score.playerGameStats.game.status as any as GameEventStatus]!
            }
            title={formatMessage(
              gameStatusMessages[score.playerGameStats.game.status]
            )}
            size="lg"
          />
        ) : (
          <>
            {/* <PlayerUnavailabilityBadge
              {...getSuspensionsAndInjuries<LastScores_player>(score.game)}
            /> */}
            <FormattedMessage {...playerGameStatusLabels.did_not_play_short} />
          </>
        ),
      };
    }),
  }));

  return (
    <Root>
      <Section>
        <Row>
          <Title6>
            <FormattedMessage id="LastScores.stats" defaultMessage="Stats" />
          </Title6>
          {cardPositions.length > 1 && setPosition && (
            <Title>
              <Select
                menuLateralAlignment="right"
                value={
                  selectedPosition && {
                    value: selectedPosition,
                    label: formatMessage(positionNames[selectedPosition]),
                  }
                }
                onChange={e => {
                  setPosition(e!.value as Position);
                }}
                options={cardPositions.map(value => ({
                  value,
                  label: formatMessage(positionNames[value]),
                }))}
              />
            </Title>
          )}
        </Row>

        <PerformancesSummary
          player={player}
          lastFiveVicc5AverageScore={lastFiveVicc5AverageScore}
          lastFifteenVicc5AverageScore={lastFifteenVicc5AverageScore}
        />
      </Section>
      <Section>
        <Title6 as="h2">
          <FormattedMessage
            id="LastScores.performance"
            defaultMessage="Performance"
          />
        </Title6>
        <StyledTabBar value={homeAwayTab} compact>
          {Object.values(TabValue).map(val => (
            <Tab key={val} value={val} onClick={() => setHomeAwayTab(val)}>
              <FormattedMessage {...tabLabels[val]} />
            </Tab>
          ))}
        </StyledTabBar>
        <GamesContainer>
          <Games>
            <FixtureChart
              InfiniteScrollLoader={InfiniteScrollLoader}
              fixturesStats={normalized}
              yMaxValue={100}
            />
          </Games>
        </GamesContainer>
        {vicc5Score && (
          <PlayerGameScoreDialog
            vicc5ScoreId={vicc5Score.id}
            onClose={() => setVicc5Score(undefined)}
            open={!!vicc5Score}
          />
        )}
      </Section>
    </Root>
  );
};

LastScores.fragments = {
  vicc5Score: gql`
    fragment LastScores_vicc5Score on Vicc5Score {
      id
      score
      playerGameStats {
        id
        minsPlayed
        team {
          ... on TeamInterface {
            slug
          }
        }
        game {
          id
          status
          vicc5Fixture {
            slug
            gameWeek
            shortDisplayName
          }
          homeTeam {
            ... on TeamInterface {
              slug
              ...TeamAvatar_team
            }
          }
          awayTeam {
            ... on TeamInterface {
              slug
              ...TeamAvatar_team
            }
          }
        }
      }
      ...useGetSuspensionsAndInjuries_vicc5Score
    }
    ${TeamAvatar.fragments.team}
    ${useGetSuspensionsAndInjuries.fragments.vicc5Score}
  ` as TypedDocumentNode<LastScores_vicc5Score>,
  player: gql`
    fragment LastScores_player on Player {
      id
      slug
      lastFiveVicc5Appearances
      lastFifteenVicc5Appearances
      #injuries {
      #  id
      #  ...PlayerUnavailabilityBadge_injury
      #}
      #suspensions {
      #  id
      #  ...PlayerUnavailabilityBadge_suspension
      #}
      ...useGetSuspensionsAndInjuries_player
    }
    ${useGetSuspensionsAndInjuries.fragments.player}
    #{PlayerUnavailabilityBadge.fragments.injury}
    #{PlayerUnavailabilityBadge.fragments.suspension}
  ` as TypedDocumentNode<LastScores_player>,
};

export default LastScores;

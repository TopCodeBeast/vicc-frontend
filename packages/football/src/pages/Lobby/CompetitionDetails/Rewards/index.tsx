import { TypedDocumentNode, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import useLocalStorage, {
  STORAGE,
} from '@sorare/core/src/hooks/useLocalStorage';
import { breakpoints } from '@sorare/core/src/style/mediaQuery';

import LeaderboardModeSelect, {
  LeaderboardModes,
} from '@football/pages/Lobby/CompetitionDetails/Leaderboards/LeaderboardModeSelect';

import RankBasedRewards from './RankBasedRewards';
import ScoreBasedRewards from './ScoreBasedRewards';
import {
  CompetitionDetailsRewardsTabQuery,
  CompetitionDetailsRewardsTabQueryVariables,
} from './__generated__/index.graphql';

type CompetitionDetailsRewardsTabQuery_so5Leaderboard_rewardsConfig_ranking =
  NonNullable<
    CompetitionDetailsRewardsTabQuery['football']['so5']['so5Leaderboard']['rewardsConfig']['ranking']
  >[number];

export interface RangeReward
  extends CompetitionDetailsRewardsTabQuery_so5Leaderboard_rewardsConfig_ranking {
  startRank?: number | null;
  startPct?: number | null;
  endRank?: number | null;
  endPct?: number | null;
}

export const COMPETITION_DETAILS_REWARDS_TAB_QUERY = gql`
  query CompetitionDetailsRewardsTabQuery($slug: String!) {
    football {
      so5 {
        so5Leaderboard(slug: $slug) {
          slug
          so5League {
            slug
            ...RankBasedRewards_so5League
          }
          mySo5Lineups {
            id
            so5Rankings {
              id
              score
              ranking
              eligibleRewards {
                ranks
                rankPct
                score
              }
            }
          }
          rewardsConfig {
            ranking {
              ...RankBasedRewards_so5RewardConfig
            }
            conditional {
              ...ScoreBasedRewards_so5RewardConfig
            }
          }
          universalSo5UserGroups {
            slug
            myMembership {
              id
              score
              eligibleRewards {
                ranks
                rankPct
                score
              }
            }
            rewardsConfig {
              ranking {
                ...RankBasedRewards_so5RewardConfig
              }
              conditional {
                ...ScoreBasedRewards_so5RewardConfig
              }
            }
          }
          ...ScoreBasedRewards_so5Leaderboard
        }
      }
    }
  }
  ${RankBasedRewards.fragments.so5League}
  ${RankBasedRewards.fragments.so5RewardConfig}
  ${ScoreBasedRewards.fragments.so5RewardConfig}
  ${ScoreBasedRewards.fragments.so5Leaderboard}
` as TypedDocumentNode<
  CompetitionDetailsRewardsTabQuery,
  CompetitionDetailsRewardsTabQueryVariables
>;

const Root = styled.div`
  color: var(--c-neutral-1000);
  display: flex;
  flex-direction: column;
  gap: calc(6 * var(--unit));
  padding: 0 var(--unit) var(--double-unit);
  @media (max-width: ${breakpoints.laptop}px) {
    padding-bottom: 40px;
  }
`;

const Header = styled.div`
  display: flex;
`;

const parseRankingRewards = (
  rewards:
    | CompetitionDetailsRewardsTabQuery_so5Leaderboard_rewardsConfig_ranking[]
    | null
): RangeReward[] => {
  if (!rewards) return [];

  const init: RangeReward[] = [
    {
      __typename: 'So5RewardConfig',
      score: null,
      ranks: null,
      rankPct: null,
      endRank: 0,
      ethAmount: null,
      usdAmount: null,
      minimumGuaranteedUsdAmount: null,
      coinAmount: null,
      cards: [],
      experiences: [],
    },
  ];
  const rangeRewards = rewards.reduce((sum, cur) => {
    const prev = sum[sum.length - 1];
    const r: RangeReward = {
      startRank: prev.endRank ? prev.endRank + 1 : 1,
      endRank: cur.ranks ? (prev.endRank || 0) + cur.ranks : undefined,
      startPct: prev.endPct,
      endPct: cur.rankPct,
      ...cur,
    };

    sum.push(r);
    return sum;
  }, init);

  rangeRewards.shift();
  return rangeRewards;
};

const CompetitionDetailsRewardsTab = () => {
  const { competition } = useParams<{ competition: string }>();

  const { data, loading } = useQuery(COMPETITION_DETAILS_REWARDS_TAB_QUERY, {
    variables: { slug: competition || '' },
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });

  const [leaderboardMode, setLeaderboardMode] =
    useLocalStorage<LeaderboardModes>(STORAGE.leaderboardMode, 'matchday');

  const so5Leaderboard = data?.football.so5.so5Leaderboard;
  const so5League = so5Leaderboard?.so5League;
  const universalSo5UserGroup = so5Leaderboard?.universalSo5UserGroups?.[0];

  const rewardsConfig =
    leaderboardMode === 'matchday'
      ? so5Leaderboard?.rewardsConfig
      : universalSo5UserGroup?.rewardsConfig;
  const conditions = rewardsConfig?.conditional;
  const rewards = rewardsConfig?.ranking || null;

  const so5Ranking = so5Leaderboard?.mySo5Lineups?.[0]?.so5Rankings?.[0];
  const so5UserGroupMembership = universalSo5UserGroup?.myMembership;
  const { score: myScore, eligibleRewards } =
    (leaderboardMode === 'matchday' ? so5Ranking : so5UserGroupMembership) ||
    {};
  const myRankPct = eligibleRewards?.find(e => !!e.rankPct)?.rankPct;
  const myEligibleRewardScore = eligibleRewards?.reduce((highest, reward) => {
    if (typeof reward.score === 'number' && reward.score > highest) {
      return reward.score;
    }
    return highest;
  }, 0);

  const parsedRewards = parseRankingRewards(rewards);
  if (!data && loading) {
    return <LoadingIndicator grow />;
  }

  if (!universalSo5UserGroup && leaderboardMode !== 'matchday') {
    setLeaderboardMode('matchday');
  }

  return (
    <Root>
      {universalSo5UserGroup && (
        <Header>
          <LeaderboardModeSelect
            leaderboardMode={leaderboardMode}
            changeLeaderboardMode={setLeaderboardMode}
          />
        </Header>
      )}
      {data && so5League && (
        <>
          {!!parsedRewards?.length && (
            <RankBasedRewards
              rewards={parsedRewards}
              myRanking={so5Ranking?.ranking}
              myRankPct={myRankPct}
              so5League={so5League}
            />
          )}
          {!!conditions?.length && (
            <ScoreBasedRewards
              conditions={conditions}
              myScore={myScore}
              myEligibleRewardScore={myEligibleRewardScore}
              so5Leaderboard={so5Leaderboard}
            />
          )}
        </>
      )}
    </Root>
  );
};

export default CompetitionDetailsRewardsTab;

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

type CompetitionDetailsRewardsTabQuery_vicc5Leaderboard_rewardsConfig_ranking =
  NonNullable<
    CompetitionDetailsRewardsTabQuery['vicc5']['vicc5Leaderboard']['rewardsConfig']['ranking']
  >[number];

export interface RangeReward
  extends CompetitionDetailsRewardsTabQuery_vicc5Leaderboard_rewardsConfig_ranking {
  startRank?: number | null;
  startPct?: number | null;
  endRank?: number | null;
  endPct?: number | null;
}

export const COMPETITION_DETAILS_REWARDS_TAB_QUERY = gql`
  query CompetitionDetailsRewardsTabQuery($slug: String!) {
    #football {
      vicc5 {
        vicc5Leaderboard(slug: $slug) {
          slug
          vicc5League {
            slug
            ...RankBasedRewards_vicc5League
          }
          myVicc5Lineups {
            id
            vicc5Rankings {
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
              ...RankBasedRewards_vicc5RewardConfig
            }
            conditional {
              ...ScoreBasedRewards_vicc5RewardConfig
            }
          }
          universalVicc5UserGroups {
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
                ...RankBasedRewards_vicc5RewardConfig
              }
              conditional {
                ...ScoreBasedRewards_vicc5RewardConfig
              }
            }
          }
          ...ScoreBasedRewards_vicc5Leaderboard
        }
      }
    #}
  }
  ${RankBasedRewards.fragments.vicc5League}
  ${RankBasedRewards.fragments.vicc5RewardConfig}
  ${ScoreBasedRewards.fragments.vicc5RewardConfig}
  ${ScoreBasedRewards.fragments.vicc5Leaderboard}
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
    | CompetitionDetailsRewardsTabQuery_vicc5Leaderboard_rewardsConfig_ranking[]
    | null
): RangeReward[] => {
  if (!rewards) return [];

  const init: RangeReward[] = [
    {
      __typename: 'Vicc5RewardConfig',
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

  const vicc5Leaderboard = data?.vicc5.vicc5Leaderboard;
  const vicc5League = vicc5Leaderboard?.vicc5League;
  const universalVicc5UserGroup = vicc5Leaderboard?.universalVicc5UserGroups?.[0];

  const rewardsConfig =
    leaderboardMode === 'matchday'
      ? vicc5Leaderboard?.rewardsConfig
      : universalVicc5UserGroup?.rewardsConfig;
  const conditions = rewardsConfig?.conditional;
  const rewards = rewardsConfig?.ranking || null;

  const vicc5Ranking = vicc5Leaderboard?.myVicc5Lineups?.[0]?.vicc5Rankings?.[0];
  const vicc5UserGroupMembership = universalVicc5UserGroup?.myMembership;
  const { score: myScore, eligibleRewards } =
    (leaderboardMode === 'matchday' ? vicc5Ranking : vicc5UserGroupMembership) ||
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

  if (!universalVicc5UserGroup && leaderboardMode !== 'matchday') {
    setLeaderboardMode('matchday');
  }

  return (
    <Root>
      {universalVicc5UserGroup && (
        <Header>
          <LeaderboardModeSelect
            leaderboardMode={leaderboardMode}
            changeLeaderboardMode={setLeaderboardMode}
          />
        </Header>
      )}
      {data && vicc5League && (
        <>
          {!!parsedRewards?.length && (
            <RankBasedRewards
              rewards={parsedRewards}
              myRanking={vicc5Ranking?.ranking}
              myRankPct={myRankPct}
              vicc5League={vicc5League}
            />
          )}
          {!!conditions?.length && (
            <ScoreBasedRewards
              conditions={conditions}
              myScore={myScore}
              myEligibleRewardScore={myEligibleRewardScore}
              vicc5Leaderboard={vicc5Leaderboard}
            />
          )}
        </>
      )}
    </Root>
  );
};

export default CompetitionDetailsRewardsTab;

import { gql } from '@apollo/client';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { FOOTBALL_LOBBY_LIVE } from '@sorare/core/src/constants/routes';

import { GameWeekTitle } from '@sorare/football/src/components/Home/GameWeekTitle';
import HomeBlockWithTimeline from '@sorare/football/src/components/Home/HomeBlockWithTimeline';
import { ItemRows } from '@sorare/football/src/components/Home/ItemRows';
import { SeeAllButton } from '@sorare/football/src/components/Home/SeeAllButton';
import { Lineup } from '@sorare/football/src/components/lineup/Lineup';
import { EligibleRewardsBanner } from '@sorare/football/src/components/rewards/EligibleRewardsBanner';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import { RewardType } from 'lib/lineupRewards';

import { LiveFixture_so5 } from './__generated__/index.graphql';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

type Props = {
  so5: Nullable<LiveFixture_so5>;
  loading: boolean;
};

export const LiveFixture = ({ so5, loading }: Props) => {
  const { edges } = so5?.so5Fixture?.mySo5LineupsPaginated || {};
  const lineups =
    edges?.map(edge => edge.node).filter(lineup => lineup?.so5Leaderboard) ||
    [];
  const lineupsCount = so5?.so5Fixture?.mySo5LineupsCount;

  if (!lineups.length && !loading) {
    return null;
  }

  return (
    <HomeBlockWithTimeline
      gameWeek={so5?.so5Fixture?.gameWeek}
      title={<GameWeekTitle so5Fixture={so5?.so5Fixture} type="live" />}
      type="live"
      loading={loading}
      action={
        lineupsCount && lineupsCount > 3 ? (
          <SeeAllButton
            context="Live"
            to={generatePath(FOOTBALL_LOBBY_LIVE, {
              tab: 'my-teams',
            })}
          />
        ) : null
      }
    >
      <ContentWrapper>
        <ItemRows itemsCount={lineups.length} loading={loading}>
          {lineups.map(
            lineup =>
              lineup?.so5Leaderboard && (
                <Lineup
                  key={lineup.id}
                  leaderboard={lineup.so5Leaderboard}
                  lineup={lineup}
                  rewardType={RewardType.Eligible}
                  displayScore
                  hideGameWeekInfo
                />
              )
          )}
        </ItemRows>
        {!loading && (
          <EligibleRewardsBanner
            rewardConfigs={lineups.flatMap(lineup =>
              lineup.so5Rankings.flatMap(ranking => ranking.eligibleRewards)
            )}
            rewardsDeliveryDate={so5?.so5Fixture?.rewardsDeliveryDate}
          />
        )}
      </ContentWrapper>
    </HomeBlockWithTimeline>
  );
};

LiveFixture.fragments = {
  so5: gql`
    fragment LiveFixture_so5 on So5Root {
      so5Fixture(type: LIVE) {
        slug
        gameWeek
        rewardsDeliveryDate
        ...GameWeekTitle_so5Fixture
        mySo5LineupsCount(training: false, draft: false)
        mySo5LineupsPaginated(first: 3, withTraining: false) {
          edges {
            node {
              id
              ...Lineup_so5Lineup
              so5Leaderboard {
                slug
                ...Lineup_so5Leaderboard
              }
              so5Rankings {
                id
                eligibleRewards {
                  ...EligibleRewards_rewardConfig
                  ...EligibleRewardsBanner_rewardConfig
                }
              }
            }
          }
        }
      }
    }
    ${GameWeekTitle.fragments.so5Fixture}
    ${Lineup.fragments.so5Leaderboard}
    ${Lineup.fragments.so5Lineup}
    ${EligibleRewardsBanner.fragments.rewardConfig}
  `,
};

import { gql } from '@apollo/client';
import { useState } from 'react';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { FOOTBALL_LOBBY_PAST } from '@sorare/core/src/constants/routes';
import { hasUnclaimedRewards } from '@sorare/core/src/lib/rewards';

import { GameWeekTitle } from '@football/components/Home/GameWeekTitle';
import HomeBlockWithTimeline from '@football/components/Home/HomeBlockWithTimeline';
import { ItemRows } from '@football/components/Home/ItemRows';
import { SeeAllButton } from '@football/components/Home/SeeAllButton';
import { Lineup } from '@football/components/lineup/Lineup';
import { RewardsBanner } from '@football/components/rewards/Banner';
import { EligibleRewardsBanner } from '@football/components/rewards/EligibleRewardsBanner';
import { getRewardType } from '@football/lib/lineupRewards';
import { isFixtureClosed } from '@football/lib/so5';

import { PastFixture_so5 } from './__generated__/index.graphql';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

type Props = {
  so5: Nullable<PastFixture_so5>;
  loading: boolean;
};
export const PastFixture = ({ so5, loading }: Props) => {
  const so5Fixture = so5?.pastFixture;
  const { edges } = so5Fixture?.mySo5LineupsPaginated || {};
  const lineups =
    edges?.map(edge => edge.node).filter(lineup => lineup?.so5Leaderboard) ||
    [];
  const lineupsCount = so5Fixture?.mySo5LineupsCount;
  const [isDisplayedOnce, setIsDisplayedOnce] = useState(false);

  if (!lineups.length && !loading) {
    return null;
  }

  const unclaimedRewards = so5Fixture && hasUnclaimedRewards(so5Fixture);
  const fixtureClosed = so5Fixture && isFixtureClosed(so5Fixture);

  const shouldBeDisplayed = !unclaimedRewards && fixtureClosed;

  if (shouldBeDisplayed && !isDisplayedOnce) {
    return null;
  }

  if (!isDisplayedOnce && !loading) {
    setIsDisplayedOnce(true);
  }

  const getRewards = () => {
    if (loading) {
      return null;
    }
    if (!fixtureClosed) {
      return (
        <EligibleRewardsBanner
          rewardConfigs={lineups.flatMap(lineup =>
            lineup.so5Rankings.flatMap(ranking => ranking.eligibleRewards)
          )}
          rewardsDeliveryDate={so5Fixture?.rewardsDeliveryDate}
        />
      );
    }
    if (so5Fixture?.mySo5Rewards) {
      return <RewardsBanner rewards={so5Fixture?.mySo5Rewards} />;
    }
    return null;
  };

  return (
    <HomeBlockWithTimeline
      gameWeek={so5Fixture?.gameWeek}
      title={<GameWeekTitle so5Fixture={so5Fixture} type="past" />}
      type="past"
      loading={loading}
      action={
        lineupsCount &&
        lineupsCount > 3 && (
          <SeeAllButton
            context="Past"
            to={generatePath(FOOTBALL_LOBBY_PAST, {
              tab: 'my-teams',
              slug: so5Fixture?.slug,
            })}
          />
        )
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
                  rewardType={getRewardType(so5Fixture)}
                  displayScore
                  hideGameWeekInfo
                />
              )
          )}
        </ItemRows>
        {getRewards()}
      </ContentWrapper>
    </HomeBlockWithTimeline>
  );
};

PastFixture.fragments = {
  so5: gql`
    fragment PastFixture_so5 on So5Root {
      pastFixture: so5Fixture(type: PAST) {
        slug
        aasmState
        gameWeek
        rewardsDeliveryDate
        ...GameWeekTitle_so5Fixture
        mySo5LineupsCount(training: false)
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
        ...getRewardType_so5Fixture
        mySo5Rewards {
          slug
          ...RewardsBanner_so5Reward
        }
        ...hasUnclaimedRewards_so5Fixture
      }
    }
    ${getRewardType.fragments.so5Fixture}
    ${Lineup.fragments.so5Leaderboard}
    ${Lineup.fragments.so5Lineup}
    ${GameWeekTitle.fragments.so5Fixture}
    ${RewardsBanner.fragments.so5Reward}
    ${hasUnclaimedRewards.fragments.so5Fixture}
    ${EligibleRewardsBanner.fragments.rewardConfig}
  `,
};

import { TypedDocumentNode, gql } from '@apollo/client';
import { useState } from 'react';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { FOOTBALL_LOBBY_PAST } from '@sorare/core/src/constants/routes';
import { hasUnclaimedRewards } from '@sorare/core/src/lib/rewards';

import { GameWeekTitle } from '@football/components/home/GameWeekTitle';
import HomeBlockWithTimeline from '@football/components/home/HomeBlockWithTimeline';
import { ItemRows } from '@football/components/home/ItemRows';
import { SeeAllButton } from '@football/components/home/SeeAllButton';
import { Lineup } from '@football/components/lineup/Lineup';
import { RewardsBanner } from '@football/components/rewards/Banner';
import { EligibleRewardsBanner } from '@football/components/rewards/EligibleRewardsBanner';
import { getRewardType } from '@football/lib/lineupRewards';
import { isFixtureClosed } from '@football/lib/so5';

import { PastFixture_vicc5 } from './__generated__/index.graphql';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

type Props = {
  vicc5: Nullable<PastFixture_vicc5>;
  loading: boolean;
};
export const PastFixture = ({ vicc5, loading }: Props) => {
  const vicc5Fixture = vicc5?.pastFixture;
  const { edges } = vicc5Fixture?.myVicc5LineupsPaginated || {};
  const lineups =
    edges?.map(edge => edge.node).filter(lineup => lineup?.vicc5Leaderboard) ||
    [];
  const lineupsCount = vicc5Fixture?.myVicc5LineupsCount;
  const [isDisplayedOnce, setIsDisplayedOnce] = useState(false);

  if (!lineups.length && !loading) {
    return null;
  }

  const unclaimedRewards = vicc5Fixture && hasUnclaimedRewards(vicc5Fixture);
  const fixtureClosed = vicc5Fixture && isFixtureClosed(vicc5Fixture);

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
            lineup.vicc5Rankings.flatMap(ranking => ranking.eligibleRewards)
          )}
          rewardsDeliveryDate={vicc5Fixture?.rewardsDeliveryDate}
        />
      );
    }
    if (vicc5Fixture?.myVicc5Rewards) {
      return <RewardsBanner rewards={vicc5Fixture?.myVicc5Rewards} />;
    }
    return null;
  };

  return (
    <HomeBlockWithTimeline
      gameWeek={vicc5Fixture?.gameWeek}
      fixtureShortDisplayName={vicc5Fixture?.shortDisplayName}
      title={<GameWeekTitle vicc5Fixture={vicc5Fixture} type="past" />}
      type="past"
      loading={loading}
      action={
        lineupsCount &&
        lineupsCount > 3 && (
          <SeeAllButton
            context="Past"
            to={generatePath(FOOTBALL_LOBBY_PAST, {
              tab: 'my-teams',
              slug: vicc5Fixture?.slug,
            })}
          />
        )
      }
    >
      <ContentWrapper>
        <ItemRows itemsCount={lineups.length} loading={loading}>
          {lineups.map(
            lineup =>
              lineup?.vicc5Leaderboard && (
                <Lineup
                  key={lineup.id}
                  leaderboard={lineup.vicc5Leaderboard}
                  lineup={lineup}
                  rewardType={getRewardType(vicc5Fixture)}
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
  vicc5: gql`
    fragment PastFixture_vicc5 on Vicc5Root {
      pastFixture: vicc5Fixture(type: PAST) {
        slug
        aasmState
        gameWeek
        shortDisplayName
        rewardsDeliveryDate
        ...GameWeekTitle_vicc5Fixture
        myVicc5LineupsCount(training: false)
        myVicc5LineupsPaginated(first: 3, withTraining: false) {
          edges {
            node {
              id
              ...Lineup_vicc5Lineup
              vicc5Leaderboard {
                slug
                ...Lineup_vicc5Leaderboard
              }
              vicc5Rankings {
                id
                eligibleRewards {
                  ...EligibleRewards_rewardConfig
                  ...EligibleRewardsBanner_rewardConfig
                }
              }
            }
          }
        }
        ...getRewardType_vicc5Fixture
        myVicc5Rewards {
          slug
          ...RewardsBanner_vicc5Reward
        }
        ...hasUnclaimedRewards_vicc5Fixture
      }
    }
    ${getRewardType.fragments.vicc5Fixture}
    ${Lineup.fragments.vicc5Leaderboard}
    ${Lineup.fragments.vicc5Lineup}
    ${GameWeekTitle.fragments.vicc5Fixture}
    ${RewardsBanner.fragments.vicc5Reward}
    ${hasUnclaimedRewards.fragments.vicc5Fixture}
    ${EligibleRewardsBanner.fragments.rewardConfig}
  ` as TypedDocumentNode<PastFixture_vicc5>,
};

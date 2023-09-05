import { TypedDocumentNode, gql } from '@apollo/client';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { FOOTBALL_LOBBY_LIVE } from '@sorare/core/src/constants/routes';

import { GameWeekTitle } from '@football/components/home/GameWeekTitle';
import HomeBlockWithTimeline from '@football/components/home/HomeBlockWithTimeline';
import { ItemRows } from '@football/components/home/ItemRows';
import { SeeAllButton } from '@football/components/home/SeeAllButton';
import { Lineup } from '@football/components/lineup/Lineup';
import { EligibleRewardsBanner } from '@football/components/rewards/EligibleRewardsBanner';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import { RewardType } from '@football/lib/lineupRewards';

import { LiveFixture_vicc5 } from './__generated__/index.graphql';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

type Props = {
  vicc5: Nullable<LiveFixture_vicc5>;
  loading: boolean;
};

export const LiveFixture = ({ vicc5, loading }: Props) => {
  const { edges } = vicc5?.vicc5Fixture?.myVicc5LineupsPaginated || {};
  const lineups =
    edges?.map(edge => edge.node).filter(lineup => lineup?.vicc5Leaderboard) ||
    [];
  const lineupsCount = vicc5?.vicc5Fixture?.myVicc5LineupsCount;

  if (!lineups.length && !loading) {
    return null;
  }

  return (
    <HomeBlockWithTimeline
      gameWeek={vicc5?.vicc5Fixture?.gameWeek}
      fixtureShortDisplayName={vicc5?.vicc5Fixture?.shortDisplayName}
      title={<GameWeekTitle vicc5Fixture={vicc5?.vicc5Fixture} type="live" />}
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
              lineup?.vicc5Leaderboard && (
                <Lineup
                  key={lineup.id}
                  leaderboard={lineup.vicc5Leaderboard}
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
              lineup.vicc5Rankings.flatMap(ranking => ranking.eligibleRewards)
            )}
            rewardsDeliveryDate={vicc5?.vicc5Fixture?.rewardsDeliveryDate}
          />
        )}
      </ContentWrapper>
    </HomeBlockWithTimeline>
  );
};

LiveFixture.fragments = {
  vicc5: gql`
    fragment LiveFixture_vicc5 on Vicc5Root {
      vicc5Fixture(type: LIVE) {
        slug
        gameWeek
        shortDisplayName
        rewardsDeliveryDate
        ...GameWeekTitle_vicc5Fixture
        myVicc5LineupsCount(training: false, draft: false)
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
      }
    }
    ${GameWeekTitle.fragments.vicc5Fixture}
    ${Lineup.fragments.vicc5Leaderboard}
    ${Lineup.fragments.vicc5Lineup}
    ${EligibleRewardsBanner.fragments.rewardConfig}
  ` as TypedDocumentNode<LiveFixture_vicc5>,
};

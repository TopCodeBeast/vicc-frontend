import { gql } from '@apollo/client';
import { useMemo } from 'react';

import {
  CommonDraftCampaignStatus,
  So5LeaderboardType,
} from '@sorare/core/src/__generated__/globalTypes';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import { Discover } from './Discover';
import { Live } from './Live';
import { ManagerAssistant } from './ManagerAssistant';
import { Past } from './Past';
import { PrivateLeagues } from './PrivateLeagues';
import { TournamentsTimeline } from './TournamentsTimeline';
import { Upcoming } from './Upcoming';
import { HomeLeaderboardsQuery } from './__generated__/useOverviewQuery.graphql';

const HOME_LEADERBOARDS_QUERY = gql`
  query HomeLeaderboardsQuery {
    currentUser {
      slug
      ...ManagerAssistant_currentUser
    }
    football {
      so5 {
        upcomingLeaderboards {
          slug
          canCompose {
            value
          }
          commonDraftCampaign {
            slug
            status
          }
          so5LeaderboardType
          ...Discover_leaderboard
          ...Upcoming_leaderboard
          ...ManagerAssistant_so5Leaderboard
        }
        ...PrivateLeagues_so5
        ...Live_so5
        ...Past_so5
        ...TournamentsTimeline_so5
      }
    }
  }
  ${Discover.fragments.leaderboard}
  ${Upcoming.fragments.leaderboard}
  ${PrivateLeagues.fragments.so5}
  ${Live.fragments.so5}
  ${Past.fragments.so5}
  ${TournamentsTimeline.fragments.so5}
  ${ManagerAssistant.fragments.currentUser}
  ${ManagerAssistant.fragments.so5Leaderboard}
`;

const filterCanCompose = (
  l: HomeLeaderboardsQuery['football']['so5']['upcomingLeaderboards'][number]
) => {
  return (
    l.canCompose.value &&
    l.commonDraftCampaign?.status !== CommonDraftCampaignStatus.OPEN
  );
};

const filterTraining = (
  l: HomeLeaderboardsQuery['football']['so5']['upcomingLeaderboards'][number]
) => {
  return l.so5LeaderboardType !== So5LeaderboardType.SPECIAL_TRAINING_CENTER;
};

const filterTooManyCards = (
  l: HomeLeaderboardsQuery['football']['so5']['upcomingLeaderboards'][number]
) => {
  return (
    l.commonDraftCampaign ||
    l.canCompose.value ||
    l.canCompose.notEnoughEligibleCards
  );
};

const useOverviewQuery = () => {
  const { data, loading, refetch } = useQuery<HomeLeaderboardsQuery>(
    HOME_LEADERBOARDS_QUERY,
    {
      // need network to update discover & upcoming section if user buys a card from homepage
      nextFetchPolicy: 'cache-and-network',
      fetchPolicy: 'cache-and-network',
    }
  );
  const leaderboards = data?.football.so5.upcomingLeaderboards;

  // memo here to avoid the tab from being reset on every render (i.e when you open a routed dialog)
  const leaderboardsToDiscover = useMemo(
    () =>
      leaderboards?.filter(
        l => filterTraining(l) && !filterCanCompose(l) && filterTooManyCards(l)
      ),
    [leaderboards]
  );

  const eligibleLeaderboards = useMemo(
    () => leaderboards?.filter(l => filterTraining(l) && filterCanCompose(l)),
    [leaderboards]
  );

  const leaderboardsWithDraft = useMemo(
    () => leaderboards?.filter(l => !!l.commonDraftCampaign),
    [leaderboards]
  );

  return {
    leaderboardsToDiscover,
    eligibleLeaderboards,
    leaderboardsWithDraft,
    leaderboards,
    user: data?.currentUser,
    so5: data?.football.so5,
    loading,
    refetch,
  };
};

export default useOverviewQuery;

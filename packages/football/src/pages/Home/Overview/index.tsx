import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';

import { ContentUnits } from './ContentUnits';
import { ManagerAssistant } from './ManagerAssistant';
import { PrivateLeagues } from './PrivateLeagues';
import { TournamentsTimeline } from './TournamentsTimeline';
import {
  HomeLeaderboardsQuery,
  HomeLeaderboardsQueryVariables,
} from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--unit) * 6);
`;

const HOME_LEADERBOARDS_QUERY = gql`
  query HomeLeaderboardsQuery {
    currentUser {
      slug
      ...ManagerAssistant_currentUser
    }
    football {
      vicc5 {
        upcomingLeaderboards {
          slug
          canCompose {
            value
          }
          commonDraftCampaign {
            slug
            status
          }
          vicc5LeaderboardType
          ...ManagerAssistant_vicc5Leaderboard
        }
        ...PrivateLeagues_vicc5
        ...TournamentsTimeline_vicc5
      }
    }
  }

  ${PrivateLeagues.fragments.vicc5}
  ${TournamentsTimeline.fragments.vicc5}
  ${ManagerAssistant.fragments.currentUser}
  ${ManagerAssistant.fragments.vicc5Leaderboard}
` as TypedDocumentNode<HomeLeaderboardsQuery, HomeLeaderboardsQueryVariables>;

export const Overview = () => {
  const {
    flags: { disableHomeContentUnits = false },
  } = useFeatureFlags();
  const { data, loading } = useQuery(HOME_LEADERBOARDS_QUERY, {
    // need network to update discover & upcoming section if user buys a card from homepage
    nextFetchPolicy: 'cache-and-network',
    fetchPolicy: 'cache-and-network',
  });
  const leaderboards = data?.football.vicc5.upcomingLeaderboards;
  const user = data?.currentUser;
  const vicc5 = data?.football.vicc5;

  const contentUnits = !disableHomeContentUnits && (
    <ContentUnits
      loading={
        /* pretend to load for content to display at approximately the same time */
        loading
      }
    />
  );

  return (
    <Wrapper>
      <ManagerAssistant
        user={user}
        leaderboards={leaderboards}
        loading={loading}
      />
      <TournamentsTimeline vicc5={vicc5} loading={loading} />
      {contentUnits}
      <PrivateLeagues vicc5={vicc5} loading={loading} />
    </Wrapper>
  );
};

export default Overview;

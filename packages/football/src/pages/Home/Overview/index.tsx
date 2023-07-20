import { gql } from '@apollo/client';
import styled from 'styled-components';

import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';

// import { ContentUnits } from './ContentUnits';
// import { ManagerAssistant } from './ManagerAssistant';
import { PrivateLeagues } from './PrivateLeagues';
import { TournamentsTimeline } from './TournamentsTimeline';
import { HomeLeaderboardsQuery } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--unit) * 6);
`;

const HOME_LEADERBOARDS_QUERY = gql`
  query HomeLeaderboardsQuery {
    currentUser {
      slug
      #...ManagerAssistant_currentUser
    }
    so5: vicc5Root {
      upcomingLeaderboards {
        slug
        canCompose {
          value
        }
        commonDraftCampaign {
          slug
          status
        }
        so5LeaderboardType: vicc5LeaderboardType
        #...ManagerAssistant_so5Leaderboard
      }
      ...PrivateLeagues_so5
      #...TournamentsTimeline_so5
    }
  }

  ${PrivateLeagues.fragments.so5}
  #{TournamentsTimeline.fragments.so5}
  #{ManagerAssistant.fragments.currentUser}
  #{ManagerAssistant.fragments.so5Leaderboard}
`;

export const Overview = () => {
  const {
    flags: { disableHomeContentUnits = false },
  } = useFeatureFlags();
  const { data, loading } = useQuery<HomeLeaderboardsQuery>(
    HOME_LEADERBOARDS_QUERY,
    {
      // need network to update discover & upcoming section if user buys a card from homepage
      nextFetchPolicy: 'cache-and-network',
      fetchPolicy: 'cache-and-network',
    }
  );
  const leaderboards = data?.so5.upcomingLeaderboards;
  const user = data?.currentUser;
  const so5 = data?.so5;

  // const contentUnits = !disableHomeContentUnits && (
  //   <ContentUnits
  //     loading={
  //       /* pretend to load for content to display at approximately the same time */
  //       loading
  //     }
  //   />
  // );
  //TODO****

  return (
    <Wrapper>
      {/* <ManagerAssistant
        user={user}
        leaderboards={leaderboards}
        loading={loading}
      /> */}
      <TournamentsTimeline so5={so5} loading={loading} />
      {/* {contentUnits} */}
      <PrivateLeagues so5={so5} loading={loading} />
    </Wrapper>
  );
};

export default Overview;

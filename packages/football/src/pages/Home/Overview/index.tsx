import styled from 'styled-components';

import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { useUseHomeTimelineLayout } from '@sorare/core/src/lib/featureFlags';

import { ContentUnits } from './ContentUnits';
import { Discover } from './Discover';
import { Live } from './Live';
import { ManagerAssistant } from './ManagerAssistant';
import { Past } from './Past';
import { PrivateLeagues } from './PrivateLeagues';
import { TournamentsTimeline } from './TournamentsTimeline';
import { Upcoming } from './Upcoming';
import useOverviewQuery from './useOverviewQuery';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--unit) * 6);
`;

export const Overview = () => {
  const {
    flags: { disableHomeContentUnits = false },
  } = useFeatureFlags();
  const useHomeTimelineLayout = useUseHomeTimelineLayout();
  const {
    eligibleLeaderboards,
    leaderboardsToDiscover,
    leaderboardsWithDraft,
    leaderboards,
    user,
    so5,
    loading,
  } = useOverviewQuery();

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
      {useHomeTimelineLayout ? (
        <TournamentsTimeline so5={so5} loading={loading} />
      ) : (
        <>
          <Live so5={so5} loading={loading} />
          <Upcoming leaderboards={eligibleLeaderboards} loading={loading} />
          <Discover
            loading={loading}
            leaderboardsToDiscover={leaderboardsToDiscover}
            leaderboardsWithDraft={leaderboardsWithDraft}
          />
          <Past so5={so5} loading={loading} />
        </>
      )}
      {contentUnits}
      <PrivateLeagues so5={so5} loading={loading} />
    </Wrapper>
  );
};

export default Overview;

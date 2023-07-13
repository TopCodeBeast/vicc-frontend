import { gql } from '@apollo/client';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import LineupToDiscover from '@football/components/lineup/LineupToDiscover';
import { SEMI_PRO_TOURNAMENT_TYPES } from '@football/lib/leaderboard';
import { isFreeUser } from '@football/lib/user';

import { RecommendedLeaderboardsQuery } from './__generated__/useGetRecommendedLeaderboard.graphql';

export const RECOMMENDED_LEADERBOARDS_QUERY = gql`
  query RecommendedLeaderboardsQuery {
    so5: vicc5Root {
      upcomingLeaderboards {
        slug
        so5LeaderboardType: vicc5LeaderboardType
        tournamentType
        commonDraftCampaign {
          slug
          status
        }
        ...LineupToDiscover_so5Leaderboard
      }
    }
  }
  ${LineupToDiscover.fragments.so5Leaderboard}
`;

const useGetRecommendedLeaderboard = ({
  showRecommendedLeaderboard,
}: {
  showRecommendedLeaderboard: boolean | undefined;
}) => {
  const { currentUser } = useCurrentUserContext();

  const { data, loading } = useQuery<RecommendedLeaderboardsQuery>(
    RECOMMENDED_LEADERBOARDS_QUERY,
    {
      skip: !showRecommendedLeaderboard || !isFreeUser(currentUser),
    }
  );

  if (!isFreeUser(currentUser)) {
    return {};
  }

  const leaderboards = data?.so5.upcomingLeaderboards;

  const draftedLeaderboards =
    leaderboards?.filter(
      l => l.commonDraftCampaign && l.commonDraftCampaign.status !== 'OPEN'
    ) || [];

  if (draftedLeaderboards.length > 0) {
    const draftedLeaderboard = draftedLeaderboards[0];
    const correspondingSemiProLeaderboard = leaderboards?.find(
      l =>
        SEMI_PRO_TOURNAMENT_TYPES.includes(l.so5LeaderboardType) &&
        l.tournamentType === draftedLeaderboard.tournamentType
    );
    return {
      recommendedLeaderboard: correspondingSemiProLeaderboard,
      draftedLeaderboard,
      loading,
    };
  }

  const firstUndraftedLeaderboard = leaderboards?.find(
    l => l.commonDraftCampaign && l.commonDraftCampaign.status === 'OPEN'
  );

  return {
    recommendedLeaderboard: firstUndraftedLeaderboard,
    loading,
    draftedLeaderboard: undefined,
  };
};

export default useGetRecommendedLeaderboard;

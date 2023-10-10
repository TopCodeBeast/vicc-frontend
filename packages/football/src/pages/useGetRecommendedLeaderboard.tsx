import { TypedDocumentNode, gql } from '@apollo/client';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import LineupToDiscover from '@football/components/lineup/LineupToDiscover';
import { SEMI_PRO_TOURNAMENT_TYPES } from '@football/lib/leaderboard';
import { isFreeUser } from '@football/lib/user';

import {
  RecommendedLeaderboardsQuery,
  RecommendedLeaderboardsQueryVariables,
} from './__generated__/useGetRecommendedLeaderboard.graphql';

export const RECOMMENDED_LEADERBOARDS_QUERY = gql`
  query RecommendedLeaderboardsQuery {
    #football {
      vicc5Root {
        upcomingLeaderboards {
          slug
          vicc5Tournament {
            id
            slug
          }
          commonDraftCampaign {
            slug
            status
          }
          ...LineupToDiscover_vicc5Leaderboard
        }
      }
    #}
  }
  ${LineupToDiscover.fragments.vicc5Leaderboard}
` as TypedDocumentNode<
  RecommendedLeaderboardsQuery,
  RecommendedLeaderboardsQueryVariables
>;

const useGetRecommendedLeaderboard = ({
  showRecommendedLeaderboard,
}: {
  showRecommendedLeaderboard: boolean | undefined;
}) => {
  const { currentUser } = useCurrentUserContext();

  const { data, loading } = useQuery(RECOMMENDED_LEADERBOARDS_QUERY, {
    skip: !showRecommendedLeaderboard || !isFreeUser(currentUser),
  });

  if (!isFreeUser(currentUser)) {
    return {};
  }

  const leaderboards = data?.vicc5.upcomingLeaderboards;

  const draftedLeaderboards =
    leaderboards?.filter(
      l => l.commonDraftCampaign && l.commonDraftCampaign.status !== 'OPEN'
    ) || [];

  if (draftedLeaderboards.length > 0) {
    const draftedLeaderboard = draftedLeaderboards[0];
    const correspondingSemiProLeaderboard = leaderboards?.find(
      l =>
        SEMI_PRO_TOURNAMENT_TYPES.includes(l.vicc5Tournament.slug) &&
        l.vicc5Tournament.slug === draftedLeaderboard.vicc5Tournament.slug
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

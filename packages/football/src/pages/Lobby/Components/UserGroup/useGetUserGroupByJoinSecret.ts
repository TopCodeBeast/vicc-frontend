import { gql } from '@apollo/client';

import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import { GetUserGroupByJoinSecretQuery } from './__generated__/useGetUserGroupByJoinSecret.graphql';

const GET_USERGROUP_QUERY = gql`
  query GetUserGroupByJoinSecretQuery($joinSecret: String!) {
    so5: vicc5Root {
      so5UserGroup: vicc5UserGroup(joinSecret: $joinSecret) {
        id
        slug
        displayName
        joinDisabled
        membershipsCount
        upcomingSo5Leaderboard: upcomingVicc5Leaderboard {
          slug
          commonDraftCampaign {
            slug
          }
        }
        logo {
          id
          pictureUrl
        }
        administrator {
          slug
          id
          nickname
        }
        myMembership {
          createdAt
        }
        so5TournamentType: vicc5TournamentType {
          id
          so5LeaderboardType: vicc5LeaderboardType
        }
      }
    }
  }
`;

const useGetUserGroupByJoinSecret = (joinSecret?: string) =>
  useQuery<GetUserGroupByJoinSecretQuery>(GET_USERGROUP_QUERY, {
    variables: { joinSecret },
  });

export default useGetUserGroupByJoinSecret;

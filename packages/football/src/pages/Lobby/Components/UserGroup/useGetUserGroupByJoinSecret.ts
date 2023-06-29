import { gql } from '@apollo/client';

import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import { GetUserGroupByJoinSecretQuery } from './__generated__/useGetUserGroupByJoinSecret.graphql';

const GET_USERGROUP_QUERY = gql`
  query GetUserGroupByJoinSecretQuery($joinSecret: String!) {
    football {
      so5 {
        so5UserGroup(joinSecret: $joinSecret) {
          id
          slug
          displayName
          joinDisabled
          membershipsCount
          upcomingSo5Leaderboard {
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
          so5TournamentType {
            id
            so5LeaderboardType
          }
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

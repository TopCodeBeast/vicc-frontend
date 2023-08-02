import { TypedDocumentNode, gql } from '@apollo/client';

import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import {
  GetPrivateUserGroupByJoinSecretQuery,
  GetPrivateUserGroupByJoinSecretQueryVariables,
} from './__generated__/useGetPrivateUserGroupByJoinSecret.graphql';

const GET_PRIVATE_USER_GROUP_QUERY = gql`
  query GetPrivateUserGroupByJoinSecretQuery($joinSecret: String!) {
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
` as TypedDocumentNode<
  GetPrivateUserGroupByJoinSecretQuery,
  GetPrivateUserGroupByJoinSecretQueryVariables
>;

const useGetPrivateUserGroupByJoinSecret = (joinSecret?: string) =>
  useQuery(GET_PRIVATE_USER_GROUP_QUERY, {
    variables: {
      // FIXME undefined case is improperly handled
      joinSecret: joinSecret ?? '',
    },
  });

export default useGetPrivateUserGroupByJoinSecret;

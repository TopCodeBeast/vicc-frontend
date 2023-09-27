import { TypedDocumentNode, gql } from '@apollo/client';

import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import {
  GetPrivateUserGroupByJoinSecretQuery,
  GetPrivateUserGroupByJoinSecretQueryVariables,
} from './__generated__/useGetPrivateUserGroupByJoinSecret.graphql';

const GET_PRIVATE_USER_GROUP_QUERY = gql`
  query GetPrivateUserGroupByJoinSecretQuery($joinSecret: String!) {
    #football {
      vicc5 {
        vicc5UserGroup(joinSecret: $joinSecret) {
          id
          slug
          displayName
          joinDisabled
          membershipsCount
          upcomingVicc5Leaderboard {
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
          vicc5Tournament {
            id
            slug
          }
        }
      }
    #}
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

import { gql } from '@apollo/client';

import { LeaderboardWithLineupDetails as Leaderboard } from '@football/components/so5/Leaderboard/WithLineupDetails';
import UserGroupLeaderboardPaginated from '@football/pages/Lobby/Components/UserGroup/UserGroupLeaderboardPaginated';

export const COMPETITION_DETAILS_LEADERBOARD_TAB_QUERY = gql`
  query CompetitionDetailsLeaderboardTabQuery(
    $slug: String!
    $page: Int
    $pageSize: Int
    $onlyFollowed: Boolean
    $so5UserGroupSlug: String
  ) {
    football {
      so5 {
        so5Leaderboard(slug: $slug) {
          slug
          so5LineupsCount
          mySo5Rankings(so5UserGroupSlug: $so5UserGroupSlug) {
            id
            ...Leaderboard_so5Rankings
          }
          so5RankingsPaginated(
            page: $page
            pageSize: $pageSize
            onlyFollowed: $onlyFollowed
            so5UserGroupSlug: $so5UserGroupSlug
          ) {
            currentPage
            totalCount
            so5Rankings {
              id
              ...Leaderboard_so5Rankings
            }
          }
          universalSo5UserGroups {
            slug
          }
        }
      }
    }
  }
  ${Leaderboard.fragments.so5Ranking}
`;

export const COMPETITION_DETAILS_UNIVERSAL_USERGROUPS_LEADERBOARD_QUERY = gql`
  query CompetitionDetailsUniversalUserGroupsLeaderboardQuery(
    $slug: String!
    $page: Int
  ) {
    football {
      so5 {
        so5Leaderboard(slug: $slug) {
          slug
          universalSo5UserGroups {
            slug
            membershipsPaginated(page: $page) {
              totalCount
            }
            ...UserGroupLeaderboardPaginated_so5UserGroup
          }
        }
      }
    }
  }
  ${UserGroupLeaderboardPaginated.fragments.so5UserGroup}
`;

export const COMPETITION_DETAILS_USERGROUPS_LEADERBOARD_QUERY = gql`
  query CompetitionDetailsUserGroupsLeaderboardQuery(
    $slug: String!
    $page: Int
  ) {
    football {
      so5 {
        so5UserGroup(slug: $slug) {
          slug
          membershipsPaginated(page: $page) {
            totalCount
          }
          ...UserGroupLeaderboardPaginated_so5UserGroup
        }
      }
    }
  }
  ${UserGroupLeaderboardPaginated.fragments.so5UserGroup}
`;

export const COMPETITION_DETAILS_UNIVERSAL_USERGROUPS_QUERY = gql`
  query CompetitionDetailsUniversalUserGroupsQuery($slug: String!) {
    football {
      so5 {
        so5Leaderboard(slug: $slug) {
          slug
          universalSo5UserGroups {
            slug
          }
          mySo5UserGroups(first: 20) {
            nodes {
              slug
              logo {
                pictureUrl
              }
              displayName
            }
          }
        }
      }
    }
  }
`;

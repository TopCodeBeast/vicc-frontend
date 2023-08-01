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
    so5: vicc5Root {
      so5Leaderboard: vicc5Leaderboard(slug: $slug) {
        slug
        so5LineupsCount: vicc5LineupsCount
        mySo5Rankings: myVicc5Rankings(vicc5UserGroupSlug: $so5UserGroupSlug) {
          id
          ...Leaderboard_so5Rankings
        }
        so5RankingsPaginated: vicc5RankingsPaginated(
          page: $page
          pageSize: $pageSize
          onlyFollowed: $onlyFollowed
          vicc5UserGroupSlug: $so5UserGroupSlug
        ) {
          currentPage
          totalCount
          so5Rankings: vicc5Rankings {
            id
            ...Leaderboard_so5Rankings
          }
        }
        universalSo5UserGroups: universalVicc5UserGroups {
          slug
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
    so5: vicc5Root {
      so5Leaderboard: vicc5Leaderboard(slug: $slug) {
        slug
        universalSo5UserGroups: universalVicc5UserGroups {
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

export const COMPETITION_DETAILS_USERGROUPS_LEADERBOARD_QUERY = gql`
  query CompetitionDetailsUserGroupsLeaderboardQuery(
    $slug: String!
    $page: Int
  ) {
    so5: vicc5Root {
      so5UserGroup: vicc5UserGroup(slug: $slug) {
        slug
        membershipsPaginated(page: $page) {
          totalCount
        }
        ...UserGroupLeaderboardPaginated_so5UserGroup
      }
    }
  }
  ${UserGroupLeaderboardPaginated.fragments.so5UserGroup}
`;

export const COMPETITION_DETAILS_UNIVERSAL_USERGROUPS_QUERY = gql`
  query CompetitionDetailsUniversalUserGroupsQuery($slug: String!) {
    so5: vicc5Root {
      so5Leaderboard: vicc5Leaderboard(slug: $slug) {
        slug
        universalSo5UserGroups: universalVicc5UserGroups {
          slug
        }
        mySo5UserGroups: myVicc5UserGroups(first: 20) {
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
`;

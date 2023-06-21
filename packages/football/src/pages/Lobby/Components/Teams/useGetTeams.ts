import { gql } from '@apollo/client';

import { So5State } from '@sorare/core/src/__generated__/globalTypes';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';

import { Lineup } from '@football/components/lineup/Lineup';

import {
  LobbyLineupsQuery,
  LobbyUpcomingLineupsQuery,
} from './__generated__/useGetTeams.graphql';

const LOBBY_UPCOMING_LINEUPS_QUERY = gql`
  query LobbyUpcomingLineupsQuery(
    $startCursor: String
    $endCursor: String
    $withTraining: Boolean
    $limit: Int = 6
    $draft: Boolean
  ) {
    football {
      so5 {
        myUpcomingLineupsPaginated(
          after: $startCursor
          before: $endCursor
          first: $limit
          training: $withTraining
          draft: $draft
        ) {
          edges {
            cursor
            node {
              id
              ...Lineup_so5Lineup
              so5Leaderboard {
                slug
                ...Lineup_so5Leaderboard
              }
            }
          }
          pageInfo {
            endCursor
            startCursor
            hasNextPage
          }
        }
      }
    }
  }
  ${Lineup.fragments.so5Lineup}
  ${Lineup.fragments.so5Leaderboard}
`;

const LOBBY_LINEUPS_QUERY = gql`
  query LobbyLineupsQuery(
    $startCursor: String
    $endCursor: String
    $slug: String
    $type: So5State
    $draft: Boolean
    $limit: Int = 6
  ) {
    football {
      so5 {
        so5Fixture(type: $type, slug: $slug) {
          slug
          mySo5LineupsPaginated(
            after: $startCursor
            before: $endCursor
            first: $limit
            draft: $draft
          ) {
            edges {
              cursor
              node {
                id
                ...Lineup_so5Lineup
                so5Leaderboard {
                  slug
                  ...Lineup_so5Leaderboard
                }
              }
            }
            pageInfo {
              endCursor
              startCursor
              hasNextPage
            }
          }
        }
      }
    }
  }
  ${Lineup.fragments.so5Lineup}
  ${Lineup.fragments.so5Leaderboard}
`;

type Props = {
  type: So5State | null;
  slug: string | null;
  endCursor?: string | null;
  so5FixtureId?: string;
  so5LeaderboardSlug?: string | null;
  withTraining?: boolean;
  draft?: boolean;
  limit?: number;
  startCursor: string;
};
const useGetTeams = (variables: Props) => {
  const upcoming = variables.type === So5State.UPCOMING;
  const { data, loading, loadMore } = usePaginatedQuery<
    LobbyLineupsQuery & LobbyUpcomingLineupsQuery
  >(upcoming ? LOBBY_UPCOMING_LINEUPS_QUERY : LOBBY_LINEUPS_QUERY, {
    variables,
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    connection: 'So5LineupConnection',
  });
  return {
    data: upcoming
      ? data?.football.so5.myUpcomingLineupsPaginated
      : data?.football.so5.so5Fixture?.mySo5LineupsPaginated,
    loading,
    loadMore,
  };
};

export default useGetTeams;

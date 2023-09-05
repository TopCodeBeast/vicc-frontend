import { TypedDocumentNode, gql } from '@apollo/client';

import { Vicc5State } from '@sorare/core/src/__generated__/globalTypes';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';

import { Lineup } from '@football/components/lineup/Lineup';

import {
  LobbyLineupsQuery,
  LobbyLineupsQueryVariables,
  LobbyUpcomingLineupsQuery,
  LobbyUpcomingLineupsQueryVariables,
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
      vicc5 {
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
              ...Lineup_vicc5Lineup
              vicc5Leaderboard {
                slug
                ...Lineup_vicc5Leaderboard
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
  ${Lineup.fragments.vicc5Lineup}
  ${Lineup.fragments.vicc5Leaderboard}
` as TypedDocumentNode<
  LobbyUpcomingLineupsQuery,
  LobbyUpcomingLineupsQueryVariables
>;

const LOBBY_LINEUPS_QUERY = gql`
  query LobbyLineupsQuery(
    $startCursor: String
    $endCursor: String
    $slug: String
    $type: Vicc5State
    $draft: Boolean
    $limit: Int = 6
  ) {
    football {
      vicc5 {
        vicc5Fixture(type: $type, slug: $slug) {
          slug
          myVicc5LineupsPaginated(
            after: $startCursor
            before: $endCursor
            first: $limit
            draft: $draft
          ) {
            edges {
              cursor
              node {
                id
                ...Lineup_vicc5Lineup
                vicc5Leaderboard {
                  slug
                  ...Lineup_vicc5Leaderboard
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
  ${Lineup.fragments.vicc5Lineup}
  ${Lineup.fragments.vicc5Leaderboard}
` as TypedDocumentNode<LobbyLineupsQuery, LobbyLineupsQueryVariables>;

type Props = {
  type: Vicc5State | null;
  slug: string | null;
  endCursor?: string | null;
  vicc5FixtureId?: string;
  vicc5LeaderboardSlug?: string | null;
  withTraining?: boolean;
  draft?: boolean;
  limit?: number;
  startCursor: string;
};
const useGetTeams = (variables: Props) => {
  const upcoming = variables.type === Vicc5State.UPCOMING;
  const {
    data: upcomingData,
    loading: upcomingLoading,
    loadMore: upcomingLoadMore,
  } = usePaginatedQuery(LOBBY_UPCOMING_LINEUPS_QUERY, {
    variables,
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    connection: 'Vicc5LineupConnection',
    skip: !upcoming,
  });

  const { data, loading, loadMore } = usePaginatedQuery(LOBBY_LINEUPS_QUERY, {
    variables,
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    connection: 'Vicc5LineupConnection',
    skip: upcoming,
  });
  return upcoming
    ? {
        data: upcomingData?.football.vicc5.myUpcomingLineupsPaginated,
        loading: upcomingLoading,
        loadMore: upcomingLoadMore,
      }
    : {
        data: data?.football.vicc5.vicc5Fixture?.myVicc5LineupsPaginated,
        loading,
        loadMore,
      };
};

export default useGetTeams;

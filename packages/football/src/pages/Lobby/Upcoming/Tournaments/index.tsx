import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback } from 'react';
import styled from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import { CompetitionList } from '@football/pages/Lobby/Components/CompetitionList';

import {
  LobbyUpcomingTournamentsQuery,
  LobbyUpcomingTournamentsQueryVariables,
} from './__generated__/index.graphql';

export const LOBBY_UPCOMING_TOURNAMENTS_QUERY = gql`
  query LobbyUpcomingTournamentsQuery {
    #football {
      vicc5Root {
        upcomingLeaderboards {
          slug
          gameWeek
          ...CompetitionList_vicc5Leaderboard
        }
      }
      shopItems(first: 10, types: [EXTRA_TEAMS_CAP]) {
        nodes {
          ...CompetitionList_clubShopItem
        }
      }
    #}
  }
  ${CompetitionList.fragments.vicc5Leaderboard}
  ${CompetitionList.fragments.clubShopItem}
` as TypedDocumentNode<
  LobbyUpcomingTournamentsQuery,
  LobbyUpcomingTournamentsQueryVariables
>;

const Loading = styled.div`
  margin: 40px 0px;
`;

export const LobbyUpcomingTournaments = () => {
  const { data, refetch, loading } = useQuery(
    LOBBY_UPCOMING_TOURNAMENTS_QUERY,
    {
      nextFetchPolicy: 'cache-first',
      fetchPolicy: 'cache-and-network',
    }
  );

  const vicc5Leaderboards = data?.vicc5.upcomingLeaderboards;
  const extraTeamsCapItems = data?.shopItems.nodes;

  const refetchCb = useCallback(() => {
    refetch();
  }, [refetch]);

  if (!vicc5Leaderboards && loading) {
    return (
      <Loading>
        <LoadingIndicator />
      </Loading>
    );
  }

  if (!vicc5Leaderboards) {
    return null;
  }

  return (
    <CompetitionList
      vicc5Leaderboards={vicc5Leaderboards}
      refetch={refetchCb}
      extraTeamsCapItems={extraTeamsCapItems}
    />
  );
};

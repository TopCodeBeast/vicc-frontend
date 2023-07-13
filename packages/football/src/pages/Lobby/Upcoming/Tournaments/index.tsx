import { gql } from '@apollo/client';
import { useCallback } from 'react';
import styled from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import { CompetitionList } from '@football/pages/Lobby/Components/CompetitionList';

import { LobbyUpcomingTournamentsQuery } from './__generated__/index.graphql';

export const LOBBY_UPCOMING_TOURNAMENTS_QUERY = gql`
  query LobbyUpcomingTournamentsQuery {
    so5: vicc5Root {
      upcomingLeaderboards {
        slug
        gameWeek
        ...CompetitionList_so5Leaderboard
      }
    }
    shopItems(first: 10, types: [EXTRA_TEAMS_CAP]) {
      nodes {
        ...CompetitionList_clubShopItem
      }
    }
  }
  ${CompetitionList.fragments.so5Leaderboard}
  ${CompetitionList.fragments.clubShopItem}
`;

const Loading = styled.div`
  margin: 40px 0px;
`;

export const LobbyUpcomingTournaments = () => {
  const { data, refetch, loading } = useQuery<LobbyUpcomingTournamentsQuery>(
    LOBBY_UPCOMING_TOURNAMENTS_QUERY,
    {
      nextFetchPolicy: 'cache-first',
      fetchPolicy: 'cache-and-network',
    }
  );

  const so5Leaderboards = data?.so5.upcomingLeaderboards;
  const extraTeamsCapItems = data?.shopItems.nodes;

  const refetchCb = useCallback(() => {
    refetch();
  }, [refetch]);

  if (!so5Leaderboards && loading) {
    return (
      <Loading>
        <LoadingIndicator />
      </Loading>
    );
  }

  if (!so5Leaderboards) {
    return null;
  }

  return (
    <CompetitionList
      so5Leaderboards={so5Leaderboards}
      refetch={refetchCb}
      extraTeamsCapItems={extraTeamsCapItems}
    />
  );
};

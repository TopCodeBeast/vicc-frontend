import { useCallback } from 'react';
import { NavigateOptions } from 'react-router-dom';

import {
  FOOTBALL_COMPOSE_TEAM,
  getComposeTeamRoute,
} from '@sorare/core/src/constants/routes';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useNavigateWithDeeplink from '@sorare/core/src/hooks/useNavigateWithDeeplink';

import { RouteState } from '@football/types/routes';

const useNavigateToComposeTeam = () => {
  const navigateWithDeepLink = useNavigateWithDeeplink();

  return useCallback(
    ({
      leaderboardSlug,
      lineupId,
      options,
    }: {
      leaderboardSlug: string;
      lineupId?: string;
      options?: Pick<NavigateOptions, 'replace'> & {
        state?: RouteState[typeof FOOTBALL_COMPOSE_TEAM];
      };
    }) => {
      navigateWithDeepLink(
        getComposeTeamRoute({
          vicc5LeaderboardSlug: leaderboardSlug,
          vicc5LineupId: idFromObject(lineupId),
        }),
        options
      );
    },
    [navigateWithDeepLink]
  );
};

export default useNavigateToComposeTeam;

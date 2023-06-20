import { useEffect } from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';

import {
  ACTIVITY,
  FOOTBALL_CLUB_SHOW_WILDCARD,
  FOOTBALL_COMPOSE_TEAM,
  FOOTBALL_COMPOSE_TEAM_DRAFT,
  FOOTBALL_COUNTRY_SHOW,
  FOOTBALL_DRAFT,
  FOOTBALL_LEAGUE_SHOW_WILDCARD,
  FOOTBALL_ONBOARDING,
  FOOTBALL_ONBOARDING_WILDCARD,
  FOOTBALL_PLAYER_SHOW_WILDCARD,
  FOOTBALL_SCARCITIES,
  FOOTBALL_USER_GALLERY_WILDCARD,
  FOOTBALL_VIDEOS,
  INVITE_WILDCARD,
  MLB_WILDCARD,
  MY_SORARE_WILDCARD,
  NBA_WILDCARD,
  SETTINGS_WILDCARD,
} from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';

import { useActiveOnboarding } from 'hooks/onboarding/useActiveOnboarding';

export const useCheckRedirectToOnboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useCurrentUserContext();
  const onboardingNotCompleted = useActiveOnboarding();

  useEffect(() => {
    const onWhitelistedRoutes =
      matchPath('/', location.pathname) ||
      matchPath(FOOTBALL_COMPOSE_TEAM_DRAFT, location.pathname) ||
      matchPath(SETTINGS_WILDCARD, location.pathname) ||
      matchPath(ACTIVITY, location.pathname) ||
      matchPath(MY_SORARE_WILDCARD, location.pathname) ||
      matchPath(FOOTBALL_CLUB_SHOW_WILDCARD, location.pathname) ||
      matchPath(FOOTBALL_COUNTRY_SHOW, location.pathname) ||
      matchPath(FOOTBALL_LEAGUE_SHOW_WILDCARD, location.pathname) ||
      matchPath(FOOTBALL_PLAYER_SHOW_WILDCARD, location.pathname) ||
      matchPath(FOOTBALL_USER_GALLERY_WILDCARD, location.pathname) ||
      matchPath(NBA_WILDCARD, location.pathname) ||
      matchPath(MLB_WILDCARD, location.pathname) ||
      matchPath(INVITE_WILDCARD, location.pathname) ||
      matchPath(FOOTBALL_ONBOARDING_WILDCARD, location.pathname) ||
      matchPath(FOOTBALL_DRAFT, location.pathname) ||
      matchPath(FOOTBALL_COMPOSE_TEAM, location.pathname) ||
      matchPath(FOOTBALL_VIDEOS, location.pathname) ||
      matchPath(FOOTBALL_SCARCITIES, location.pathname);

    if (onWhitelistedRoutes) return;

    if (currentUser && onboardingNotCompleted) {
      navigate(FOOTBALL_ONBOARDING + location.search, { replace: true });
    }
  }, [
    onboardingNotCompleted,
    navigate,
    location.pathname,
    currentUser,
    location.search,
  ]);
};

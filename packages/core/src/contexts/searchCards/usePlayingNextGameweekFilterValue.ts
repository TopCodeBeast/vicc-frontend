import { useMemo } from 'react';

import useNextSo5FixtureTeams from '@core/hooks/config/useNextSo5FixtureTeams';
import { joinFiltersWithOr } from '@core/lib/algolia';

export default () => {
  const { nextSo5FixtureTeams } = useNextSo5FixtureTeams();

  const activeClubFilters = useMemo(
    () =>
      joinFiltersWithOr(
        nextSo5FixtureTeams.flatMap(playingTeam => [
          `active_club.slug:${playingTeam.slug}`,
          `active_national_team.slug:${playingTeam.slug}`,
        ])
      ),
    [nextSo5FixtureTeams]
  );

  return activeClubFilters;
};

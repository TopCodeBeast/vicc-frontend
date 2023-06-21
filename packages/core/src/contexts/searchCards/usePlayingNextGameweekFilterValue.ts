import { useMemo } from 'react';

import { useConfigContext } from '@core/contexts/config';
import { joinFiltersWithOr } from '@core/lib/algolia';

export default () => {
  const {
    so5: { nextSo5FixtureTeams },
  } = useConfigContext();

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

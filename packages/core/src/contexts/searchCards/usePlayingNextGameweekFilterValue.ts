import { useMemo } from 'react';

import { useConfigContext } from '@sorare/core/src/contexts/config';
import { joinFiltersWithOr } from '@sorare/core/src/lib/algolia';

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

import { useMemo } from 'react';

import useNextVicc5FixtureTeams from '@core/hooks/config/useNextSo5FixtureTeams';
import { joinFiltersWithOr } from '@core/lib/algolia';

export default () => {
  const { nextVicc5FixtureTeams } = useNextVicc5FixtureTeams();

  const activeClubFilters = useMemo(
    () =>
      joinFiltersWithOr(
        nextVicc5FixtureTeams.flatMap(playingTeam => [
          `active_club.slug:${playingTeam.slug}`,
          `active_national_team.slug:${playingTeam.slug}`,
        ])
      ),
    [nextVicc5FixtureTeams]
  );

  return activeClubFilters;
};

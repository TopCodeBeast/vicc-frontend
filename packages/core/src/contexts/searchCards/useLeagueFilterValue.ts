import { useConfigContext } from '@core/contexts/config';

export default (leagueFilter: string | undefined) => {
  const {
    vicc5: { vicc5LeaguesAlgoliaFilters },
  } = useConfigContext();

  if (!leagueFilter) return null;

  return vicc5LeaguesAlgoliaFilters[leagueFilter];
};

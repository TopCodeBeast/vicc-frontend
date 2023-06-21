import { useConfigContext } from '@core/contexts/config';

export default (leagueFilter: string | undefined) => {
  const {
    so5: { so5LeaguesAlgoliaFilters },
  } = useConfigContext();

  if (!leagueFilter) return null;

  return so5LeaguesAlgoliaFilters[leagueFilter];
};

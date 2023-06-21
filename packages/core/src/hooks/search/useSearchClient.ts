import algoliasearch from 'algoliasearch/lite';
import { useMemo } from 'react';

import { useConfigContext } from '@core/contexts/config';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import { getAlgoliaHosts } from '@core/lib/algolia';

const useSearchClient = () => {
  const { algoliaApplicationId, algoliaSearchApiKey } = useConfigContext();
  const {
    flags: { useAlgoliaGeoOptimizedReadReplica = false },
  } = useFeatureFlags();

  const searchClient = useMemo(() => {
    return algoliasearch(algoliaApplicationId, algoliaSearchApiKey, {
      hosts: getAlgoliaHosts(
        algoliaApplicationId,
        useAlgoliaGeoOptimizedReadReplica
      ),
    });
  }, [
    algoliaApplicationId,
    algoliaSearchApiKey,
    useAlgoliaGeoOptimizedReadReplica,
  ]);

  return searchClient;
};

export default useSearchClient;

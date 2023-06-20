import algoliasearchHelper, { SearchParameters } from 'algoliasearch-helper';
import { useEffect, useState } from 'react';

import useSearchClient from '@sorare/core/src/hooks/search/useSearchClient';

interface Props {
  index?: string;
  attribute: string;
  values?: string[];
  params?: SearchParameters;
  skip?: boolean;
}

const EMPTY: Record<string, number> = {};

const useFacetCounts = (props: Props) => {
  const { index, attribute, values, params, skip } = props;
  const [counts, setCounts] = useState<Record<string, number>>(EMPTY);
  const searchClient = useSearchClient();

  useEffect(() => {
    if (!index || skip) {
      return;
    }

    const baseParams = algoliasearchHelper(searchClient, index, {
      ...params,
    }).getQuery();

    const filteredORedAttribute = [...new Set(values)].map(
      v => `${attribute}:${v}`
    );

    searchClient
      .search([
        {
          indexName: index,
          type: 'default',
          params: {
            ...baseParams,
            analytics: false,
            facets: [attribute],
            distinct: false,
            hitsPerPage: 0,
            page: 0,
            maxValuesPerFacet:
              values?.length || baseParams.maxValuesPerFacet || 10,
            facetFilters: [
              filteredORedAttribute,
              ...((baseParams.facetFilters || []) as string[]),
            ],
          },
        },
      ])
      .then(({ results }) => {
        setCounts(results[0].facets?.[attribute] || {});
      });
  }, [attribute, index, searchClient, params, values, skip]);

  if (!index || skip) {
    return EMPTY;
  }

  return counts;
};

export default useFacetCounts;

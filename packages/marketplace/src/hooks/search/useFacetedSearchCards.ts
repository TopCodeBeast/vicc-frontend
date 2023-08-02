import algoliasearchHelper, { SearchParameters } from 'algoliasearch-helper';
import { SearchResponse } from 'algoliasearch-helper/types/algoliasearch';
import { useEffect, useState } from 'react';

import useSearchClient from '@sorare/core/src/hooks/search/useSearchClient';
import { joinFiltersWithAnd } from '@sorare/core/src/lib/algolia';

interface Props {
  index: string;
  facetFilters: string;
  distinct?: boolean;
  hitsPerPage?: number;
  params?: SearchParameters;
  attributesToRetrieve?: string[] | null;
  skip?: boolean;
}

const useFacetedSearchCards = (props: Props) => {
  const {
    index,
    facetFilters,
    distinct,
    hitsPerPage,
    attributesToRetrieve,
    params,
    skip,
  } = props;
  const [response, setResponse] = useState<SearchResponse<any>>();
  const searchClient = useSearchClient();

  useEffect(() => {
    if (skip) {
      return;
    }

    const baseParams = algoliasearchHelper(searchClient, index, {
      ...params,
    }).getQuery();

    searchClient
      .search([
        {
          indexName: index,
          type: 'default',
          params: {
            ...baseParams,
            analytics: false,
            // Force to unknown facets to workaround instantsearch bug
            facets: ['-'],
            ...(distinct !== undefined && { distinct }),
            ...(hitsPerPage !== undefined && { hitsPerPage }),
            ...(attributesToRetrieve && { attributesToRetrieve }),
            page: 0,
            filters: joinFiltersWithAnd(
              [baseParams.filters, facetFilters].filter(Boolean)
            ),
          },
        },
      ])
      .then(({ results }) => {
        setResponse(results[0]);
      });
  }, [
    index,
    searchClient,
    params,
    skip,
    distinct,
    facetFilters,
    hitsPerPage,
    attributesToRetrieve,
  ]);

  if (skip) {
    return null;
  }

  return response;
};

export default useFacetedSearchCards;

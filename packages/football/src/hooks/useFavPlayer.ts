import { TypedDocumentNode, gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react/hooks';

import { useConfigContext } from '@sorare/core/src/contexts/config';
import { joinFiltersWithAnd } from '@sorare/core/src/lib/algolia';

import useFacetedSearchCards from '@sorare/marketplace/src/hooks/search/useFacetedSearchCards';

import {
  myLastLineupQuery,
  myLastLineupQueryVariables,
} from './__generated__/useFavPlayer.graphql';

export const LAST_LINEUP_QUERY = gql`
  query myLastLineupQuery {
    #football {
      vicc5 {
        myUpcomingLineupsPaginated {
          nodes {
            name
            draft
            vicc5Appearances {
              captain
              card {
                slug
                assetId
                player {
                  slug
                  displayName
                }
              }
            }
          }
          totalCount
        }
      }
    #}
  }
` as TypedDocumentNode<myLastLineupQuery, myLastLineupQueryVariables>;
const useFavPlayer = ({ skip = false }: { skip?: boolean }) => {
  const { algoliaCardIndexes } = useConfigContext();

  const { data } = useQuery(LAST_LINEUP_QUERY, { skip });

  const card =
    data?.vicc5.myUpcomingLineupsPaginated.nodes[0]?.vicc5Appearances.find(
      vicc5Appearance => vicc5Appearance.captain
    )?.card;

  const myCaptainHits = useFacetedSearchCards({
    index: algoliaCardIndexes['Popular Player'],
    distinct: true,
    facetFilters: joinFiltersWithAnd([
      'sport:football',
      `player.slug:${card?.player.slug}`,
      'on_sale:true',
      'sale.primary:false',
      'sale.bundled:false',
    ]),
    hitsPerPage: 1,
    skip: !card?.player.slug || skip,
  });

  const popularPlayer = useFacetedSearchCards({
    index: algoliaCardIndexes['Popular Player'],
    distinct: true,
    facetFilters: joinFiltersWithAnd([
      'sport:football',
      'on_sale:true',
      'sale.primary:false',
      'sale.bundled:false',
    ]),
    hitsPerPage: 1,
    skip,
  });
  return myCaptainHits?.hits[0]?.player || popularPlayer?.hits[0]?.player;
};

export default useFavPlayer;

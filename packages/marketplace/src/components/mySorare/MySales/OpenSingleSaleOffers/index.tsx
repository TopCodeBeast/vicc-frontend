import { TypedDocumentNode, gql } from '@apollo/client';

import {
  SortingOption,
  Sport,
} from '@sorare/core/src/__generated__/globalTypes';
import { extractConnectionData } from '@sorare/core/src/gql/extractData';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';

import { Sale } from '@marketplace/components/sale/Sale';

import DisplayItems from '../../common/DisplayItems';
import { OpenSaleSortType } from '../../common/types';
import {
  OpenSaleOffersQuery,
  OpenSaleOffersQueryVariables,
} from './__generated__/index.graphql';

const OPEN_SALE_OFFERS_QUERY = gql`
  query OpenSaleOffersQuery(
    $cursor: String
    $sortByEndDate: SortingOption
    $sport: [Sport!]
  ) {
    currentUser {
      slug
      liveSingleSaleOffers(
        first: 10
        after: $cursor
        sortByEndDate: $sortByEndDate
        sport: $sport
      ) {
        totalCount
        nodes {
          id
          ...Sale_offer
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${Sale.fragments.offer}
` as TypedDocumentNode<OpenSaleOffersQuery, OpenSaleOffersQueryVariables>;

const OpenSingleSaleOffers = ({
  sortType,
  sport,
}: {
  sortType: OpenSaleSortType;
  sport: Sport[];
}) => {
  const sortByEndDate =
    sortType === OpenSaleSortType.NEWLY_LISTED
      ? SortingOption.DESC
      : SortingOption.ASC;

  const { loading, data, loadMore } = usePaginatedQuery(
    OPEN_SALE_OFFERS_QUERY,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      connection: 'TokenOfferConnection',
      variables: {
        sortByEndDate,
        sport,
      },
    }
  );

  if (!data?.currentUser) return null;
  const { items, count, cursor, hasMore } = extractConnectionData(
    data?.currentUser?.liveSingleSaleOffers,
    p => <Sale key={p.id} sale={p} />
  );

  const displayLoading = !items && loading;

  return (
    <DisplayItems
      displayLoading={displayLoading}
      count={count}
      items={items}
      loadMoreSection={{
        hasMore,
        loading,
        loadMore: () => {
          loadMore(false, {
            cursor,
            sortByEndDate,
            sport,
          });
        },
      }}
    />
  );
};

export default OpenSingleSaleOffers;

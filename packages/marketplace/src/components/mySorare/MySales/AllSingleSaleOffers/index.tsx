import { TypedDocumentNode, gql } from '@apollo/client';

import {
  SortingOption,
  Sport,
} from '@sorare/core/src/__generated__/globalTypes';
import { extractConnectionData } from '@sorare/core/src/gql/extractData';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';

import { Sale } from '@marketplace/components/sale/Sale';

import DisplayItems from '../../common/DisplayItems';
import { DefaultSortType } from '../../common/types';
import {
  AllSaleOffersQuery,
  AllSaleOffersQueryVariables,
} from './__generated__/index.graphql';

const ALL_SALE_OFFERS_QUERY = gql`
  query AllSaleOffersQuery(
    $cursor: String
    $sortByEndDate: SortingOption
    $sport: [Sport!]
  ) {
    currentUser {
      slug
      singleSaleTokenOffers(
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
` as TypedDocumentNode<AllSaleOffersQuery, AllSaleOffersQueryVariables>;

const AllSingleSaleOffers = ({
  sortType,
  sport,
}: {
  sortType: DefaultSortType;
  sport: Sport[];
}) => {
  const sortByEndDate =
    sortType === DefaultSortType.LATEST
      ? SortingOption.DESC
      : SortingOption.ASC;
  const { loading, data, loadMore } = usePaginatedQuery(ALL_SALE_OFFERS_QUERY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    connection: 'TokenOfferConnection',
    variables: {
      sortByEndDate,
      sport,
    },
  });

  const { items, count, cursor, hasMore } = extractConnectionData(
    data?.currentUser?.singleSaleTokenOffers,
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

export default AllSingleSaleOffers;

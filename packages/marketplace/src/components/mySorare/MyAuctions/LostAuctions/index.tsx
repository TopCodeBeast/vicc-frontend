import { TypedDocumentNode, gql } from '@apollo/client';

import {
  SortingOption,
  Sport,
} from '@sorare/core/src/__generated__/globalTypes';
import { extractConnectionData } from '@sorare/core/src/gql/extractData';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';

import { Auction } from '@marketplace/components/auction/Auction';

import DisplayItems from '../../common/DisplayItems';
import { DefaultSortType } from '../../common/types';
import {
  LostTokenAuctionsQuery,
  LostTokenAuctionsQueryVariables,
} from './__generated__/index.graphql';

const LOST_TOKEN_AUCTIONS_QUERY = gql`
  query LostTokenAuctionsQuery(
    $cursor: String
    $sortByEndDate: SortingOption
    $sport: [Sport!]
  ) {
    currentUser {
      slug
      lostTokenAuctions(
        first: 10
        after: $cursor
        sortByEndDate: $sortByEndDate
        sport: $sport
      ) {
        totalCount
        nodes {
          id
          ...Auction_auction
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${Auction.fragments.auction}
` as TypedDocumentNode<LostTokenAuctionsQuery, LostTokenAuctionsQueryVariables>;

const LostAuctions = ({
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
  const { loading, data, loadMore } = usePaginatedQuery(
    LOST_TOKEN_AUCTIONS_QUERY,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      connection: 'TokenAuctionConnection',
      variables: {
        sortByEndDate,
        sport,
      },
    }
  );

  const { items, count, cursor, hasMore } = extractConnectionData(
    data?.currentUser?.lostTokenAuctions,
    p => <Auction key={p.id} auction={p} />
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

export default LostAuctions;

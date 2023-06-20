import { gql } from '@apollo/client';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';

import BidHistory from '@sorare/marketplace/src/components/auction/BidHistory';

import {
  AuctionOwnershipDetailsQuery,
  AuctionOwnershipDetailsQueryVariables,
} from './__generated__/index.graphql';

interface Props {
  auction: { id: string };
}

const AUCTION_OWNERSHIP_DETAILS_QUERY = gql`
  query AuctionOwnershipDetailsQuery($id: String!, $bidCursor: String) {
    tokens {
      auction(id: $id) {
        id
        bids(first: 5, after: $bidCursor) {
          ...BidHistory_tokenBidConnection
        }
      }
    }
  }
  ${BidHistory.fragments.bid}
`;

export const AuctionOwnershipDetails = ({ auction }: Props) => {
  const {
    data,
    loading,
    loadMore: loadMoreBids,
  } = usePaginatedQuery<
    AuctionOwnershipDetailsQuery,
    AuctionOwnershipDetailsQueryVariables
  >(AUCTION_OWNERSHIP_DETAILS_QUERY, {
    variables: {
      id: idFromObject(auction.id)!,
    },
    connection: 'TokenBidConnection',
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
  });

  if (!data) return <LoadingIndicator />;

  return (
    <BidHistory
      bids={data?.tokens.auction.bids}
      loadMoreBids={loadMoreBids}
      loading={loading}
      skipFirst
      displayAbsoluteDate
    />
  );
};

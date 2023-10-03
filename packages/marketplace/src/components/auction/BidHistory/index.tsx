import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import LoadingMoreButton from '@sorare/core/src/atoms/buttons/LoadMoreButton';

import Bid from '../Bid';
import { BidHistory_tokenBidConnection } from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const Button = styled.div`
  align-self: center;
`;

interface Props {
  loadMoreBids: (
    reload: boolean,
    variable: { bidCursor: string }
  ) => Promise<any>;
  bids: BidHistory_tokenBidConnection;
  loading: boolean;
  skipFirst?: boolean;
  displayAbsoluteDate?: boolean;
}

const BidHistory = ({
  bids,
  loading,
  loadMoreBids,
  skipFirst = false,
  displayAbsoluteDate = false,
}: Props) => {
  const { hasNextPage, endCursor } = bids.pageInfo;

  if (bids.nodes.length === 0) return null;

  const list = skipFirst ? bids.nodes.slice(1) : bids.nodes;

  return (
    <Root>
      <div>
        {list.map(bid => (
          <Bid
            bid={bid}
            key={bid.id}
            displayAbsoluteDate={displayAbsoluteDate}
          />
        ))}
      </div>
      {hasNextPage && (
        <Button>
          <LoadingMoreButton
            hasMore={hasNextPage}
            loading={loading}
            loadMore={() => {
              loadMoreBids(false, { bidCursor: endCursor! });
            }}
          />
        </Button>
      )}
    </Root>
  );
};

BidHistory.fragments = {
  bid: gql`
    fragment BidHistory_tokenBidConnection on BidConnection {
      nodes {
        id
        ...Bid_tokenBid
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
    ${Bid.fragments.tokenBid}
  ` as TypedDocumentNode<BidHistory_tokenBidConnection>,
};

export default BidHistory;

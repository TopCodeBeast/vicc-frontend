import { TypedDocumentNode, gql, useLazyQuery } from '@apollo/client';
import { getUnixTime, parseISO } from 'date-fns';
import { useEffect } from 'react';
import { usePageVisibility } from 'react-page-visibility';

import idFromObject from '@sorare/core/src/gql/idFromObject';

import useBestBidBelongsToUser from '@marketplace/hooks/auctions/useBestBidBelongsToUser';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import BidHistory from '../BidHistory';
import {
  TokenAuctionLeaderQuery,
  TokenAuctionLeaderQueryVariables,
  UsePollAuction_auction,
} from './__generated__/index.graphql';

const TOKEN_AUCTION_LEADER_QUERY = gql`
  query TokenAuctionLeaderQuery($id: String!) {
    tokens {
      auction(id: $id) {
        id
        open
        bids(first: 5) {
          ...BidHistory_tokenBidConnection
        }
      }
    }
  }
  ${BidHistory.fragments.bid}
` as TypedDocumentNode<
  TokenAuctionLeaderQuery,
  TokenAuctionLeaderQueryVariables
>;

const usePollAuction = (auction?: UsePollAuction_auction | null) => {
  const [refetch] = useLazyQuery(TOKEN_AUCTION_LEADER_QUERY, {
    fetchPolicy: 'network-only',
  });

  const bestBidBelongsToUser = useBestBidBelongsToUser();

  const isVisible = usePageVisibility();

  const isBestBidBelongsToUser =
    auction?.open && auction?.bestBid && bestBidBelongsToUser(auction.bestBid);

  const endDate = auction?.endDate;

  const auctionId = idFromObject(auction?.id) || '';

  useEffect(() => {
    if (!isBestBidBelongsToUser || !isVisible) {
      return () => {};
    }

    const pollIn =
      (getUnixTime(parseISO(endDate as string)) -
        getUnixTime(new Date()) -
        60) *
      1000;

    let interval: ReturnType<typeof setInterval>;
    const timer = setTimeout(
      () => {
        interval = setInterval(() => {
          refetch({
            variables: {
              id: auctionId,
            },
          });
        }, 15000);
      },
      pollIn > 0 ? pollIn : 0
    );

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isBestBidBelongsToUser, endDate, refetch, auctionId, isVisible]);
};

usePollAuction.fragments = {
  auction: gql`
    fragment UsePollAuction_auction on Auction {
      id
      open
      endDate
      bestBid {
        id
        ...UseBestBidBelongsToUser_bestBid
      }
    }
    ${useBestBidBelongsToUser.fragments.bestBid}
  ` as TypedDocumentNode<UsePollAuction_auction>,
};

export default usePollAuction;

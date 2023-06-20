import { gql, useLazyQuery } from '@apollo/client';
import Big from 'bignumber.js';
import { useEffect } from 'react';

import idFromObject from '@sorare/core/src/gql/idFromObject';

import useBestBidBelongsToUser from '@sorare/marketplace/src/hooks/auctions/useBestBidBelongsToUser';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import {
  TokenAuctionBestBidQuery,
  TokenAuctionBestBidQueryVariables,
  usePollAuctionBestBid_auction,
} from './__generated__/index.graphql';

const TOKEN_AUCTION_BEST_BID_QUERY = gql`
  query TokenAuctionBestBidQuery($id: String!) {
    tokens {
      auction(id: $id) {
        id
        privateMinNextBid
        minNextBid
        currentPrice
        privateCurrentPrice
        bestBid {
          id
          amount
          ...UseBestBidBelongsToUser_bestBid
        }
        myBestBid {
          id
          maximumAmount
        }
        myLastBid {
          id
        }
      }
    }
  }
  ${useBestBidBelongsToUser.fragments.bestBid}
`;

const usePollAuctionBestBid = (
  enabled: boolean,
  auction: usePollAuctionBestBid_auction,
  weiAmount: string,
  cb: (winning: boolean) => void
) => {
  const [refetch] = useLazyQuery<
    TokenAuctionBestBidQuery,
    TokenAuctionBestBidQueryVariables
  >(TOKEN_AUCTION_BEST_BID_QUERY, { fetchPolicy: 'network-only' });

  const bestBidBelongsToUser = useBestBidBelongsToUser();

  const bigWeiAmount = new Big(weiAmount);
  const { bestBid, myBestBid } = auction;
  const userWinning = bestBid && bestBidBelongsToUser(bestBid);
  const bidWinning =
    myBestBid?.maximumAmount &&
    new Big(myBestBid.maximumAmount).eq(bigWeiAmount) &&
    userWinning;
  const bidOutBidded =
    bestBid?.amount &&
    new Big(bestBid.amount).gte(bigWeiAmount) &&
    !userWinning;
  const shouldStop = bidWinning || bidOutBidded;

  const auctionId = idFromObject(auction?.id) || '';

  useEffect(() => {
    if (!enabled) {
      return () => {};
    }

    if (shouldStop) {
      cb(!!bidWinning);
      return () => {};
    }

    const interval = setInterval(() => {
      refetch({
        variables: {
          id: auctionId,
        },
      });
    }, 300);

    return () => {
      clearInterval(interval);
    };
  }, [enabled, shouldStop, cb, bidWinning, refetch, auctionId]);
};

usePollAuctionBestBid.fragments = {
  auction: gql`
    fragment usePollAuctionBestBid_auction on TokenAuction {
      id
      bestBid {
        id
        amount
        ...UseBestBidBelongsToUser_bestBid
      }
      myBestBid {
        id
        maximumAmount
      }
    }
    ${useBestBidBelongsToUser.fragments.bestBid}
  `,
};

export default usePollAuctionBestBid;

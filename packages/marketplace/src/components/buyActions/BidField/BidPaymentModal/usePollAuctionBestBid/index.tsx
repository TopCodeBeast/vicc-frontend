import { TypedDocumentNode, gql, useLazyQuery } from '@apollo/client';
import Big from 'bignumber.js';
import { useEffect, useMemo } from 'react';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useMonetaryAmount, {
  MonetaryAmountOutput,
} from '@sorare/core/src/hooks/useMonetaryAmount';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import useBestBidBelongsToUser from '@marketplace/hooks/auctions/useBestBidBelongsToUser';

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
        currency
        bestBid {
          id
          amounts {
            ...MonetaryAmountFragment_monetaryAmount
          }
          ...UseBestBidBelongsToUser_bestBid
        }
        myBestBid {
          id
          fiatPayment
          maximumAmounts {
            ...MonetaryAmountFragment_monetaryAmount
          }
        }
        myLastBid {
          id
        }
      }
    }
  }
  ${monetaryAmountFragment}
  ${useBestBidBelongsToUser.fragments.bestBid}
` as TypedDocumentNode<
  TokenAuctionBestBidQuery,
  TokenAuctionBestBidQueryVariables
>;

const usePollAuctionBestBid = (
  enabled: boolean,
  auction: usePollAuctionBestBid_auction,
  monetaryAmount: MonetaryAmountOutput | null,
  cb: (winning: boolean) => void
) => {
  const { toMonetaryAmount } = useMonetaryAmount();
  const [refetch] = useLazyQuery(TOKEN_AUCTION_BEST_BID_QUERY, {
    fetchPolicy: 'network-only',
  });

  const bestBidBelongsToUser = useBestBidBelongsToUser();

  const { bestBid, myBestBid } = auction;
  const userWinning = bestBid && bestBidBelongsToUser(bestBid);

  const myBestBidReferenceCurrency =
    myBestBid?.maximumAmounts?.referenceCurrency;
  const myBestBidReferenceCurrencyIndex =
    myBestBidReferenceCurrency?.toLowerCase() as keyof MonetaryAmountOutput;
  const myBestBidMonetaryAmount =
    myBestBid?.maximumAmounts &&
    toMonetaryAmount({
      ...myBestBid.maximumAmounts,
    });

  const bestBidReferenceCurrency = bestBid?.amounts?.referenceCurrency;
  const bestBidReferenceCurrencyIndex =
    bestBidReferenceCurrency?.toLowerCase() as keyof MonetaryAmountOutput;
  const bestBidMonetaryAmount =
    bestBid?.amounts &&
    toMonetaryAmount({
      ...bestBid.amounts,
    });

  const bidWinning =
    myBestBidReferenceCurrency &&
    myBestBidMonetaryAmount &&
    monetaryAmount &&
    myBestBidMonetaryAmount[myBestBidReferenceCurrencyIndex] ===
      monetaryAmount[myBestBidReferenceCurrencyIndex] &&
    userWinning;

  const bidOutBidded = useMemo(() => {
    if (!monetaryAmount || !bestBidMonetaryAmount) {
      return false;
    }
    if (!bestBidReferenceCurrency) return false;
    if (bestBidReferenceCurrency === SupportedCurrency.WEI) {
      return (
        new Big(bestBidMonetaryAmount.wei).gte(monetaryAmount.wei) &&
        !userWinning
      );
    }
    return (
      bestBidMonetaryAmount[bestBidReferenceCurrencyIndex] >=
        monetaryAmount[bestBidReferenceCurrencyIndex] && !userWinning
    );
  }, [
    bestBidMonetaryAmount,
    bestBidReferenceCurrency,
    bestBidReferenceCurrencyIndex,
    monetaryAmount,
    userWinning,
  ]);

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
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [enabled, shouldStop, cb, bidWinning, refetch, auctionId]);
};

usePollAuctionBestBid.fragments = {
  auction: gql`
    fragment usePollAuctionBestBid_auction on Auction {
      id
      bestBid {
        id
        amounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
        ...UseBestBidBelongsToUser_bestBid
      }
      myBestBid {
        id
        maximumAmounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
      }
    }
    ${monetaryAmountFragment}
    ${useBestBidBelongsToUser.fragments.bestBid}
  ` as TypedDocumentNode<usePollAuctionBestBid_auction>,
};

export default usePollAuctionBestBid;

import { gql, useLazyQuery } from '@apollo/client';
import Big from 'bignumber.js';
import { useEffect, useMemo } from 'react';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useMonetaryAmount, {
  MonetaryAmountOutput,
} from '@sorare/core/src/hooks/useMonetaryAmount';

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
            eur
            gbp
            usd
            wei
            referenceCurrency
          }
          ...UseBestBidBelongsToUser_bestBid
        }
        myBestBid {
          id
          fiatPayment
          maximumAmount
          maximumAmounts {
            eur
            gbp
            usd
            wei
            referenceCurrency
          }
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
  monetaryAmount: MonetaryAmountOutput | null,
  cb: (winning: boolean) => void
) => {
  const { toMonetaryAmount } = useMonetaryAmount();
  const [refetch] = useLazyQuery<
    TokenAuctionBestBidQuery,
    TokenAuctionBestBidQueryVariables
  >(TOKEN_AUCTION_BEST_BID_QUERY, { fetchPolicy: 'network-only' });

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
        amounts {
          eur
          gbp
          usd
          wei
          referenceCurrency
        }
        ...UseBestBidBelongsToUser_bestBid
      }
      myBestBid {
        id
        maximumAmounts {
          eur
          gbp
          usd
          wei
          referenceCurrency
        }
      }
    }
    ${useBestBidBelongsToUser.fragments.bestBid}
  `,
};

export default usePollAuctionBestBid;

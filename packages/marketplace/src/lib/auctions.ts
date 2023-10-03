import { TypedDocumentNode, gql } from '@apollo/client';
import Big from 'bignumber.js';

import { withFragments } from '@sorare/core/src/gql';
import {
  MonetaryAmountParams,
  monetaryAmountFragment,
} from '@sorare/core/src/lib/monetaryAmount';

import { auctionCurrentPrice_auction } from './__generated__/auctions.graphql';

export const auctionCurrentPrice = withFragments(
  (auction: auctionCurrentPrice_auction): MonetaryAmountParams => {
    const { currentPrice, privateCurrentPrice, currency, myBestBid } = auction;
    if (myBestBid) {
      const { maximumAmounts } = myBestBid;
      return maximumAmounts;
    }
    return {
      referenceCurrency: currency,
      [currency.toLowerCase()]: new Big(privateCurrentPrice).gt(currentPrice)
        ? privateCurrentPrice
        : currentPrice,
    };
  },
  {
    auction: gql`
      fragment auctionCurrentPrice_auction on Auction {
        id
        currentPrice
        privateCurrentPrice
        currency
        myBestBid {
          id
          maximumAmounts {
            ...MonetaryAmountFragment_monetaryAmount
          }
        }
      }
      ${monetaryAmountFragment}
    ` as TypedDocumentNode<auctionCurrentPrice_auction>,
  }
);

export const auctionMinNextBid = (auction: {
  minNextBid: string;
  privateMinNextBid: string;
}) => {
  const { minNextBid, privateMinNextBid } = auction;
  return new Big(privateMinNextBid).gt(minNextBid)
    ? privateMinNextBid
    : minNextBid;
};

export const promotionalEventsExcludeSpecialRewardBadge = [
  'All-Star Game Weekend',
];

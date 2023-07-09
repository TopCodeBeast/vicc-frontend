import { gql } from '@apollo/client';
import Big from 'bignumber.js';

import { withFragments } from '@sorare/core/src/gql';

export const auctionCurrentPrice = withFragments(
  (auction: { currentPrice: string; privateCurrentPrice: string }) => {
    const { currentPrice, privateCurrentPrice } = auction;
    return new Big(privateCurrentPrice).gt(currentPrice)
      ? privateCurrentPrice
      : currentPrice;
  },
  {
    auction: gql`
      fragment auctionCurrentPrice_auction on TokenAuction {
        id
        currentPrice
        privateCurrentPrice
      }
    `,
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

import { TypedDocumentNode, gql } from '@apollo/client';
import { add, isFuture, isPast, parseISO } from 'date-fns';

import useForceUpdateAfterEndDate from '@sorare/core/src/hooks/useForceUpdateAfterEndDate';

import { auctionCurrentPrice } from '@marketplace/lib/auctions';

import { useGetAuctionDetails_auction } from './__generated__/useGetAuctionDetails.graphql';

const useGetAuctionDetails = (auction: useGetAuctionDetails_auction | null) => {
  const endDateString = auction?.endDate;
  const endDate = (endDateString && parseISO(endDateString)) as null | Date;
  useForceUpdateAfterEndDate(endDate);
  if (!auction) return undefined;
  const price = auctionCurrentPrice(auction);

  // Simplified, check for regression
  const auctionIsOnSale = isFuture(
    add(parseISO(auction?.endDate), { seconds: 15 })
  );

  if (auctionIsOnSale && price && endDate) {
    const ended = isPast(endDate);
    return {
      endDate,
      ended,
      price,
      currency: auction?.currency,
    };
  }
  return undefined;
};

useGetAuctionDetails.fragments = {
  auction: gql`
    fragment useGetAuctionDetails_auction on Auction {
      id
      endDate
      currentPrice
      privateCurrentPrice
      currency
      ...auctionCurrentPrice_auction
    }
    ${auctionCurrentPrice.fragments.auction}
  ` as TypedDocumentNode<useGetAuctionDetails_auction>,
};

export default useGetAuctionDetails;

import { gql } from '@apollo/client';
import { add, isFuture, isPast, parseISO } from 'date-fns';

import useForceUpdateAfterEndDate from '@sorare/core/src/hooks/useForceUpdateAfterEndDate';

import { auctionCurrentPrice } from '@sorare/marketplace/src/lib/auctions';

import { useGetAuctionDetails_auction } from './__generated__/useGetAuctionDetails.graphql';

const useGetAuctionDetails = (auction: useGetAuctionDetails_auction | null) => {
  const endDateString = auction?.endDate;
  const endDate = (endDateString && parseISO(endDateString)) as null | Date;
  useForceUpdateAfterEndDate(endDate);
  if (!auction) return undefined;
  const weiPrice = auctionCurrentPrice(auction);

  // Simplified, check for regression
  const auctionIsOnSale = isFuture(
    add(parseISO(auction?.endDate), { seconds: 15 })
  );

  if (auctionIsOnSale && weiPrice && endDate) {
    const ended = isPast(endDate);
    return {
      endDate,
      ended,
      weiPrice,
    };
  }
  return undefined;
};

useGetAuctionDetails.fragments = {
  auction: gql`
    fragment useGetAuctionDetails_auction on TokenAuction {
      id
      endDate
      currentPrice
      privateCurrentPrice
    }
  `,
};

export default useGetAuctionDetails;

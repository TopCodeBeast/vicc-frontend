import { TypedDocumentNode, gql } from '@apollo/client';
import { isPast, parseISO } from 'date-fns';
import { useMemo } from 'react';

import {
  ConversionCreditWithAmounts,
  conversionCreditFragment,
} from '@core/hooks/useConversionCredit';
import useMonetaryAmount from '@core/hooks/useMonetaryAmount';

import { useAuctionConversionCredit_auction } from './__generated__/useAuctionConversionCredit.graphql';

export const useAuctionConversionCredit = (
  auction?: useAuctionConversionCredit_auction
): ConversionCreditWithAmounts | undefined => {
  const { toMonetaryAmount } = useMonetaryAmount();

  const conversionCredit = useMemo(() => {
    if (!auction) return undefined;

    const credit = auction.myBestBid?.conversionCredit;
    if (!credit || isPast(parseISO(credit.endDate))) {
      return undefined;
    }

    const amounts = toMonetaryAmount(credit.maxDiscount);
    return {
      ...credit,
      maxDiscount: amounts,
    };
  }, [auction, toMonetaryAmount]);

  return conversionCredit as ConversionCreditWithAmounts;
};

useAuctionConversionCredit.fragments = {
  auction: gql`
    fragment useAuctionConversionCredit_auction on Auction {
      id
      myBestBid {
        id
        conversionCredit {
          ...useConversionCredit_conversionCredit
        }
      }
    }
    ${conversionCreditFragment}
  ` as TypedDocumentNode<useAuctionConversionCredit_auction>,
};

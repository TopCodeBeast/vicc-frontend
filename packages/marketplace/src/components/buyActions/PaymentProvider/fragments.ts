import { TypedDocumentNode, gql } from '@apollo/client';

import { useAuctionConversionCredit } from '@sorare/core/src/hooks/useAuctionConversionCredit';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import AuctionState from '../BidField/AuctionState';
import { PaymentProvider_auction } from './__generated__/fragments.graphql';

export const fragments = {
  auction: gql`
    fragment PaymentProvider_auction on Auction {
      id
      blockchainId
      autoBid
      myBestBid {
        id
        fiatPayment
        maximumAmounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
      }
      ...AuctionState_tokenAuction
      ...useAuctionConversionCredit_auction
    }
    ${monetaryAmountFragment}
    ${AuctionState.fragments.tokenAuction}
    ${useAuctionConversionCredit.fragments.auction}
  ` as TypedDocumentNode<PaymentProvider_auction>,
};

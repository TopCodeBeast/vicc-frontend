import { gql } from '@apollo/client';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import AuctionState from '../BidField/AuctionState';

export const fragments = {
  paymentIntent: gql`
    fragment PaymentProvider_paymentIntent on PaymentIntent {
      id
      clientSecret
      amount
      paymentMethod
    }
  `,
  auction: gql`
    fragment PaymentProvider_auction on TokenAuction {
      id
      blockchainId
      autoBid
      myBestBid {
        id
        fiatPayment
        maximumAmount
        maximumAmounts {
          eur
          gbp
          referenceCurrency
          usd
          wei
        }
      }
      ...AuctionState_tokenAuction
    }
    ${AuctionState.fragments.tokenAuction}
  `,
};

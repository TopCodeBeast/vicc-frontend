import { defineMessages } from 'react-intl';

export const tokenPageMessages = defineMessages({
  blockchainInfoTitle: {
    id: 'BlockchainInfo.title',
    defaultMessage: 'Token details',
  },
  bidCount: {
    id: 'BidHistory.bidCount',
    defaultMessage: '{count, plural, one {# Bid} other {# Bids}}',
  },
  ownershipHistoryTitle: {
    id: 'OwnershipHistory.title',
    defaultMessage: 'Card history',
  },
  last5Sales: {
    id: 'priceHistory.recentSales',
    defaultMessage: 'Last {rarity} sales',
  },
  alsoAvailableOnPrimary: {
    id: 'alsoAvailableOnPrimary.title',
    defaultMessage: 'Also available on auctions',
  },
});

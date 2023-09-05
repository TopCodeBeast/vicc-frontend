import { MessageDescriptor, defineMessages } from 'react-intl';

import { navLabels } from '@sorare/core/src/lib/glossary';

export enum MyViccPage {
  NEW = 'new',
  AUCTIONS = 'auctions',
  PURCHASES = 'purchases',
  SALES = 'sales',
  OFFERS_RECEIVED = 'offers_received',
  OFFERS_SENT = 'offers_sent',
  FOLLOWS = 'follows',
  PLAYERS_NOTIFICATIONS = 'players_notifications',
  TRANSACTIONS = 'transactions',
}

export const DEFAULT_PAGE_ID: MyViccPage = MyViccPage.NEW;

export const TITLES: { [key in MyViccPage]: MessageDescriptor } = {
  new: navLabels.new,
  auctions: navLabels.myAuctions,
  sales: navLabels.myListings,
  purchases: navLabels.myPurchases,
  offers_received: navLabels.myOffersReceived,
  offers_sent: navLabels.myOffersSent,
  follows: navLabels.myFollows,
  players_notifications: navLabels.myPlayerNotifications,
  transactions: navLabels.myTransactions,
};

export const HEADERS: { [key in MyViccPage]: MessageDescriptor } = {
  ...TITLES,
  ...defineMessages({
    purchases: {
      id: 'MyVicc.cardsFromManagerSales',
      defaultMessage: 'Cards Bought Off Manager Sales',
    },
    offers_received: {
      id: 'MyVicc.direct_offers_received',
      defaultMessage: 'Direct Offers Received',
    },
    offers_sent: {
      id: 'MyVicc.direct_offers_sent',
      defaultMessage: 'Direct Offers Sent',
    },
  }),
};

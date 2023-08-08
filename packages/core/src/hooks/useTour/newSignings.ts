import { defineMessages } from 'react-intl';

export const steps = ['filters', 'cards'] as const;

export const messages = defineMessages({
  filters: {
    id: 'useTour.newSignings.filters',
    defaultMessage: 'Use these filters to scout the player you want!',
  },
  cards: {
    id: 'useTour.newSignings.Cards',
    defaultMessage:
      'Here is the current bidding price and the remaining auction time. Every time you are outbid during an auction, you are refunded. You only pay if you win the auction.',
  },
});

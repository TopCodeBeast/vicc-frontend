import { defineMessages } from 'react-intl';

export const steps = ['filters', 'cards'] as const;

export const messages = defineMessages({
  filters: {
    id: 'useTour.transferMarket.filters',
    defaultMessage: 'Use these filters to scout the player you want!',
  },
  cards: {
    id: 'useTour.transferMarket.cards',
    defaultMessage:
      'Here you can find the current asking price, and the time remaining on the listing',
  },
});

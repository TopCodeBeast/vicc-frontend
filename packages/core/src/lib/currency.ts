import { defineMessages } from 'react-intl';

export enum Currency {
  ETH = 'ETH',
  FIAT = 'FIAT',
}

export const messages = defineMessages({
  [Currency.FIAT]: {
    id: 'PaymentBox.fiat',
    defaultMessage: 'Credit card',
  },
  [Currency.ETH]: {
    id: 'PaymentBox.eth',
    defaultMessage: 'ETH',
  },
});

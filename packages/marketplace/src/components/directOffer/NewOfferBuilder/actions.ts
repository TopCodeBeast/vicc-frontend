import { Currency } from '@sorare/core/src/__generated__/globalTypes';
import { CardHit } from '@sorare/core/src/lib/algolia';

import { WalletPaymentMethod } from 'components/buyActions/PaymentProvider/types';

import {
  CardData,
  CardDataType,
  RefreshCardData,
  SetCurrencyAndPaymentMethod,
  SetDuration,
  SetReceiveEth,
  SetSendEth,
  SetStage,
  UpdateReceiveCards,
  UpdateSendCards,
} from './types';

export const refreshCardData = <T extends CardDataType>(
  newCardData: CardData<T>
): RefreshCardData<T> => ({
  type: 'refreshCardData',
  cardData: newCardData,
});

export const setDuration = (duration: number): SetDuration => ({
  type: 'setDuration',
  duration,
});

export const setCurrencyAndPaymentMethod = ({
  paymentMethod,
  currency,
}: {
  paymentMethod: WalletPaymentMethod;
  currency: Currency;
}): SetCurrencyAndPaymentMethod => ({
  type: 'setCurrencyAndPaymentMethod',
  paymentMethod,
  currency,
});

export const updateSendCards = (cards: CardHit[]): UpdateSendCards => ({
  type: 'updateSendCards',
  cards,
});

export const updateReceiveCards = (cards: CardHit[]): UpdateReceiveCards => ({
  type: 'updateReceiveCards',
  cards,
});

export const setSendEth = (sendEth: number): SetSendEth => ({
  type: 'setSendEth',
  sendEth,
});

export const setReceiveEth = (
  receiveEth: number,
  receiveMarketFeesEth?: number
): SetReceiveEth => ({
  type: 'setReceiveEth',
  receiveEth,
  receiveMarketFeesEth,
});

export const switchToConfirming: SetStage = {
  type: 'setStage',
  stage: 'confirming',
} as const;

export const switchToBuilding: SetStage = {
  type: 'setStage',
  stage: 'building',
} as const;

export const switchToSubmitting: SetStage = {
  type: 'setStage',
  stage: 'submitting',
} as const;

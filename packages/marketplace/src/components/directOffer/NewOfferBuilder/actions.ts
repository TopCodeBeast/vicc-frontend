import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import { MonetaryAmountOutput } from '@sorare/core/src/hooks/useMonetaryAmount';
import { CardHit } from '@sorare/core/src/lib/algolia';

import { WalletPaymentMethod } from '@marketplace/components/buyActions/PaymentProvider/types';

import {
  CardData,
  CardDataType,
  RefreshCardData,
  SetCurrencyAndPaymentMethod,
  SetDuration,
  SetReceiveAmount,
  SetSendAmount,
  SetStage,
  UpdateReceiveCards,
  UpdateSendCards,
} from './types';

export const refreshCardData = <T extends CardDataType>(
  newCardData: CardData<T>
): RefreshCardData<T> => ({
  type: 'refreshCardData',
  cardData: newCardData as any, //TODO
});

export const setDuration = (duration: number): SetDuration => ({
  type: 'setDuration',
  duration,
});

export const setCurrencyAndPaymentMethod = ({
  paymentMethod,
  referenceCurrency,
}: {
  paymentMethod: WalletPaymentMethod;
  referenceCurrency: SupportedCurrency;
}): SetCurrencyAndPaymentMethod => ({
  type: 'setCurrencyAndPaymentMethod',
  paymentMethod,
  referenceCurrency,
});

export const updateSendCards = (cards: CardHit[]): UpdateSendCards => ({
  type: 'updateSendCards',
  cards,
});

export const updateReceiveCards = (cards: CardHit[]): UpdateReceiveCards => ({
  type: 'updateReceiveCards',
  cards,
});

export const setSendAmount = (
  sendAmount: MonetaryAmountOutput
): SetSendAmount => ({
  type: 'setSendAmount',
  sendAmount,
});

export const setReceiveAmount = (
  receiveAmount: MonetaryAmountOutput,
  receiveMarketFeesAmount?: MonetaryAmountOutput
): SetReceiveAmount => ({
  type: 'setReceiveAmount',
  receiveAmount,
  receiveMarketFeesAmount,
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

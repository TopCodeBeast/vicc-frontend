import { CardHit } from "@sorare/core/src/lib/algolia";

export type ActionType = any;

export interface Actions<T> {
  type: string;
};

export type CardDataType = any;

export interface RefreshCardData<T> {
  cardData: CardDataType[];
};

export type SetCurrencyAndPaymentMethod = {
  paymentMethod: any;
  currency: any;
};

export type SetDuration = {
  duration: number;
};

export type SetReceiveEth = any;
export type SetSendEth = any;
export type SetStage = any;

export interface State<T> {
  paymentMethod: any;
  currency: any;
  duration: number;
  minSendEth: number;
  minReceiveEth: number;
  sendEth: number;
  receiveEth: number;
  receiveMarketFeesEth: number;
  valid: boolean;
  isTradeForNothing: boolean;
  sendCards: any[];
  receiveCards: CardHit<T>[];
  cardsData: CardDataType[];
};

export type UpdateReceiveCards = any;
export type UpdateSendCards = any;

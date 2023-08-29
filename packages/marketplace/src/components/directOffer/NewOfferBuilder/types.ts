import { MonetaryAmountOutput } from "@sorare/core/src/hooks/useMonetaryAmount";

export type OfferBuilderStage = any;
export type CardDataType = any;
export type SetCurrencyAndPaymentMethod = any;
export type SetDuration = any;
export type SetReceiveAmount = any;
export type SetSendAmount = any;
export type SetStage = any;
export type UpdateReceiveCards = any;
export type UpdateSendCards = any;

export type ActionType = any;

export interface Actions<T> {
  type: ActionType;
  cardData: Record<string, T>;
};

export interface StateProps<T> {
  state: any;
  dispatch: any;
  receiver: any;
  marketFeeStatus: any;
}
export interface State<T> {
  duration: number;
  stage: string;
  receiveMarketFeesAmount: MonetaryAmountOutput;
  sendCards: any;
  receiveCards: any;
  cardsData: Record<string, T>;
  sendAmount: any;
  receiveAmount: any;
  sendAmountCurrency: any;
  receiveAmountCurrency: any;
  paymentMethod: any;
  submit: any;
};

export interface CardData<T> {

}

export interface RefreshCardData<T> extends Actions<T> {
  cardData: Record<string, T>;
};

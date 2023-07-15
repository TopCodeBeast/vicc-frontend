import { CardHit } from "@sorare/core/src/lib/algolia";
import { OfferDealSummary_token } from "../../offer/OfferDealSummary/__generated__/index.graphql";

export type ActionType = any;

export interface Actions<T> {
  type: string;
};

export interface CardData<T> extends Actions<T> {

};

export type CardDataType = any;

export interface RefreshCardData<T> extends CardData<T> {
  cardData: CardData<T>;
};

export interface SetCurrencyAndPaymentMethod extends Actions<string> {
  paymentMethod: any;
  currency: any;
};

export interface SetDuration extends Actions<string> {
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
  stage: any;
  sendEth: number;
  receiveEth: number;
  receiveMarketFeesEth: number;
  valid: boolean;
  isTradeForNothing: boolean;
  sendCards: any[];
  receiveCards: CardHit[];
  cardsData: Record<string, OfferDealSummary_token>; //CardDataType[];
};

export interface StateProps<T> {
  state: State<T>;
  dispatch: any;
}

export type UpdateReceiveCards = any;
export type UpdateSendCards = any;
export type OfferBuilderStage = any;

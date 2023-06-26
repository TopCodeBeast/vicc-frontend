import { CardHit } from "@sorare/core/src/lib/algolia";
import { OfferSide_token } from "./OfferSide/__generated__/index.graphql";

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
  stage: any;
  sendEth: number;
  receiveEth: number;
  receiveMarketFeesEth: number;
  valid: boolean;
  isTradeForNothing: boolean;
  sendCards: any[];
  receiveCards: CardHit[];
  cardsData: Record<string, OfferSide_token>; //CardDataType[];
};

export interface StateProps<T> {
  state: State<T>;
  dispatch: any;
}

export type UpdateReceiveCards = any;
export type UpdateSendCards = any;

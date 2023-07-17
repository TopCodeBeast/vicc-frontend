import Big from 'bignumber.js';

import { Currency } from '@sorare/core/src/__generated__/globalTypes';
import { CardHit, buildAlgoliaObjectId } from '@sorare/core/src/lib/algolia';
import { fromWei } from '@sorare/core/src/lib/wei';

import { WalletPaymentMethod } from '@marketplace/components/buyActions/PaymentProvider/types';

import {
  ActionType,
  Actions,
  CardDataType,
  RefreshCardData,
  SetCurrencyAndPaymentMethod,
  SetDuration,
  SetReceiveEth,
  SetSendEth,
  SetStage,
  State,
  UpdateReceiveCards,
  UpdateSendCards,
} from './types';

const zero = new Big(0);

const computeSendMinimumPrice: <T extends CardDataType>(
  state: State<T>
) => Big = <T extends CardDataType>({
  sendCards,
  receiveCards,
  cardsData,
}: State<T>) => {
  if (sendCards.length > 0) {
    return zero;
  }
  return receiveCards.reduce((prev: Big, curr) => {
    // const cardMinPrice = cardsData[curr.objectID]?.publicMinPrice;
    // if (!cardMinPrice) return prev;
    // const cardMinPriceBig = new Big(cardMinPrice || 0);
    // return cardMinPriceBig.gt(prev) ? cardMinPriceBig : prev;
    return prev; //TODO****
  }, zero);
};

const computeReceiveMinimumPrice: <T extends CardDataType>(
  state: State<T>
) => Big = <T extends CardDataType>({
  receiveCards,
  sendCards,
  cardsData,
}: State<T>) => {
  if (receiveCards.length > 0) {
    return zero;
  }
  return sendCards.reduce((prev: Big, curr) => {
    // const cardMinPrice = cardsData[curr.objectID]?.publicMinPrice;
    // if (!cardMinPrice) return prev;
    // const cardMinPriceBig = new Big(cardMinPrice || 0);
    // return cardMinPriceBig.gt(prev) ? cardMinPriceBig : prev;
    return prev; //TODO****
  }, zero);
};

interface InitProps<T extends CardDataType> {
  initialReceiveCards: T[];
  initialReceiveEth: number;
  initialReceiveMarketFeesEth: number;
  initialSendCards: T[];
  initialSendEth: number;
  initialPaymentMethod?: WalletPaymentMethod;
  initialCurrency?: Currency;
  readonly submit: (
    dispatch: React.Dispatch<Actions<T>>,
    state: State<T>
  ) => Promise<void>;
  readonly convertToAlgoliaCardHit: (card: T) => CardHit;
}

const refreshMinimumPriceAndValid = <T extends CardDataType>(
  state: State<T>
) => {
  const result = state;
  result.minSendEth = fromWei(computeSendMinimumPrice(result).toString());
  result.minReceiveEth = fromWei(computeReceiveMinimumPrice(result).toString());
  const isTradeForNothing =
    (result.sendEth > 0 && result.receiveCards.length === 0) ||
    (result.receiveEth > 0 && result.sendCards.length === 0);

  const valid = () => {
    if (result.minSendEth > result.sendEth) return false;
    if (isTradeForNothing) return false;
    if (
      result.sendEth === 0 &&
      result.sendCards.length === 0 &&
      result.receiveCards.length === 0
    )
      return false;
    return true;
  };

  result.valid = valid();
  result.isTradeForNothing = isTradeForNothing;
  return result;
};

export const init = <T extends CardDataType>({
  initialReceiveCards = [],
  initialReceiveEth = 0,
  initialReceiveMarketFeesEth = 0,
  initialSendCards = [],
  initialSendEth = 0,
  submit,
  convertToAlgoliaCardHit,
  initialPaymentMethod,
  initialCurrency,
}: InitProps<T>): State<T> => {
  const result: State<T> = {
    sendEth: initialSendEth || 0,
    receiveEth: initialReceiveEth || 0,
    stage: 'building',
    sendCards: initialSendCards.map(convertToAlgoliaCardHit),
    receiveCards: initialReceiveCards.map(convertToAlgoliaCardHit),
    receiveMarketFeesEth: initialReceiveMarketFeesEth || 0,
    // cardsData: [...initialSendCards, ...initialReceiveCards].reduce(
    //   (prev: Record<string, T>, curr) => {
    //     const algoliaObjectId = buildAlgoliaObjectId(curr);
    //     prev[algoliaObjectId] = curr;
    //     return prev;
    //   },
    //   {}
    // ),
    cardsData: [] as any,
    duration: 7,
    minSendEth: 0,
    minReceiveEth: 0,
    submit,
    valid: true,
    isTradeForNothing: false,
    paymentMethod: initialPaymentMethod || null,
    currency: initialCurrency || null,
  } as any;
  return refreshMinimumPriceAndValid(result);
};

type ActionHandler<T extends CardDataType> = (
  state: State<T>,
  action: Actions<T>
) => State<T>;

const actionHandlers: {
  [key in ActionType]: <
    D extends CardDataType,
    T extends Actions<D> & { type: key }
  >(
    state: State<D>,
    action: T
  ) => State<D>;
} = {
  updateSendCards: (state, action: UpdateSendCards) => {
    return refreshMinimumPriceAndValid({
      ...state,
      sendCards: [...action.cards],
    });
  },
  setSendEth: (state, action: SetSendEth) => {
    const { sendEth } = action;
    return refreshMinimumPriceAndValid({
      ...state,
      receiveEth: 0,
      receiveMarketFeesEth: 0,
      sendEth,
    });
  },
  setReceiveEth: (state, action: SetReceiveEth) => {
    const { receiveEth, receiveMarketFeesEth } = action;
    return refreshMinimumPriceAndValid({
      ...state,
      sendEth: 0,
      receiveEth,
      ...(receiveMarketFeesEth && { receiveMarketFeesEth }),
    });
  },
  setStage: (state, action: SetStage) => {
    return {
      ...state,
      stage: action.stage,
    };
  },
  updateReceiveCards: (state, action: UpdateReceiveCards) => {
    return refreshMinimumPriceAndValid({
      ...state,
      receiveCards: [...action.cards],
    });
  },
  /*refreshCardData: <D extends CardDataType>(
    state: State<D>,
    action: RefreshCardData<D>
  ) => {
    return refreshMinimumPriceAndValid({
      ...state,
      cardsData: action.cardData,
    });
  },
  setDuration: (state, action: SetDuration) => {
    const { duration } = action;
    if (state.duration === duration) {
      return state;
    }
    return {
      ...state,
      duration,
    };
  },
  setCurrencyAndPaymentMethod: (state, action: SetCurrencyAndPaymentMethod) => {
    const { paymentMethod, currency } = action;
    if (state.paymentMethod === paymentMethod) {
      return state;
    }
    return {
      ...state,
      ...(state.paymentMethod !== paymentMethod && { paymentMethod }),
      ...(state.currency !== currency && { currency }),
    };
  },*/
};

export default <D extends CardDataType>() =>
  (state: State<D>, action: Actions<D>) => {
    const handler = actionHandlers[action.type] as ActionHandler<D>;
    if (!handler) {
      return state;
    }
    return handler(state, action);
  };

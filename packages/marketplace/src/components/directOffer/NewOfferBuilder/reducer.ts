import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import {
  MonetaryAmountOutput,
  zeroMonetaryAmount,
} from '@sorare/core/src/hooks/useMonetaryAmount';
import { CardHit, buildAlgoliaObjectId } from '@sorare/core/src/lib/algolia';

import { WalletPaymentMethod } from '@marketplace/components/buyActions/PaymentProvider/types';

import {
  ActionType,
  Actions,
  CardDataType,
  RefreshCardData,
  SetCurrencyAndPaymentMethod,
  SetDuration,
  SetReceiveAmount,
  SetSendAmount,
  SetStage,
  State,
  UpdateReceiveCards,
  UpdateSendCards,
} from './types';

export type InitProps<T extends CardDataType> = {
  initialReceiveCards: T[];
  initialReceiveAmount: MonetaryAmountOutput;
  initialReceiveMarketFeesAmount: MonetaryAmountOutput;
  initialSendCards: T[];
  initialSendAmount: MonetaryAmountOutput;
  initialPaymentMethod?: WalletPaymentMethod;
  initialSendCurrency?: SupportedCurrency;
  initialReceiveCurrency?: SupportedCurrency;
  readonly submit: (
    dispatch: React.Dispatch<Actions<T>>,
    state: State<T>
  ) => Promise<void>;
  readonly convertToAlgoliaCardHit: (card: T) => CardHit;
};

export const init = <T extends CardDataType>({
  initialReceiveCards = [],
  initialReceiveAmount = zeroMonetaryAmount,
  initialReceiveMarketFeesAmount = zeroMonetaryAmount,
  initialSendCards = [],
  initialSendAmount = zeroMonetaryAmount,
  submit,
  convertToAlgoliaCardHit,
  initialPaymentMethod,
  initialSendCurrency = SupportedCurrency.WEI,
  initialReceiveCurrency = SupportedCurrency.WEI,
}: InitProps<T>): State<T> => {
  const result: State<T> = {
    sendAmount: initialSendAmount,
    receiveAmount: initialReceiveAmount,
    stage: 'building',
    sendCards: initialSendCards.map(convertToAlgoliaCardHit),
    receiveCards: initialReceiveCards.map(convertToAlgoliaCardHit),
    receiveMarketFeesAmount: initialReceiveMarketFeesAmount,
    cardsData: [...initialSendCards, ...initialReceiveCards].reduce(
      (prev: Record<string, T>, curr) => {
        const algoliaObjectId = buildAlgoliaObjectId(curr as any);
        prev[algoliaObjectId] = curr;
        return prev;
      },
      {}
    ),
    duration: 7,
    submit,
    paymentMethod: initialPaymentMethod || null,
    sendAmountCurrency: initialSendCurrency,
    receiveAmountCurrency: initialReceiveCurrency,
  };
  return result;
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
    return {
      ...state,
      sendCards: [...action.cards],
    };
  },
  setSendAmount: (state, action: SetSendAmount) => {
    const { sendAmount } = action;
    return {
      ...state,
      receiveAmount: zeroMonetaryAmount,
      receiveMarketFeesAmount: zeroMonetaryAmount,
      sendAmount,
    };
  },
  setReceiveAmount: (state, action: SetReceiveAmount) => {
    const { receiveAmount, receiveMarketFeesAmount } = action;
    return {
      ...state,
      sendAmount: zeroMonetaryAmount,
      receiveAmount,
      ...(receiveMarketFeesAmount && { receiveMarketFeesAmount }),
    };
  },
  setStage: (state, action: SetStage) => {
    return {
      ...state,
      stage: action.stage,
    };
  },
  updateReceiveCards: (state, action: UpdateReceiveCards) => {
    return {
      ...state,
      receiveCards: [...action.cards],
    };
  },
  refreshCardData: <D extends CardDataType>(
    state: State<D>,
    action: RefreshCardData<D>
  ) => {
    return {
      ...state,
      cardsData: action.cardData,
    };
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
    const { paymentMethod, referenceCurrency } = action;
    if (state.paymentMethod === paymentMethod) {
      return state;
    }
    return {
      ...state,
      ...(state.paymentMethod !== paymentMethod && { paymentMethod }),
      ...(state.sendAmountCurrency !== referenceCurrency && {
        sendAmountCurrency: referenceCurrency,
      }),
    };
  },
};

export default <D extends CardDataType>() =>
  (state: State<D>, action: Actions<D>) => {
    const handler = actionHandlers[action.type] as ActionHandler<D>;
    if (!handler) {
      return state;
    }
    return handler(state, action);
  };

import { useMemo } from 'react';

import useMonetaryAmount, {
  MonetaryAmountOutput,
  zeroMonetaryAmount,
} from '@sorare/core/src/hooks/useMonetaryAmount';

import {
  CardDataType,
  State,
} from '@marketplace/components/directOffer/NewOfferBuilder/types';

export const useStateOffer = <T extends CardDataType>({
  cardsData,
  receiveCards,
  sendCards,
  sendAmount,
  receiveAmount,
}: State<T>) => {
  const { toMonetaryAmount } = useMonetaryAmount();

  const sendMinimumPrice = useMemo(() => {
    if (sendCards.length > 0) {
      return zeroMonetaryAmount;
    }
    return receiveCards.reduce((prev: MonetaryAmountOutput, curr) => {
      const card = cardsData[curr.objectID];
      if (!card?.publicMinPrices) return prev;

      const monetaryAmount = toMonetaryAmount(card.publicMinPrices);
      return monetaryAmount.eur > prev.eur ? monetaryAmount : prev;
    }, zeroMonetaryAmount);
  }, [cardsData, receiveCards, sendCards.length, toMonetaryAmount]);

  const receiveMinimumPrice = useMemo(() => {
    if (receiveCards.length > 0) {
      return zeroMonetaryAmount;
    }
    return sendCards.reduce((prev: MonetaryAmountOutput, curr) => {
      const card = cardsData[curr.objectID];
      if (!card?.publicMinPrices) return prev;

      const monetaryAmount = toMonetaryAmount(card.publicMinPrices);
      return monetaryAmount.eur > prev.eur ? monetaryAmount : prev;
    }, zeroMonetaryAmount);
  }, [cardsData, receiveCards.length, sendCards, toMonetaryAmount]);

  const isTradeForNothing = useMemo(() => {
    return (
      (sendAmount.eur > 0 && receiveCards.length === 0) ||
      (receiveAmount.eur > 0 && sendCards.length === 0)
    );
  }, [
    receiveAmount.eur,
    receiveCards.length,
    sendAmount.eur,
    sendCards.length,
  ]);

  const isValid = useMemo(() => {
    if (sendMinimumPrice.eur > sendAmount.eur) {
      return false;
    }

    if (isTradeForNothing) return false;

    if (
      sendAmount.eur === 0 &&
      sendCards.length === 0 &&
      receiveCards.length === 0
    ) {
      return false;
    }

    return true;
  }, [
    isTradeForNothing,
    receiveCards.length,
    sendAmount,
    sendCards.length,
    sendMinimumPrice,
  ]);

  return { isValid, isTradeForNothing, sendMinimumPrice, receiveMinimumPrice };
};

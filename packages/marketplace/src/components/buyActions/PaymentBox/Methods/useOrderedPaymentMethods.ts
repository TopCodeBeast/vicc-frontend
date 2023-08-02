import { useEffect, useMemo, useState } from 'react';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import useMangopayCreditCardsEnabled from '@sorare/core/src/hooks/useMangopayCreditCardsEnabled';

import { usePaymentContext } from '@marketplace/components/buyActions/Context';
import { WalletPaymentMethod } from '@marketplace/components/buyActions/PaymentProvider/types';

import {
  CrediCardPaymentMethod,
  OrderedPaymentMethod,
  PaymentMethod,
} from './types';

type Props = {
  selectedPaymentMethod: OrderedPaymentMethod | null;
  setSelectedPaymentMethod: (p: OrderedPaymentMethod) => void;
  creditCardMethodsDisabled?: boolean;
};

export const useOrderedPaymentMethods = ({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  creditCardMethodsDisabled,
}: Props) => {
  const {
    flags: { useCashWallet = false },
  } = useFeatureFlags();
  const useMangopayCreditCards = useMangopayCreditCardsEnabled();

  const {
    walletPreferences: { showFiatWallet, showEthWallet },
  } = useCurrentUserContext();

  const {
    insufficientFundsInFiatWallet,
    paymentMethods,
    paymentRequest,
    paymentMethodsLoading,
    isFiat,
    setPaymentMethod,
  } = usePaymentContext();

  const defaultOrderedPaymentMethods = useMemo(() => {
    const wallets = [
      ...(useCashWallet ? [PaymentMethod.FIAT_WALLET] : []),
      ...(showEthWallet ? [PaymentMethod.ETH_WALLET] : []),
    ];
    if (!isFiat) wallets.reverse();
    const creditCardMethods = [
      ...(paymentMethods || []).map<CrediCardPaymentMethod>(
        ({ id }) => `credit_card_${id}`
      ),
      useMangopayCreditCards
        ? PaymentMethod.NEW_MANGOPAY_CREDIT_CARD
        : PaymentMethod.NEW_CREDIT_CARD,
    ];
    return [...wallets, ...creditCardMethods];
  }, [
    isFiat,
    useCashWallet,
    showEthWallet,
    paymentMethods,
    useMangopayCreditCards,
  ]);

  const [orderedPaymentMethods, setOrderedPaymentMethods] = useState<
    OrderedPaymentMethod[]
  >([]);

  const isSelected = (pm: OrderedPaymentMethod) => pm === selectedPaymentMethod;

  const reorderMethods = () => {
    if (selectedPaymentMethod)
      setOrderedPaymentMethods([
        selectedPaymentMethod,
        ...defaultOrderedPaymentMethods.filter(pm => !isSelected(pm)),
      ]);
  };

  // ADD PAYMENT REQUEST WHEN AVAILABLE
  useEffect(() => {
    if (
      orderedPaymentMethods.length > 0 &&
      !orderedPaymentMethods.includes(PaymentMethod.PAYMENT_REQUEST) &&
      paymentRequest &&
      !creditCardMethodsDisabled
    ) {
      setOrderedPaymentMethods(prev => [
        ...prev,
        PaymentMethod.PAYMENT_REQUEST,
      ]);
    }
  }, [creditCardMethodsDisabled, orderedPaymentMethods, paymentRequest]);

  useEffect(() => {
    if (orderedPaymentMethods.length === 0 && !paymentMethodsLoading) {
      if (
        isFiat &&
        insufficientFundsInFiatWallet &&
        !creditCardMethodsDisabled
      ) {
        if (paymentMethods && paymentMethods?.length > 0) {
          const [firstCreditCard, ...otherCreditCard] = paymentMethods;
          setOrderedPaymentMethods([
            `credit_card_${firstCreditCard.id}`,
            ...(useCashWallet && showFiatWallet
              ? [PaymentMethod.FIAT_WALLET]
              : []),
            ...(showEthWallet ? [PaymentMethod.ETH_WALLET] : []),
            ...otherCreditCard.map<CrediCardPaymentMethod>(
              cc => `credit_card_${cc.id}`
            ),
            useMangopayCreditCards
              ? PaymentMethod.NEW_MANGOPAY_CREDIT_CARD
              : PaymentMethod.NEW_CREDIT_CARD,
            ...((paymentRequest && [PaymentMethod.PAYMENT_REQUEST]) || []),
          ]);
          setPaymentMethod(firstCreditCard);
          setSelectedPaymentMethod(`credit_card_${firstCreditCard.id}`);
        } else {
          setOrderedPaymentMethods([
            useMangopayCreditCards
              ? PaymentMethod.NEW_MANGOPAY_CREDIT_CARD
              : PaymentMethod.NEW_CREDIT_CARD,
            ...(useCashWallet && showFiatWallet
              ? [PaymentMethod.FIAT_WALLET]
              : []),
            ...(showEthWallet ? [PaymentMethod.ETH_WALLET] : []),
          ]);
          setSelectedPaymentMethod(
            useMangopayCreditCards
              ? PaymentMethod.NEW_MANGOPAY_CREDIT_CARD
              : PaymentMethod.NEW_CREDIT_CARD
          );
        }
      } else {
        setOrderedPaymentMethods(defaultOrderedPaymentMethods);
        setSelectedPaymentMethod(defaultOrderedPaymentMethods[0]);
        setPaymentMethod(
          isFiat
            ? WalletPaymentMethod.FIAT_WALLET
            : WalletPaymentMethod.ETH_WALLET
        );
      }
    }
  }, [
    defaultOrderedPaymentMethods,
    insufficientFundsInFiatWallet,
    isFiat,
    orderedPaymentMethods.length,
    paymentMethods,
    paymentMethodsLoading,
    paymentRequest,
    setPaymentMethod,
    setSelectedPaymentMethod,
    showEthWallet,
    showFiatWallet,
    useCashWallet,
    useMangopayCreditCards,
    creditCardMethodsDisabled,
  ]);

  return {
    isSelected,
    reorderMethods,
    orderedPaymentMethods,
  };
};

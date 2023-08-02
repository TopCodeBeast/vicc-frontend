import { useElements, useStripe } from '@stripe/react-stripe-js';
import {
  PaymentMethod,
  PaymentRequest,
  StripeCardElement,
} from '@stripe/stripe-js';
import { useCallback, useEffect, useState } from 'react';

import { StripeCreditCardAuthorizationRequest } from '@sorare/core/src/__generated__/globalTypes';
import {
  Level,
  useSnackNotificationContext,
} from '@sorare/core/src/contexts/snackNotification';
import { isType } from '@sorare/core/src/gql';
import { MonetaryAmountOutput } from '@sorare/core/src/hooks/useMonetaryAmount';
import { useFiatBalance } from '@sorare/core/src/hooks/wallets/useFiatBalance';

import { PaymentProvider_paymentMethod, WalletPaymentMethod } from './types';
import usePaymentRequest, { CanMakePaymentResult } from './usePaymentRequest';
import usePreparePayment, { PreparePaymentType } from './usePreparePayment';

export interface DisposableCard {
  card: StripeCardElement;
}

type Props = {
  monetaryAmount: MonetaryAmountOutput;
  englishAuctionId?: string;
  id: string;
  saveCreditCard: boolean;
  label: string;
  selectedPaymentMethod:
    | PaymentProvider_paymentMethod
    | DisposableCard
    | PaymentMethod
    | WalletPaymentMethod
    | null;
  setSelectedPaymentMethod: (
    method:
      | PaymentProvider_paymentMethod
      | DisposableCard
      | PaymentMethod
      | WalletPaymentMethod
      | null
  ) => void;
  onSuccess: (monetaryAmount?: MonetaryAmountOutput) => void;
  conversionCreditId?: string;
};

const useStripePayment = ({
  monetaryAmount,
  id,
  saveCreditCard,
  label,
  selectedPaymentMethod,
  onSuccess,
  conversionCreditId,
  englishAuctionId,
}: Props): {
  paymentRequest: PaymentRequest | null;
  canMakePaymentWithPaymentRequest: CanMakePaymentResult | null;
  submit: (pm?: PaymentMethod | DisposableCard) => Promise<void>;
  errors: string[];
  processing: boolean;
} => {
  const { fiatCurrencyForMonetaryAmount } = useFiatBalance();
  const { showNotification } = useSnackNotificationContext();
  const [price, setPrice] = useState<MonetaryAmountOutput>(monetaryAmount);
  const [errors, setErrors] = useState<string[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<
    string | DisposableCard | undefined
  >(undefined);
  const { paymentRequest, canMakePaymentWithPaymentRequest } =
    usePaymentRequest(label, monetaryAmount[fiatCurrencyForMonetaryAmount]);
  const stripe = useStripe();
  const elements = useElements();
  const preparePayment = usePreparePayment();

  useEffect(() => {
    if (!selectedPaymentMethod || typeof selectedPaymentMethod !== 'object')
      return;

    if ('id' in selectedPaymentMethod) {
      setPaymentMethod(selectedPaymentMethod.id!);
    } else {
      setPaymentMethod(selectedPaymentMethod);
    }
    setErrors([]);
  }, [selectedPaymentMethod]);

  useEffect(() => {
    setErrors([]);
    setPrice(monetaryAmount);
  }, [price, monetaryAmount]);

  const submit = useCallback(
    async (pm?: PaymentMethod | DisposableCard) => {
      if (!stripe || !elements || (!paymentMethod && !pm)) return;

      if (import.meta.env.STORYBOOK) {
        onSuccess();
        return;
      }
      setProcessing(true);

      const { useAuthorizations = false, authorizations = [] } =
        await preparePayment(
          englishAuctionId
            ? {
                type: PreparePaymentType.BID,
                englishAuctionId,
                monetaryAmount,
                conversionCreditId,
                savePaymentMethod: saveCreditCard,
              }
            : {
                type: PreparePaymentType.ACCEPT_OFFER,
                offerId: id,
                conversionCreditId,
                savePaymentMethod: saveCreditCard,
              }
        );

      const paymentIntent =
        useAuthorizations &&
        (authorizations?.find(authorization =>
          isType(authorization.request, 'StripeCreditCardAuthorizationRequest')
        )?.request as StripeCreditCardAuthorizationRequest);

      if (paymentIntent) {
        const payload = await stripe.confirmCardPayment(
          paymentIntent.clientSecret,
          {
            payment_method:
              (pm as PaymentMethod)?.id ||
              (pm as DisposableCard) ||
              paymentMethod,
          }
        );

        if (payload.error) {
          const error = `Payment failed ${payload.error.message}`;
          setErrors([error]);
          showNotification(
            'errors',
            { errors: [error] },
            {
              level: Level.ERROR,
            }
          );
        } else {
          setErrors([]);
          onSuccess(monetaryAmount);
        }
      }
      setProcessing(false);
    },
    [
      stripe,
      elements,
      paymentMethod,
      preparePayment,
      englishAuctionId,
      monetaryAmount,
      conversionCreditId,
      saveCreditCard,
      id,
      onSuccess,
      showNotification,
    ]
  );

  return {
    paymentRequest,
    canMakePaymentWithPaymentRequest,
    submit,
    errors,
    processing,
  };
};

export default useStripePayment;

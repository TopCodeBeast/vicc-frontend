import { TypedDocumentNode, gql, useMutation } from '@apollo/client';
import {
  PaymentMethod,
  PaymentRequest,
  StripeCardElement,
} from '@stripe/stripe-js';
import { useCallback, useEffect, useState } from 'react';

import {
  Level,
  useSnackNotificationContext,
} from '@sorare/core/src/contexts/snackNotification';
import { isType } from '@sorare/core/src/gql';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import { MonetaryAmountOutput } from '@sorare/core/src/hooks/useMonetaryAmount';
import { useFiatBalance } from '@sorare/core/src/hooks/wallets/useFiatBalance';

import {
  CreateCardAuthorization,
  CreateCardAuthorizationVariables,
} from './__generated__/useMangopayPayment.graphql';
import { PaymentProvider_paymentMethod, WalletPaymentMethod } from './types';
import usePaymentRequest, { CanMakePaymentResult } from './usePaymentRequest';
import usePreparePayment, { PreparePaymentType } from './usePreparePayment';

const CREATE_CARD_AUTHORIZATION = gql`
  mutation CreateCardAuthorization($input: createCardAuthorizationInput!) {
    createCardAuthorization(input: $input) {
      secureModeRedirectUrl
      errors {
        message
      }
    }
  }
` as TypedDocumentNode<
  CreateCardAuthorization,
  CreateCardAuthorizationVariables
>;

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
  on3DS: (url: string) => void;
  conversionCreditId?: string;
  refetchPaymentMethods: () => void;
};

const useMangopayPayment = ({
  monetaryAmount,
  id,
  saveCreditCard,
  label,
  onSuccess,
  on3DS,
  selectedPaymentMethod,
  conversionCreditId,
  englishAuctionId,
  refetchPaymentMethods,
}: Props): {
  paymentRequest: PaymentRequest | null;
  canMakePaymentWithPaymentRequest: CanMakePaymentResult | null;
  submit: (pm?: PaymentMethod | DisposableCard | string) => Promise<void>;
  errors: string[];
  processing: boolean;
} => {
  const { fiatCurrencyForMonetaryAmount } = useFiatBalance();
  const { showNotification } = useSnackNotificationContext();
  const [price, setPrice] = useState<MonetaryAmountOutput>(monetaryAmount);
  const [errors, setErrors] = useState<string[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);
  const [savedCardId, setSavedCardId] = useState<string | undefined>(undefined);
  const { paymentRequest, canMakePaymentWithPaymentRequest } =
    usePaymentRequest(label, monetaryAmount[fiatCurrencyForMonetaryAmount]);

  const preparePayment = usePreparePayment();

  const [createCardAuthorization] = useMutation(CREATE_CARD_AUTHORIZATION);

  useEffect(() => {
    if (!selectedPaymentMethod || typeof selectedPaymentMethod !== 'object')
      return;
    if ('id' in selectedPaymentMethod) {
      setSavedCardId(selectedPaymentMethod.id!);
    } else {
      setSavedCardId(undefined);
    }
    setErrors([]);
  }, [selectedPaymentMethod]);

  useEffect(() => {
    setErrors([]);
    setPrice(monetaryAmount);
  }, [price, monetaryAmount]);

  const submit = useCallback(
    async (cardId: any) => {
      if (!savedCardId && !cardId) return;

      if (import.meta.env.STORYBOOK) {
        onSuccess();
        return;
      }
      setProcessing(true);

      const savePaymentMethod = savedCardId ? true : saveCreditCard;

      const { useAuthorizations = false, authorizations = [] } =
        await preparePayment(
          englishAuctionId
            ? {
                type: PreparePaymentType.BID,
                englishAuctionId,
                monetaryAmount,
                conversionCreditId,
                savePaymentMethod,
              }
            : {
                type: PreparePaymentType.ACCEPT_OFFER,
                offerId: id,
                conversionCreditId,
                savePaymentMethod,
              }
        );

      const authorizationId: string | false =
        (useAuthorizations &&
          authorizations?.find(authorization =>
            isType(
              authorization.request,
              'MangopayCreditCardAuthorizationRequest'
            )
          )?.id) ||
        false;

      if (authorizationId) {
        const { data } = await createCardAuthorization({
          variables: {
            input: {
              authorizationId: idFromObject(authorizationId),
              cardId: cardId || savedCardId,
              browserInfo: {
                colorDepth: window.screen.colorDepth,
                language: navigator.language,
                screenHeight: window.screen.height,
                screenWidth: window.screen.width,
                timeZoneOffset: new Date().getTimezoneOffset(),
              },
            },
          },
        });
        const answer = data?.createCardAuthorization;
        if (answer?.errors.length) {
          refetchPaymentMethods();
          const error = `Payment failed ${answer.errors[0].message}`;
          setErrors([error]);
          showNotification(
            'errors',
            { errors: [error] },
            {
              level: Level.ERROR,
            }
          );
        } else {
          if (saveCreditCard) {
            refetchPaymentMethods();
          }
          setErrors([]);
          if (answer?.secureModeRedirectUrl) {
            on3DS(answer.secureModeRedirectUrl);
          } else {
            onSuccess(monetaryAmount);
          }
        }
      }
      setProcessing(false);
    },
    [
      savedCardId,
      preparePayment,
      englishAuctionId,
      monetaryAmount,
      conversionCreditId,
      saveCreditCard,
      id,
      onSuccess,
      on3DS,
      createCardAuthorization,
      showNotification,
      refetchPaymentMethods,
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

export default useMangopayPayment;

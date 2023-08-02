import { PaymentMethod } from '@stripe/stripe-js';
import Big from 'bignumber.js';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { MessageDescriptor, defineMessages, useIntl } from 'react-intl';

import {
  FiatCurrency,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import { CreditCardFormResult } from '@sorare/core/src/components/creditCard/AddCreditCardForm';
import { ThreeDSIframe } from '@sorare/core/src/components/creditCard/ThreeDSIframe';
import VerifyPhoneNumber from '@sorare/core/src/components/user/VerifyPhoneNumber';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useRestrictedAccessContext } from '@sorare/core/src/contexts/restrictedAccess';
import { useCurrentUsersPaymentMethods } from '@sorare/core/src/hooks/creditCard/useCurrentUsersPaymentMethods';
import { useRegisterMangopayCard } from '@sorare/core/src/hooks/creditCard/useRegisterMangopayCard';
import { useAuctionConversionCredit } from '@sorare/core/src/hooks/useAuctionConversionCredit';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import useMangopayCreditCardsEnabled from '@sorare/core/src/hooks/useMangopayCreditCardsEnabled';
import useMonetaryAmount, {
  MonetaryAmountOutput,
} from '@sorare/core/src/hooks/useMonetaryAmount';
import usePrevious from '@sorare/core/src/hooks/usePrevious';
import useToggle from '@sorare/core/src/hooks/useToggle';
import { Currency } from '@sorare/core/src/lib/currency';
import { getMonetaryAmountIndex } from '@sorare/core/src/lib/monetaryAmount';
import { toWei } from '@sorare/core/src/lib/wei';

import useHasInsufficientFundsInWallets from '@marketplace/hooks/useHasInsufficientFundsInWallets';

import PaymentContextProvider from '../Context';
import {
  PaymentProviderProps,
  PaymentProvider_paymentMethod,
  WalletPaymentMethod,
} from './types';
import { useCalculateAmounts } from './useCalculateAmounts';
import useMangopayPayment from './useMangopayPayment';
import usePresetCurrency from './usePresetCurrency';
import useStripePayment, { DisposableCard } from './useStripePayment';

export type PaymentProps = PaymentProviderProps;

const messages = defineMessages({
  amountToLow: {
    id: 'PaymentProvider.amountTooLow',
    defaultMessage: 'Amount too low',
  },
  mangopay3DSHeader: {
    id: 'PaymentProvider.mangopay3DSHeader',
    defaultMessage: '3DS Security',
  },
});

interface Props extends PaymentProps {
  children?: ReactNode;
}

type AutomaticStripePaymentIntentStatus =
  | undefined // nothing to do with regard to stripe payment intent
  | 'pending' // expecting the stripe payment intent creation to start any time soon
  | 'inProgress' // stripe payment intent creation has been started but has not been completed yet
  | 'created'; // stripe payment intent was successfully created, still need to start the payment

const ContextProvider = ({
  auction,
  onSuccess: doOnSuccess,
  children,
  onSubmit,
  objectId,
  price,
  cta,
  creditCardFee = 0,
  activeFee: defaultActiveFee = true,
  currencies = [Currency.FIAT, Currency.ETH],
  canUseConversionCredit = false,
  buyOnAuctionPoweredByAlgolia = null,
  sport,
  canChangeRefCurrency,
}: Props) => {
  const {
    fiatCurrency: { code: currencyCode },
    currentUser,
  } = useCurrentUserContext();
  const { toMonetaryAmount } = useMonetaryAmount();
  const registerMangopayCard = useRegisterMangopayCard();

  const { referenceCurrency: originalRefCurrency } = price;
  const [referenceCurrency, setReferenceCurrency] =
    useState<SupportedCurrency>(originalRefCurrency);

  const referenceCurrencyIndex = getMonetaryAmountIndex(referenceCurrency);
  const referencePrice = price[referenceCurrencyIndex];
  const {
    flags: { useCashWallet },
  } = useFeatureFlags();
  const useMangopayCreditCards = useMangopayCreditCardsEnabled();

  const initMonetaryAmount = useMemo(
    () => toMonetaryAmount(price),
    [price, toMonetaryAmount]
  );

  const { formatMessage } = useIntl();
  const [monetaryAmount, setMonetaryAmount] =
    useState<MonetaryAmountOutput>(initMonetaryAmount);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [errors, setErrors] = useState<MessageDescriptor[]>([]);
  const [amountTooLow, setAmountTooLow] = useState<boolean>(false);
  const [activeFee, setActiveFee] = useState<boolean>(defaultActiveFee);
  const [cardRegistrationProcessing, setCardRegistrationProcessing] =
    useState<boolean>(false);
  const [cardRegistrationErrors, setCardRegistrationErrors] = useState<
    string[]
  >([]);
  const [paymentMethod, setStatePaymentMethod] = useState<
    | PaymentProvider_paymentMethod
    | DisposableCard
    | PaymentMethod
    | WalletPaymentMethod
    | null
  >(null);
  const [saveCreditCard, toggleSaveCreditCard] = useToggle(false);
  const [paymentRequestButtonEnabled, enablePaymentRequestButton] =
    useState<boolean>(false);

  const previousMonetaryAmount = usePrevious(initMonetaryAmount);
  const { setShowRestrictedAccess } = useRestrictedAccessContext();

  const [paymentMethods, paymentMethodsLoading, refetchPaymentMethods] =
    useCurrentUsersPaymentMethods(currentUser);

  const [paymentCurrency, setPaymentCurrency] = useState<Currency | null>(null);
  const isFiat = useMemo(
    () => paymentCurrency === Currency.FIAT,
    [paymentCurrency]
  );
  const isCreditCard = useMemo(() => {
    return isFiat && paymentMethod !== WalletPaymentMethod.FIAT_WALLET;
  }, [isFiat, paymentMethod]);

  const supportedCurrency = useMemo(() => {
    if (!useCashWallet || paymentMethod === WalletPaymentMethod.ETH_WALLET)
      return SupportedCurrency.WEI;
    switch (currencyCode) {
      case FiatCurrency.EUR:
        return SupportedCurrency.EUR;
      case FiatCurrency.GBP:
        return SupportedCurrency.GBP;
      default:
        return SupportedCurrency.USD;
    }
  }, [currencyCode, paymentMethod, useCashWallet]);

  const auctionConversionCredit = useAuctionConversionCredit(auction);

  const {
    conversionCredit,
    conversionCreditId,
    usingConversionCredit,
    setUsingConversionCredit,
    fees,
    totalMonetaryAmount,
    feesMonetaryAmount,
    conversionCreditMonetaryAmount,
    readablePercentageDiscount,
  } = useCalculateAmounts({
    creditCardFee,
    activeFee,
    isFiat,
    sport,
    canUseConversionCredit,
    monetaryAmount,
    referenceCurrency,
    currentlyUsedConversionCredit: auctionConversionCredit,
  });

  const [pendingPhoneVerification, setPendingPhoneVerification] =
    useState(false);

  const [
    stripePaymentIntentCreationEnabled,
    setStripePaymentIntentCreationEnabled,
  ] = useState<boolean>(
    currencies.includes(Currency.FIAT) && !!currentUser?.phoneNumberVerified
  );

  const [stripePaymentIntentStatus, setStripePaymentIntentStatus] =
    useState<AutomaticStripePaymentIntentStatus>(undefined);
  const [mangopay3DSUrl, setMangopay3DSUrl] = useState<string | undefined>(
    undefined
  );

  const onSuccess = (onSuccessAmount?: MonetaryAmountOutput) => {
    if (saveCreditCard) {
      refetchPaymentMethods();
    }
    doOnSuccess(onSuccessAmount);
  };

  const {
    paymentRequest,
    canMakePaymentWithPaymentRequest,
    submit: startStripePayment,
    errors: stripeErrors,
    processing,
  } = useStripePayment({
    monetaryAmount,
    id: objectId,
    englishAuctionId: auction?.blockchainId,
    saveCreditCard,
    label: formatMessage(cta),
    selectedPaymentMethod: paymentMethod,
    setSelectedPaymentMethod: setStatePaymentMethod,
    onSuccess,
    conversionCreditId,
  });

  const {
    submit: startMangopayPayment,
    errors: mangoPayErrors,
    processing: mangopayPaymentProcessing,
  } = useMangopayPayment({
    monetaryAmount,
    id: objectId,
    englishAuctionId: auction?.blockchainId,
    saveCreditCard,
    label: formatMessage(cta),
    selectedPaymentMethod: paymentMethod,
    setSelectedPaymentMethod: setStatePaymentMethod,
    onSuccess,
    on3DS: setMangopay3DSUrl,
    conversionCreditId,
    refetchPaymentMethods,
  });

  const {
    monetaryAmountToPayWithFiatWallet,
    monetaryAmountToPayWithEthWallet,
  } = usePresetCurrency({
    monetaryAmount,
    currencies,
    setPaymentCurrency,
    paymentCurrency,
    auction,
  });

  const hasInsufficientFundsInWallets = useHasInsufficientFundsInWallets();

  const { insufficientFundsInEthWallet, insufficientFundsInFiatWallet } =
    hasInsufficientFundsInWallets({
      monetaryAmountToPayWithFiatWallet,
      monetaryAmountToPayWithEthWallet,
    });

  useEffect(() => {
    if (pendingPhoneVerification && currentUser?.phoneNumberVerified) {
      // in case credit card payments are actually forbidden from backend side
      // we need to trigger the stripe payment creation.
      // Since it will be **started** asynchronously, we need to know that
      // it is going to start to detect when it gets loaded successfully
      setStripePaymentIntentStatus('pending');
      setStripePaymentIntentCreationEnabled(true);
      setPendingPhoneVerification(false);
    }
  }, [
    pendingPhoneVerification,
    currentUser?.phoneNumberVerified,
    startStripePayment,
  ]);

  useEffect(() => {
    if (stripePaymentIntentStatus === 'pending') {
      if (stripePaymentIntentCreationEnabled) {
        setStripePaymentIntentStatus('inProgress');
      }
    } else if (stripePaymentIntentStatus === 'inProgress') {
      setStripePaymentIntentStatus('created');
      startStripePayment();
    } else if (stripePaymentIntentStatus === 'created') {
      if (processing) {
        // once the stripe payment has been started we can join the standard workflow
        setStripePaymentIntentStatus(undefined);
      }
    }
  }, [
    processing,
    stripePaymentIntentStatus,
    startStripePayment,
    stripePaymentIntentCreationEnabled,
  ]);

  const payWithStripe = async (pm?: PaymentMethod | DisposableCard) => {
    // Avoid calling "createPaymentIntent" mutation with unconfirmed account: return an error
    if (!currentUser?.confirmed) {
      return setShowRestrictedAccess('email');
    }
    if (!currentUser?.phoneNumberVerified) {
      return setPendingPhoneVerification(true);
    }
    return startStripePayment(pm);
  };

  const payWithMangopay = useCallback(
    async (pm?: PaymentMethod | DisposableCard | string) => {
      // Avoid calling "createPaymentIntent" mutation with unconfirmed account: return an error
      if (!currentUser?.confirmed) {
        return setShowRestrictedAccess('email');
      }
      if (!currentUser?.phoneNumberVerified) {
        return setPendingPhoneVerification(true);
      }
      return startMangopayPayment(pm);
    },
    [
      currentUser?.confirmed,
      currentUser?.phoneNumberVerified,
      setShowRestrictedAccess,
      startMangopayPayment,
    ]
  );

  const registerCardAndSubmit = useCallback(
    async (newCardDetails: CreditCardFormResult) => {
      setCardRegistrationProcessing(true);
      setCardRegistrationErrors([]);
      const registerCardResult = await registerMangopayCard(newCardDetails);
      if (registerCardResult.errors) {
        refetchPaymentMethods();
        setCardRegistrationErrors(registerCardResult.errors);
      }
      if (registerCardResult?.cardId) {
        await payWithMangopay(registerCardResult.cardId);
      }
      setCardRegistrationProcessing(false);
    },
    [payWithMangopay, registerMangopayCard, refetchPaymentMethods]
  );

  useEffect(() => {
    const previousAmount = previousMonetaryAmount?.[referenceCurrencyIndex];
    const currentAmount = initMonetaryAmount[referenceCurrencyIndex];

    if (
      previousAmount &&
      currentAmount &&
      previousAmount !== currentAmount &&
      new Big(previousAmount).gt(currentAmount) &&
      !(processing || loadingWallet)
    ) {
      setErrors([messages.amountToLow]);
      setAmountTooLow(true);
    }
  }, [
    loadingWallet,
    processing,
    previousMonetaryAmount,
    referenceCurrencyIndex,
    initMonetaryAmount,
  ]);

  const updateMonetaryAmount = useCallback(
    (updateAmount: string | number, updateCurrency: SupportedCurrency) => {
      const updatedMonetaryAmount = toMonetaryAmount({
        [updateCurrency.toLowerCase()]: updateAmount,
        referenceCurrency: updateCurrency,
      });
      setMonetaryAmount(updatedMonetaryAmount);
      if (
        new Big(updatedMonetaryAmount[referenceCurrencyIndex]).lt(
          referencePrice || 0
        )
      ) {
        setErrors([messages.amountToLow]);
        setAmountTooLow(true);
      } else {
        setErrors([]);
        setAmountTooLow(false);
      }
    },
    [referencePrice, referenceCurrencyIndex, toMonetaryAmount]
  );

  const updateAmountFromEth = useCallback(
    (updateAmount: number) => {
      updateMonetaryAmount(
        toWei(updateAmount.toString()),
        SupportedCurrency.WEI
      );
    },
    [updateMonetaryAmount]
  );

  const updateAmountFromFiat = useCallback(
    (updateAmount: number, updateCurrency: SupportedCurrency) => {
      updateMonetaryAmount(Math.round(updateAmount * 100), updateCurrency);
    },
    [updateMonetaryAmount]
  );

  const submitWithWallet = useCallback(async () => {
    setLoadingWallet(true);
    await onSubmit({
      supportedCurrency,
      monetaryAmount,
      conversionCreditId,
    }).finally(() => {
      setLoadingWallet(false);
    });
  }, [onSubmit, supportedCurrency, monetaryAmount, conversionCreditId]);

  const setPaymentMethod = useCallback(
    (
      pm:
        | PaymentProvider_paymentMethod
        | DisposableCard
        | PaymentMethod
        | WalletPaymentMethod
        | null,
      enablePaymentRequest?: boolean
    ) => {
      const pmIsEth = pm === WalletPaymentMethod.ETH_WALLET;
      const pmIsFiatWallet = pm === WalletPaymentMethod.FIAT_WALLET;
      setStatePaymentMethod(pm);
      enablePaymentRequestButton(enablePaymentRequest || false);
      setPaymentCurrency(pmIsEth ? Currency.ETH : Currency.FIAT);
      setActiveFee(!pmIsEth && !pmIsFiatWallet);
      if (canChangeRefCurrency)
        setReferenceCurrency(
          pmIsEth ? SupportedCurrency.WEI : (currencyCode as SupportedCurrency)
        );
    },
    [currencyCode, canChangeRefCurrency]
  );

  return (
    <PaymentContextProvider
      value={{
        auction,
        sport,
        currencies,
        defaultMonetaryAmount: initMonetaryAmount,
        monetaryAmount,
        fiatCurrency: currencyCode,
        paymentMethod,
        saveCreditCard,
        toggleSaveCreditCard,
        updateAmountFromFiat,
        submitWithWallet,
        submitWithFiat: useMangopayCreditCards
          ? payWithMangopay
          : payWithStripe,
        registerCardAndSubmit,
        processingFiat:
          stripePaymentIntentStatus !== undefined ||
          pendingPhoneVerification ||
          processing ||
          mangopayPaymentProcessing ||
          cardRegistrationProcessing,
        loadingFiat:
          stripePaymentIntentStatus !== undefined || pendingPhoneVerification,
        updateAmountFromEth,
        loadingWallet,
        errors,
        stripeErrors: [...stripeErrors, ...mangoPayErrors],
        cardRegistrationErrors,
        paymentMethods,
        paymentMethodsLoading,
        paymentRequest,
        setPaymentMethod,
        canMakePaymentWithPaymentRequest,
        paymentRequestButtonEnabled,
        enablePaymentRequestButton,
        setActiveFee,
        fees,
        cta,
        usingConversionCredit,
        setUsingConversionCredit,
        readablePercentageDiscount,
        maxDiscountMonetary: conversionCredit?.maxDiscount,
        paymentCurrency,
        setPaymentCurrency,
        isFiat,
        isCreditCard,
        amountTooLow,
        buyOnAuctionPoweredByAlgolia,
        insufficientFundsInEthWallet,
        insufficientFundsInFiatWallet,
        feesMonetaryAmount,
        conversionCredit,
        conversionCreditMonetaryAmount,
        totalMonetaryAmount,
        referenceCurrency,
        setReferenceCurrency,
        canChangeRefCurrency,
      }}
    >
      {pendingPhoneVerification && (
        <VerifyPhoneNumber
          onCancel={() => setPendingPhoneVerification(false)}
        />
      )}
      {children}
      {mangopay3DSUrl && (
        <ThreeDSIframe
          url={mangopay3DSUrl}
          onSuccess={() => {
            setMangopay3DSUrl(undefined);
            onSuccess(monetaryAmount);
          }}
          onCancel={() => setMangopay3DSUrl(undefined)}
        />
      )}
    </PaymentContextProvider>
  );
};

export default ContextProvider;

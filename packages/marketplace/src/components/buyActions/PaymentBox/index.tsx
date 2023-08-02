import { PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import {
  PaymentMethod,
  PaymentRequestPaymentMethodEvent,
} from '@stripe/stripe-js';
import {
  ComponentType,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FormattedMessage, MessageDescriptor, useIntl } from 'react-intl';
import styled from 'styled-components';

import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import { Caption } from '@sorare/core/src/atoms/typography';
import { CreditCardFormResult } from '@sorare/core/src/components/creditCard/AddCreditCardForm';
import Dialog from '@sorare/core/src/components/dialog';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useValidateCardDetails } from '@sorare/core/src/hooks/creditCard/useValidateCardDetails';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useWalletNeedsRecover from '@sorare/core/src/hooks/recovery/useWalletNeedsRecover';
import { Currency } from '@sorare/core/src/lib/currency';

import { usePaymentContext } from '@marketplace/components/buyActions/Context';
import Methods, {
  OrderedPaymentMethod,
  PaymentMethod as PaymentMethodEnum,
} from '@marketplace/components/buyActions/PaymentBox/Methods';
import SummaryTable from '@marketplace/components/buyActions/PaymentBox/SummaryTable';
import {
  BuyConfirmationProviderStateProps,
  useBuyConfirmationContext,
} from '@marketplace/contexts/buyingConfirmation';

import { WalletPaymentMethod } from '../PaymentProvider/types';
import { DisposableCard } from '../PaymentProvider/useStripePayment';
import BidContent from './BidContent';
import usePaymentBoxEvents from './usePaymentBoxEvents';

interface BaseProps {
  title: ReactNode;
  OrderSummary?: ComponentType<React.PropsWithChildren<{ isFiat: boolean }>>;
  outBidByAutoBid?: boolean;
  loadingPolling?: boolean;
  customAmountDisplay?: ReactNode;
  hideFees?: boolean;
  hideSubtotal?: boolean;
  hideSummaryTable?: boolean;
  confirmationProviderStateProps?: Omit<
    BuyConfirmationProviderStateProps,
    'payment' | 'customAmountDisplay'
  >;
  setOutBidCallback?: React.Dispatch<
    React.SetStateAction<((string: any) => void) | undefined>
  >;
  creditCardMethodsDisabled?: boolean;
}

export interface CloseOnlyProps extends BaseProps {
  onClose: (...args: any[]) => void;
  onBack?: never;
}

export interface WithBackProps extends BaseProps {
  onClose?: never;
  onBack: () => void;
}

export type Props = WithBackProps | CloseOnlyProps;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  padding: var(--double-unit);
`;
const Action = styled.div`
  display: flex;
  flex-direction: column;
  > * {
    width: 100%;
  }
`;
const PaymentRequestButton = styled.div`
  border-radius: var(--double-and-a-half-unit);
  overflow: hidden;
`;

const Centered = styled.div`
  text-align: center;
`;

export const PaymentBox = (props: Props) => {
  const { formatMessage } = useIntl();
  const { up: upTablet } = useScreenSize('tablet');
  const validateCardDetails = useValidateCardDetails();

  const { setBuyConfirmationProps } = useBuyConfirmationContext();
  const {
    onClose,
    onBack,
    loadingPolling,
    OrderSummary,
    title,
    customAmountDisplay,
    hideSummaryTable = false,
    outBidByAutoBid = false,
    confirmationProviderStateProps = null,
    setOutBidCallback,
    hideFees,
    hideSubtotal,
    creditCardMethodsDisabled = false,
  } = props;

  const {
    auction,
    sport,
    cta,
    monetaryAmount,
    paymentMethod,
    errors: paymentErrors,
    stripeErrors,
    submitWithWallet,
    loadingWallet,
    submitWithFiat,
    registerCardAndSubmit,
    processingFiat,
    loadingFiat,
    paymentCurrency,
    isFiat,
    isCreditCard,
    feesMonetaryAmount,
    totalMonetaryAmount,
    usingConversionCredit,
    fees,
    paymentRequestButtonEnabled,
    paymentRequest,
    setPaymentMethod,
    referenceCurrency,
    canChangeRefCurrency,
    conversionCreditMonetaryAmount,
  } = usePaymentContext();

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<OrderedPaymentMethod | null>(null);

  const [newCardDetails, setNewCardDetails] = useState<
    CreditCardFormResult | undefined
  >();

  const { currentUser } = useCurrentUserContext();
  const walletNeedsRecover = useWalletNeedsRecover();

  const { trackConfirmPurchaseForm } = usePaymentBoxEvents({
    sport,
    monetaryAmount,
    fiatPayment: isFiat,
  });

  const doSubmit = useCallback(
    async (pm?: PaymentMethod | DisposableCard) => {
      if (confirmationProviderStateProps) {
        setBuyConfirmationProps({
          ...confirmationProviderStateProps,
          payment: { paymentCurrency, paymentMethod: pm || paymentMethod },
        });
      }
      if (
        selectedPaymentMethod === PaymentMethodEnum.NEW_MANGOPAY_CREDIT_CARD
      ) {
        if (newCardDetails) {
          await registerCardAndSubmit(newCardDetails);
        }
        return;
      }
      if (
        paymentCurrency === Currency.FIAT &&
        paymentMethod !== WalletPaymentMethod.FIAT_WALLET
      ) {
        await submitWithFiat(pm);
        return;
      }
      await submitWithWallet();
    },
    [
      confirmationProviderStateProps,
      paymentCurrency,
      paymentMethod,
      selectedPaymentMethod,
      newCardDetails,
      registerCardAndSubmit,
      submitWithWallet,
      setBuyConfirmationProps,
      submitWithFiat,
    ]
  );

  const errors: (string | MessageDescriptor)[] = useMemo(
    () => (isFiat ? stripeErrors : []),
    [isFiat, stripeErrors]
  );

  const isDisabled = useMemo(() => {
    const disableDueToPayment = isFiat
      ? !!paymentErrors.length
      : !!errors.length;

    const disableDueToImcompletCardForm =
      PaymentMethodEnum.NEW_MANGOPAY_CREDIT_CARD === selectedPaymentMethod &&
      !validateCardDetails(newCardDetails);

    const disableDueToPaymentMethod =
      isFiat &&
      !paymentRequestButtonEnabled &&
      !paymentMethod &&
      disableDueToImcompletCardForm;

    const disableDueToUnconfirmedDevice =
      !isFiat && !currentUser?.confirmedDevice;

    const disableDueToPendingRecoveryWallet = !isFiat && walletNeedsRecover;

    return (
      disableDueToUnconfirmedDevice ||
      disableDueToPaymentMethod ||
      disableDueToPayment ||
      disableDueToPendingRecoveryWallet
    );
  }, [
    newCardDetails,
    isFiat,
    paymentErrors.length,
    paymentMethod,
    paymentRequestButtonEnabled,
    errors.length,
    walletNeedsRecover,
    currentUser?.confirmedDevice,
    selectedPaymentMethod,
    validateCardDetails,
  ]);

  const submit = useCallback(
    (pm?: PaymentMethod | DisposableCard) => {
      trackConfirmPurchaseForm();
      doSubmit(pm);
    },
    [doSubmit, trackConfirmPurchaseForm]
  );

  const onMangopayCardChange = useCallback((card: CreditCardFormResult) => {
    setNewCardDetails(card);
  }, []);

  useEffect(() => {
    if (paymentRequest) {
      const handler = async (ev: PaymentRequestPaymentMethodEvent) => {
        ev.complete('success');
        setPaymentMethod(ev.paymentMethod);
        submit(ev.paymentMethod);
      };
      paymentRequest.on('paymentmethod', handler);

      return () => {
        paymentRequest.off('paymentmethod', handler);
      };
    }
    return () => {};
  }, [paymentRequest, setPaymentMethod, submit]);

  const isLoading =
    loadingPolling ||
    loadingWallet ||
    processingFiat ||
    (isFiat && loadingFiat);

  return (
    <Dialog
      open
      maxWidth="xs"
      fullWidth
      onBack={onBack}
      onClose={onClose}
      fullScreen={!upTablet}
      title={<Centered>{title}</Centered>}
      // We do not want this modal to steal focus from a 3DS iframe modal
      disableEnforceFocus
      body={
        <Content>
          {auction && (
            <BidContent
              referenceCurrency={referenceCurrency}
              isLoading={isLoading}
              auction={auction}
              outBidByAutoBid={outBidByAutoBid}
              setOutBidCallback={setOutBidCallback}
            />
          )}
          {OrderSummary && <OrderSummary isFiat={isFiat} />}
          {!hideSummaryTable && (
            <SummaryTable
              sport={sport}
              subtotalMonetaryAmount={monetaryAmount}
              totalMonetaryAmount={totalMonetaryAmount}
              fees={fees}
              feesMonetaryAmount={feesMonetaryAmount}
              usingConversionCredit={usingConversionCredit}
              isFiat={isFiat}
              isCreditCard={isCreditCard}
              customAmountDisplay={customAmountDisplay}
              hideFees={hideFees}
              hideSubtotal={hideSubtotal}
              canChangeRefCurrency={canChangeRefCurrency}
              conversionCreditMonetaryAmount={conversionCreditMonetaryAmount}
            />
          )}
          <Methods
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            creditCardMethodsDisabled={creditCardMethodsDisabled}
            onMangopayCardChange={onMangopayCardChange}
            closePaymentBox={onClose}
            sport={sport}
          />
          {errors.length > 0 && (
            <Caption color="var(--c-red-600)">
              {errors
                .map(error => {
                  if (typeof error === 'string') return error;
                  return formatMessage(error);
                })
                .join(', ')}
            </Caption>
          )}
          <Action>
            {paymentRequestButtonEnabled && paymentRequest && !isDisabled ? (
              <PaymentRequestButton>
                <PaymentRequestButtonElement
                  options={{
                    paymentRequest,
                    style: {
                      paymentRequestButton: {
                        type: 'buy',
                        theme: 'dark',
                        height: '40px',
                      },
                    },
                  }}
                />
              </PaymentRequestButton>
            ) : (
              <LoadingButton
                medium
                loading={isLoading}
                color="blue"
                disabled={isDisabled}
                onClick={() => submit()}
              >
                <FormattedMessage {...cta} />
              </LoadingButton>
            )}
          </Action>
        </Content>
      }
    />
  );
};

export default PaymentBox;

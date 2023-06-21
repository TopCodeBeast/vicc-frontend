import { PaymentMethod, PaymentRequest } from '@stripe/stripe-js';
import { ReactNode, createContext, useContext } from 'react';
import { MessageDescriptor } from 'react-intl';

import {
  Sport,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import { MonetaryAmountOutput } from '@sorare/core/src/hooks/useMonetaryAmount';
import { Currency } from '@sorare/core/src/lib/currency';

import { PaymentProvider_auction } from '../PaymentProvider/__generated__/fragments.graphql';
import {
  PaymentProvider_paymentMethod,
  WalletPaymentMethod,
} from '../PaymentProvider/types';
import { CanMakePaymentResult } from '../PaymentProvider/usePaymentRequest';
import { DisposableCard } from '../PaymentProvider/useStripePayment';

type PaymentContext = {
  auction?: PaymentProvider_auction;
  currencies: Currency[];
  cta: MessageDescriptor;
  defaultMonetaryAmount: MonetaryAmountOutput;
  monetaryAmount: MonetaryAmountOutput;
  fiatCurrency: string;
  paymentMethodsLoading: boolean;
  paymentMethod:
    | PaymentProvider_paymentMethod
    | DisposableCard
    | PaymentMethod
    | WalletPaymentMethod
    | null;
  saveCreditCard: boolean;
  toggleSaveCreditCard: () => void;
  amountTooLow?: boolean;
  totalMonetaryAmount: MonetaryAmountOutput;
  feesMonetaryAmount: MonetaryAmountOutput;
  updateAmountFromFiat: (
    amount: number,
    supportedCurrency: SupportedCurrency
  ) => void;
  submitWithFiat: (pm?: PaymentMethod | DisposableCard) => Promise<void>;
  submitWithWallet: () => Promise<void>;
  processingFiat: boolean;
  loadingFiat: boolean;
  loadingWallet: boolean;
  updateAmountFromEth: (amount: number) => void;
  setActiveFee: (activeFee: boolean) => void;
  errors: MessageDescriptor[];
  stripeErrors: string[];
  paymentMethods: PaymentProvider_paymentMethod[] | null;
  paymentRequest: PaymentRequest | null;
  canMakePaymentWithPaymentRequest: CanMakePaymentResult | null;
  paymentRequestButtonEnabled: boolean;
  enablePaymentRequestButton: (b: boolean) => void;
  setPaymentMethod: (
    paymentMethod:
      | PaymentProvider_paymentMethod
      | DisposableCard
      | PaymentMethod
      | WalletPaymentMethod
      | null
  ) => void;
  fees: number;
  usingConversionCredit: boolean;
  setUsingConversionCredit: (bool: boolean) => void;
  readablePercentageDiscount: string;
  conversionCreditMonetaryAmount: MonetaryAmountOutput;
  maxDiscountMonetary?: MonetaryAmountOutput;
  paymentCurrency: Currency | null;
  setPaymentCurrency: (c: Currency) => void;
  isFiat: boolean;
  isCreditCard: boolean;
  buyOnAuctionPoweredByAlgolia: ReactNode;
  sport: Sport;
  insufficientFundsInEthWallet: boolean;
  insufficientFundsInFiatWallet: boolean;
  referenceCurrency: SupportedCurrency;
};

export const paymentContext = createContext<PaymentContext | null>(null);

export const usePaymentContext = () => useContext(paymentContext)!;

export default paymentContext.Provider;

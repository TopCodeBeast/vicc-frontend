import { PaymentMethod as StripePaymentMethod } from '@stripe/stripe-js';

import { Currency } from '@sorare/core/src/__generated__/globalTypes';
import CreditCard from '@sorare/core/src/components/buyActions/CreditCard';

import EthWallet from '@marketplace/components/buyActions/PaymentBox/Methods/EthWallet';
import FiatWallet from '@marketplace/components/buyActions/PaymentBox/Methods/FiatWallet';
import NewCreditCard from '@marketplace/components/buyActions/PaymentBox/Methods/NewCreditCard';
import {
  PaymentProvider_paymentMethod,
  WalletPaymentMethod,
} from '@marketplace/components/buyActions/PaymentProvider/types';
// import { DisposableCard } from '@marketplace/components/buyActions/PaymentProvider/useStripePayment';

type DisposableCard = any;

export type Props = {
  paymentCurrency: Currency | null;
  paymentMethod:
    | PaymentProvider_paymentMethod
    | DisposableCard
    | StripePaymentMethod
    | WalletPaymentMethod
    | null;
};

export const SelectedPaymentMethodForConfirmation = ({
  paymentCurrency,
  paymentMethod,
}: Props) => {
  if (!paymentCurrency) return null;

  if (paymentCurrency === Currency.ETH) return <EthWallet withoutBalance />;

  if (paymentMethod) {
    if (paymentMethod === WalletPaymentMethod.FIAT_WALLET) {
      return <FiatWallet withoutBalance />;
    }
    if ((paymentMethod as PaymentProvider_paymentMethod)?.card?.last4) {
      return (
        <CreditCard
          creditCard={(paymentMethod as PaymentProvider_paymentMethod).card}
          selected
        />
      );
    }
  }

  return <NewCreditCard />;
};
export default SelectedPaymentMethodForConfirmation;

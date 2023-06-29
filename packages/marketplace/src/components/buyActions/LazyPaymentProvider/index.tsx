import { ReactNode, Suspense } from 'react';

import { lazy } from '@sorare/core/src/lib/retry';

import { Props as PaymentBoxProps } from '../PaymentBox';
import { PaymentProps } from '../PaymentProvider';

const StripeProvider = lazy(
  async () => import('@sorare/core/src/contexts/stripe/Provider')
);
const PaymentProvider = lazy(
  async () => import('@marketplace/components/buyActions/PaymentProvider')
);
const PaymentBox = lazy(async () => import('@marketplace/components/buyActions/PaymentBox'));

interface Props {
  fallback?: ReactNode;
  paymentProps: PaymentProps;
  paymentBoxProps: PaymentBoxProps;
}

export const LazyPaymentProvider = ({
  paymentProps,
  paymentBoxProps,
  fallback = null,
}: Props) => {
  return (
    <Suspense fallback={fallback}>
      <StripeProvider>
        <PaymentProvider {...paymentProps}>
          <PaymentBox {...paymentBoxProps} />
        </PaymentProvider>
      </StripeProvider>
    </Suspense>
  );
};

export default LazyPaymentProvider;

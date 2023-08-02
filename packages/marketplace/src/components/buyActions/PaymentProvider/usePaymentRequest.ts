import { useStripe } from '@stripe/react-stripe-js';
import { PaymentRequest } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';

export type CanMakePaymentResult = {
  applePay: boolean;
  googlePay: boolean;
  link: boolean;
};

// Creates a PaymentRequest used to display a Google Pay or Apple Pay button when available
export default (label: string, totalFiatAmountInCents: number) => {
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null
  );
  const [
    canMakePaymentWithPaymentRequest,
    setCanMakePaymentWithPaymentRequest,
  ] = useState<CanMakePaymentResult | null>(null);
  const currentUser = useCurrentUserContext();
  const stripe = useStripe();
  const currency = currentUser.fiatCurrency.code;

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'FR',
        currency: currency.toLowerCase(),
        total: {
          label,
          amount: totalFiatAmountInCents,
        },
        requestPayerEmail: true,
      });
      setPaymentRequest(null);

      pr.canMakePayment().then(result => {
        if (result) {
          setPaymentRequest(pr);
          setCanMakePaymentWithPaymentRequest(result as CanMakePaymentResult);
        }
      });
    }
  }, [currency, label, stripe, totalFiatAmountInCents]);

  return { paymentRequest, canMakePaymentWithPaymentRequest };
};

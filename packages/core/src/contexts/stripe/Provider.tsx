import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ReactNode, memo, useMemo } from 'react';

import { AvailableLocale, STRIPE_LOCALES, useIntlContext } from '@core/contexts/intl';

import { STRIPE_PUBLIC_KEY } from '../../config';

interface Props {
  children?: ReactNode;
}

export const StripeProvider = ({ children }: Props) => {
  const { locale } = useIntlContext();
  const stripe = useMemo(
    async () =>
      loadStripe(STRIPE_PUBLIC_KEY, {
        locale: STRIPE_LOCALES[locale as AvailableLocale],
      }),
    [locale]
  );

  return <Elements stripe={stripe}>{children}</Elements>;
};

export default memo(StripeProvider);

import { AcceptCashOnly } from '@sorare/core/src/components/settings/AcceptCashOnly';
import { AcceptedCurrencies } from '@sorare/core/src/components/settings/AcceptedCurrencies';
import Currency from '@sorare/core/src/components/settings/Currency';
import PaymentMethods from '@sorare/core/src/components/settings/PaymentMethods';
import PostalAddress from '@sorare/core/src/components/settings/PostalAddress';
import { RewardCurrency } from '@sorare/core/src/components/settings/RewardCurrency';

import { SettingsTabRoot } from 'Settings/ui';

export const Payment = () => {
  return (
    <SettingsTabRoot>
      <Currency />
      <PaymentMethods />
      <AcceptedCurrencies />
      <AcceptCashOnly />
      <RewardCurrency />
      <PostalAddress />
    </SettingsTabRoot>
  );
};

export default Payment;

import Currency from '@sorare/core/src/components/settings/Currency';
import PaymentMethods from '@sorare/core/src/components/settings/PaymentMethods';

import { SettingsTabRoot } from 'Settings/ui';

export const Payment = () => {
  return (
    <SettingsTabRoot>
      <Currency />
      <PaymentMethods />
    </SettingsTabRoot>
  );
};

export default Payment;

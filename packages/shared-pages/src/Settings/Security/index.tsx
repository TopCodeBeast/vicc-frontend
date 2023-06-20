import DevicesManagement from '@sorare/core/src/components/settings/DevicesManagement';
import PhoneNumberVerification from '@sorare/core/src/components/settings/PhoneNumberVerification';
import Privacy from '@sorare/core/src/components/settings/Privacy';
import RecoveringYourWallet from '@sorare/core/src/components/settings/RecoveringYourWallet';
import SigningIntoSorare from '@sorare/core/src/components/settings/SigningIntoSorare';

import { SettingsTabRoot } from 'Settings/ui';

export const Security = () => {
  return (
    <SettingsTabRoot>
      <SigningIntoSorare />
      <PhoneNumberVerification />
      <RecoveringYourWallet />
      <Privacy />
      <DevicesManagement />
    </SettingsTabRoot>
  );
};

export default Security;

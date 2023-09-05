import DevicesManagement from '@sorare/core/src/components/settings/DevicesManagement';
import { OAuthTokensManagement } from '@sorare/core/src/components/settings/OAuthTokensManagement';
import PhoneNumberVerification from '@sorare/core/src/components/settings/PhoneNumberVerification';
import Privacy from '@sorare/core/src/components/settings/Privacy';
import RecoveringYourWallet from '@sorare/core/src/components/settings/RecoveringYourWallet';
import SigningIntoVicc from '@sorare/core/src/components/settings/SigningIntoSorare';

import { SettingsTabRoot } from '@shared-pages/Settings/ui';

export const Security = () => {
  return (
    <SettingsTabRoot>
      <SigningIntoVicc />
      <PhoneNumberVerification />
      <RecoveringYourWallet />
      <Privacy />
      <DevicesManagement />
      <OAuthTokensManagement />
    </SettingsTabRoot>
  );
};

export default Security;

import { Divider } from '@material-ui/core';
import { defineMessage } from 'react-intl';

import SettingsSection from '../SettingsSection';
// import Update2FA from '../Update2FA';
import UpdatePassword from '../UpdatePassword';

const title = defineMessage({
  id: 'Settings.SigningIntoSorare.title',
  defaultMessage: 'Signing into Sorare',
});

const SigningIntoSorare = () => {
  return (
    <SettingsSection title={title}>
      <UpdatePassword />
      <Divider />
      {/* <Update2FA /> */}
    </SettingsSection>
  );
};

export default SigningIntoSorare;

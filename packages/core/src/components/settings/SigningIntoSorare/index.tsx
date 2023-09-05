import { Divider } from '@material-ui/core';
import { defineMessage } from 'react-intl';

import SettingsSection from '../SettingsSection';
import Update2FA from '../Update2FA';
import UpdatePassword from '../UpdatePassword';

const title = defineMessage({
  id: 'Settings.SigningIntoVicc.title',
  defaultMessage: 'Signing into Vicc',
});

const SigningIntoVicc = () => {
  return (
    <SettingsSection title={title}>
      <UpdatePassword />
      <Divider />
      <Update2FA />
    </SettingsSection>
  );
};

export default SigningIntoVicc;

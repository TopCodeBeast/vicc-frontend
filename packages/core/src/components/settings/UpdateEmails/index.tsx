import { Divider } from '@material-ui/core';
import { defineMessages } from 'react-intl';

import RecoveryEmail from '../RecoveryEmail';
import SettingsSection from '../SettingsSection';
import UpdateEmail from '../UpdateEmail';

const messages = defineMessages({
  title: {
    id: 'Settings.updateEmails.title',
    defaultMessage: 'Emails',
  },
});

export const UpdateEmails = () => {
  return (
    <SettingsSection {...messages}>
      <UpdateEmail />
      <Divider />
      <RecoveryEmail />
    </SettingsSection>
  );
};

export default UpdateEmails;

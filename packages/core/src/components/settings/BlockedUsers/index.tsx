import { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '@sorare/core/src/atoms/buttons/Button';

import SettingsSection from '../SettingsSection';
import BlockedUsersDialog from './BlockedUsersDialog';

const messages = defineMessages({
  title: {
    id: 'Settings.blockedUsers.title',
    defaultMessage: 'Blocked Managers',
  },
  description: {
    id: 'Settings.blockedUsers.description',
    defaultMessage: 'Manage the list of the managers you’ve blocked',
  },
  cta: {
    id: 'Settings.blockedUsers.cta',
    defaultMessage: 'Manage',
  },
});

const BlockedUsers = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  return (
    <SettingsSection {...messages}>
      <div>
        <Button small color="darkGray" onClick={() => setOpenDialog(true)}>
          <FormattedMessage {...messages.cta} />
        </Button>
      </div>
      {openDialog && (
        <BlockedUsersDialog onClose={() => setOpenDialog(false)} />
      )}
    </SettingsSection>
  );
};

export default BlockedUsers;

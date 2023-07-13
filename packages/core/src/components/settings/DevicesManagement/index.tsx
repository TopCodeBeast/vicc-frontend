import { Divider } from '@material-ui/core';
import { defineMessage } from 'react-intl';

import Devices from '../Devices';
import LogOutAllDevices from '../LogOutAllDevices';
import SettingsSection from '../SettingsSection';

const title = defineMessage({
  id: 'Settings.DevicesManagement.title',
  defaultMessage: 'Devices',
});

const DevicesManagement = () => {
  return (
    <SettingsSection title={title}>
      <LogOutAllDevices />
      <Divider />
      <Devices />
    </SettingsSection>
  );
};

export default DevicesManagement;

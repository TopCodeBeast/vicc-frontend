import { defineMessages } from 'react-intl';

import ConnectedOauths from '../ConnectedOauths';
import DiscordAccount from '../DiscordAccount';
import SettingsSection from '../SettingsSection';
import TwitterAccount from '../TwitterAccount';

const messages = defineMessages({
  title: {
    id: 'Settings.connectedAccounts.title',
    defaultMessage: 'Connected Accounts',
  },
  description: {
    id: 'Settings.connectedAccounts.description',
    defaultMessage:
      'Connect your social media accounts to help others communicate with you.',
  },
});

const ConnectedAccounts = () => {
  return (
    <SettingsSection {...messages}>
      <ConnectedOauths />
      <TwitterAccount />
      <DiscordAccount />
    </SettingsSection>
  );
};

export default ConnectedAccounts;

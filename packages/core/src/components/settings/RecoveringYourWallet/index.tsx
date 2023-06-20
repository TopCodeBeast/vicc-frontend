import { Divider } from '@material-ui/core';
import { FormattedMessage, defineMessages } from 'react-intl';

import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import { Input } from 'components/form/Form/IntlTelInput';
import { useCurrentUserContext } from 'contexts/currentUser';
import { glossary, userAttributes } from '@sorare/core/src/lib/glossary';

import PhoneNumberVerificationSection from '../PhoneNumberVerification/PhoneNumberVerificationSection';
import RecoveryEmail from '../RecoveryEmail';
import SettingsSection from '../SettingsSection';

const messages = defineMessages({
  title: {
    id: 'Settings.RecoveringYourWallet.title',
    defaultMessage: 'Recovering your wallet',
  },
  description: {
    id: 'Settings.RecoveringYourWallet.description',
    defaultMessage:
      'You can receive a unique wallet recovery key to any of the methods below to help you recover your Sorare wallet after you change your account password or if you don’t log in for an extended time.',
  },
});
const RecoveringYourWallet = () => {
  const { currentUser } = useCurrentUserContext();
  if (!currentUser) return null;
  const { email, phoneNumber } = currentUser;

  return (
    <SettingsSection {...messages}>
      <Text16>
        <FormattedMessage {...glossary.accountEmail} />
      </Text16>
      <Text14>{email}</Text14>
      <Divider />
      <RecoveryEmail />
      <Divider />
      <Text16>
        <FormattedMessage {...userAttributes.phoneNumber} />
      </Text16>
      {phoneNumber ? (
        <Input phone={phoneNumber} noBorder disabled />
      ) : (
        <PhoneNumberVerificationSection currentUser={currentUser} />
      )}
    </SettingsSection>
  );
};

export default RecoveringYourWallet;

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';

import SettingsSection from '../SettingsSection';
import PhoneNumberVerificationSection from './PhoneNumberVerificationSection';
import messages from './i18n';

const PhoneNumberVerification = () => {
  const { currentUser } = useCurrentUserContext();

  const {
    flags: { allowPhoneNumberChanging = true },
  } = useFeatureFlags();

  if (!currentUser || !allowPhoneNumberChanging) return null;

  return (
    <SettingsSection
      title={messages.phoneNumberVerification}
      description={
        !currentUser?.phoneNumber
          ? [messages.noticeFirstParagraph, messages.noticeSecondParagraph]
          : undefined
      }
    >
      <PhoneNumberVerificationSection currentUser={currentUser} />
    </SettingsSection>
  );
};

export default PhoneNumberVerification;

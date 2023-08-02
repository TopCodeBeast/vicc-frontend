import { useEffect, useState } from 'react';

import Dialog from '@core/atoms/layout/Dialog';
import EnterVerificationCode from '@core/components/settings/PhoneNumberVerification/EnterVerificationCode';
import Header from '@core/components/settings/PhoneNumberVerification/Header';
import SendVerificationCode from '@core/components/settings/PhoneNumberVerification/SendVerificationCode';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';
import { useWalletContext } from '@core/contexts/wallet';
import useEvents from '@core/lib/events/useEvents';

import messages from './i18n';
import useVerifyPhoneNumber, {
  canProceedToVerificationCodeInput,
} from './useVerifyPhoneNumber';

interface Props {
  onCancel?: () => void;
}

export const VerifyPhoneNumber = ({ onCancel }: Props) => {
  const { currentUser } = useCurrentUserContext();
  const [enterPhoneNumber, setEnterPhoneNumber] = useState<boolean>();
  const track = useEvents();

  const [unverifiedPhoneNumber, setUnverifiedPhoneNumber] = useState(
    currentUser?.unverifiedPhoneNumber || ''
  );

  const { showNotification } = useSnackNotificationContext();
  const verifyPhoneNumber = useVerifyPhoneNumber();
  const { checkUserPhoneNumberVerificationCodeWithRecovery } =
    useWalletContext();

  const shouldOpen = currentUser && !currentUser.phoneNumberVerified;
  useEffect(() => {
    if (shouldOpen) {
      track('Show VerifyPhoneNumber');
    }
  }, [shouldOpen, track]);

  const enterCode =
    currentUser?.phoneNumberVerificationRequested && !enterPhoneNumber;

  if (!shouldOpen) return null;

  const sendVerificationCode = async (phoneNumber: string) =>
    verifyPhoneNumber(phoneNumber).then(res => {
      if (canProceedToVerificationCodeInput(res)) {
        setUnverifiedPhoneNumber(phoneNumber);
        setEnterPhoneNumber(false);
      }
      return res || [];
    });

  const submitVerificationCode = async (verificationCode: string) =>
    checkUserPhoneNumberVerificationCodeWithRecovery(verificationCode).then(
      res => {
        if (!res || res.length === 0) {
          showNotification('phoneNumberVerified');
        }
        return res || [];
      }
    );

  const onBack = () => setEnterPhoneNumber(true);

  return (
    <Dialog
      open
      noDivider
      maxWidth="md"
      header={
        <Header
          {...(enterCode && { onBack })}
          {...(onCancel && { onClose: onCancel })}
        />
      }
    >
      {enterCode ? (
        <EnterVerificationCode
          resendVerificationCode={async () =>
            verifyPhoneNumber(unverifiedPhoneNumber).then(res => res || [])
          }
          phoneNumber={unverifiedPhoneNumber}
          submitVerificationCode={submitVerificationCode}
          onCancel={onBack}
        />
      ) : (
        <SendVerificationCode
          currentUser={currentUser}
          sendVerificationCode={sendVerificationCode}
          title={messages.title}
        />
      )}
    </Dialog>
  );
};

export default VerifyPhoneNumber;

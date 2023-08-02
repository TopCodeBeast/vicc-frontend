import { useCallback } from 'react';

import SendVerificationCode from '@core/components/settings/PhoneNumberVerification/SendVerificationCode';
import useVerifyPhoneNumber from '@core/components/user/VerifyPhoneNumber/useVerifyPhoneNumber';
import { useCurrentUserContext } from '@core/contexts/currentUser';

type Props = {
  onSuccess: (phoneNumber: string) => void;
};

export const AddPhoneNumber = ({ onSuccess }: Props) => {
  const { currentUser } = useCurrentUserContext();

  const verifyPhoneNumber = useVerifyPhoneNumber();

  const sendVerificationCode = useCallback(
    async (phoneNumber: any) =>
      verifyPhoneNumber(phoneNumber).then(async res => {
        return Promise.resolve(res || []);
      }),
    [verifyPhoneNumber]
  );

  if (!currentUser) return null;

  return (
    <SendVerificationCode
      currentUser={currentUser}
      sendVerificationCode={sendVerificationCode}
      onSuccess={onSuccess}
    />
  );
};
export default AddPhoneNumber;

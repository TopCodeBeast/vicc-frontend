import { useCallback } from 'react';

import SendVerificationCode from 'components/settings/PhoneNumberVerification/SendVerificationCode';
import useVerifyPhoneNumber from 'components/user/VerifyPhoneNumber/useVerifyPhoneNumber';
import { useCurrentUserContext } from 'contexts/currentUser';

type Props = {
  onSuccess: (phoneNumber: string) => void;
};

export const AddPhoneNumber = ({ onSuccess }: Props) => {
  const { currentUser } = useCurrentUserContext();

  const verifyPhoneNumber = useVerifyPhoneNumber();

  const sendVerificationCode = useCallback(
    async phoneNumber =>
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

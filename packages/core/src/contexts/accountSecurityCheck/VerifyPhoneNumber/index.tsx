import { useCallback } from 'react';

import EnterVerificationCode from 'components/settings/PhoneNumberVerification/EnterVerificationCode';
import useVerifyPhoneNumber from 'components/user/VerifyPhoneNumber/useVerifyPhoneNumber';
import { useCurrentUserContext } from 'contexts/currentUser';
import { useWalletContext } from 'contexts/wallet';

type Props = {
  unverifiedPhoneNumber: string;
  onSuccess: () => void;
  onCancel: () => void;
};
export const VerifyPhoneNumber = ({
  unverifiedPhoneNumber,
  onSuccess,
  onCancel,
}: Props) => {
  const { currentUser } = useCurrentUserContext();
  const verifyPhoneNumber = useVerifyPhoneNumber();

  const { checkUserPhoneNumberVerificationCodeWithRecovery } =
    useWalletContext();

  const submitVerificationCode = useCallback(
    async verificationCode =>
      checkUserPhoneNumberVerificationCodeWithRecovery(verificationCode),
    [checkUserPhoneNumberVerificationCodeWithRecovery]
  );

  if (!currentUser) return null;
  return (
    <EnterVerificationCode
      resendVerificationCode={async () =>
        verifyPhoneNumber(unverifiedPhoneNumber).then(res => res || [])
      }
      phoneNumber={unverifiedPhoneNumber}
      submitVerificationCode={submitVerificationCode}
      onCancel={onCancel}
      onSuccess={onSuccess}
    />
  );
};
export default VerifyPhoneNumber;

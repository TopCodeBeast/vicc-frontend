import { useCallback } from 'react';

import EnterVerificationCode from '@core/components/settings/PhoneNumberVerification/EnterVerificationCode';
import useVerifyPhoneNumber from '@core/components/user/VerifyPhoneNumber/useVerifyPhoneNumber';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useWalletContext } from '@core/contexts/wallet';

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
    async (verificationCode: any) =>
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

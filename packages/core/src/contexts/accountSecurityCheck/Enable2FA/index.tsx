import { useState } from 'react';

import Enable2FAForm from 'components/settings/Update2FA/Enable2FA/Enable2FAForm';
import RecoveryCodesDialogContent from 'components/settings/Update2FA/RecoveryCodesDialog/RecoveryCodesDialogContent';

type Props = {
  onClose: () => void;
};
export const Enable2FA = ({ onClose }: Props) => {
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);

  if (recoveryCodes)
    return (
      <RecoveryCodesDialogContent codes={recoveryCodes} onClose={onClose} />
    );

  return (
    <Enable2FAForm
      onEnabling2FA={(codes: string[]) => {
        setRecoveryCodes(codes);
      }}
    />
  );
};

import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import LoadingButton from '@core/atoms/buttons/LoadingButton';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';
import useUpdate2FA from '@core/hooks/useUpdate2FA';

export const RecoveryCodes = ({
  setRecoveryCodes,
}: {
  setRecoveryCodes: (codes: string[] | null) => void;
}) => {
  const [generatingRecoveryCodes, setGeneratingRecoveryCodes] = useState(false);

  const { showNotification } = useSnackNotificationContext();

  const { generateRecoveryCodesMutation } = useUpdate2FA();

  const onGenerateBackupCodes = async () => {
    setGeneratingRecoveryCodes(true);

    const result = await generateRecoveryCodesMutation({
      variables: { input: {} },
    });

    if (result.errors) {
      showNotification('errors', { errors: result.errors });
    } else if (result.data?.generateOtpBackupCodes) {
      setGeneratingRecoveryCodes(false);
      setRecoveryCodes(result.data.generateOtpBackupCodes.otpBackupCodes);
    }
  };

  return (
    <LoadingButton
      color="darkGray"
      small
      dots
      onClick={() => {
        onGenerateBackupCodes();
      }}
      loading={generatingRecoveryCodes}
    >
      <FormattedMessage
        id="Settings.recoveryCodes.regenerateButton"
        defaultMessage="Regenerate recovery codes"
      />
    </LoadingButton>
  );
};

export default RecoveryCodes;

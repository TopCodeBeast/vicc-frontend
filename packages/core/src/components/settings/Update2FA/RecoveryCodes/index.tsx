import { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import LoadingButton from '@core/atoms/buttons/LoadingButton';
import { GraphQLResult } from '@core/components/form/Form';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';
import { GenerateOtpBackupCodesMutationVariables } from '@core/hooks/__generated__/useUpdate2FA.graphql';
import useUpdate2FA from '@core/hooks/useUpdate2FA';

import { Behind2FADialog, Centered } from '../Behind2FADialog';

const messages = defineMessages({
  cta: {
    id: 'Settings.recoveryCodes.regenerateButton',
    defaultMessage: 'Regenerate recovery codes',
  },
  dialogDescription: {
    id: 'Settings.recoveryCodes.dialogDescription',
    defaultMessage:
      'Please type an authentication code to regenerate recovery codes',
  },
  dialogDescriptionRecovery: {
    id: 'Settings.recoveryCodes.dialogDescriptionRecovery',
    defaultMessage:
      "If you've lost your device, you may enter one of your recovery codes.",
  },
  submit: {
    id: 'Settings.recoveryCodes.submit',
    defaultMessage: 'Regenerate recovery codes',
  },
});

export const RecoveryCodes = ({
  setRecoveryCodes,
}: {
  setRecoveryCodes: (codes: string[] | null) => void;
}) => {
  const [generatingRecoveryCodes, setGeneratingRecoveryCodes] = useState(false);

  const { showNotification } = useSnackNotificationContext();

  const { generateRecoveryCodesMutation } = useUpdate2FA();

  const [generateRecoveryCodesDialog, setGenerateRecoveryCodesDialog] =
    useState(false);

  const generateBackupCodes = async (
    attributes: Partial<GenerateOtpBackupCodesMutationVariables['input']>,
    doOnResult: (result: GraphQLResult) => void
  ) => {
    setGeneratingRecoveryCodes(true);

    try {
      const { data, errors } = await generateRecoveryCodesMutation({
        variables: {
          input: { ...(attributes || {}) },
        },
      });

      if (errors) {
        showNotification('errors', { errors });
        doOnResult({
          errors: errors.map(error => ({
            message: error.message,
          })),
        });
      } else if (data?.generateOtpBackupCodes) {
        doOnResult(data.generateOtpBackupCodes);
        if (data.generateOtpBackupCodes.errors.length === 0) {
          setRecoveryCodes(data.generateOtpBackupCodes.otpBackupCodes);
        }
      }
    } catch (e) {
      doOnResult({
        error: `${e}`,
      });
    } finally {
      setGeneratingRecoveryCodes(false);
    }
  };

  return (
    <div>
      <LoadingButton
        color="darkGray"
        small
        dots
        onClick={() => {
          setGenerateRecoveryCodesDialog(true);
        }}
        loading={generatingRecoveryCodes}
      >
        <FormattedMessage {...messages.cta} />
      </LoadingButton>
      <Behind2FADialog
        opened={generateRecoveryCodesDialog}
        setOpened={setGenerateRecoveryCodesDialog}
        submit={generateBackupCodes}
        submitMessage={messages.submit}
        onSuccess={() => setGenerateRecoveryCodesDialog(false)}
        submitButtonProps={{
          color: 'darkGray',
        }}
      >
        <Centered>
          <FormattedMessage {...messages.dialogDescription} />
        </Centered>
        <Centered>
          <FormattedMessage {...messages.dialogDescriptionRecovery} />
        </Centered>
      </Behind2FADialog>
    </div>
  );
};

export default RecoveryCodes;

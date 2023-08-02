import { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { PasswordError } from '@sorare/wallet-shared';
import Button from '@core/atoms/buttons/Button';
import { GraphQLResult } from '@core/components/form/Form';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';
import { useWalletContext } from '@core/contexts/wallet';
import useUpdate2FA from '@core/hooks/useUpdate2FA';

import { Behind2FADialog, Centered, WithOtpAttempt } from '../Behind2FADialog';

const messages = defineMessages({
  cta: {
    id: 'Settings.disable2FA.cta',
    defaultMessage: 'Disable 2FA',
  },
  dialogDescription: {
    id: 'Settings.disable2FA.dialogDescription',
    defaultMessage: 'Please type an authentication code to disable your 2FA.',
  },
  dialogDescriptionRecovery: {
    id: 'Settings.disable2FA.dialogDescriptionRecovery',
    defaultMessage:
      "If you've lost your device, you may enter one of your recovery codes.",
  },
  submit: {
    id: 'Settings.disable2FA.submit',
    defaultMessage: 'Disable 2FA',
  },
});

type PasswordPromptOptions = { error?: PasswordError };

const INVALID_PASSWORD = 7_000;

export const Disable2FA = () => {
  const { getPassword } = useWalletContext();

  const [disable2FADialog, setDisable2FADialog] = useState(false);
  const [latestPasswordHash, setLatestPasswordHash] = useState<string>();
  const { showNotification } = useSnackNotificationContext();
  const { currentUser } = useCurrentUserContext();

  const { disable2FAMutation } = useUpdate2FA();

  if (!currentUser) return null;

  const doDisable2FAMutation = async (
    attributes: WithOtpAttempt,
    password: string
  ): ReturnType<typeof disable2FAMutation> => {
    return disable2FAMutation({
      variables: {
        input: {
          ...attributes,
          password,
        },
      },
    });
  };

  const promptForPassword = async ({ error }: PasswordPromptOptions = {}) => {
    const currentPasswordHash = await getPassword({
      error,
      unlockWallet: false,
    });
    if (!currentPasswordHash) {
      setDisable2FADialog(false);
      return undefined;
    }
    setLatestPasswordHash(currentPasswordHash);
    setDisable2FADialog(true);
    return currentPasswordHash;
  };

  const promptForPasswordIfNecessaryAndDisable2Fa = async (
    attributes: WithOtpAttempt,
    password: string | undefined,
    passwordPromptOptions?: PasswordPromptOptions
  ) => {
    const usedPassword =
      password || (await promptForPassword(passwordPromptOptions));
    if (!usedPassword) {
      return undefined;
    }
    return doDisable2FAMutation(attributes, usedPassword);
  };

  const submit = async (
    attributes: WithOtpAttempt,
    onResult: (result: GraphQLResult) => void,
    onCancel: () => void
  ) => {
    let result = await promptForPasswordIfNecessaryAndDisable2Fa(
      attributes,
      latestPasswordHash
    );
    while (result?.data?.disable2Fa) {
      const { disable2Fa } = result.data;
      if (disable2Fa.errors.length === 0) {
        onResult(disable2Fa);
        return;
      }
      if (disable2Fa.errors[0].code === INVALID_PASSWORD) {
        // retry forcing a new password to be input
        // eslint-disable-next-line no-await-in-loop
        result = await promptForPasswordIfNecessaryAndDisable2Fa(
          attributes,
          undefined,
          { error: PasswordError.INVALID_PASSWORD }
        );
      } else {
        onResult(disable2Fa);
        return;
      }
    }
    onCancel();
  };

  const onSuccess = () => {
    showNotification('2faDisabled');
  };

  return (
    <div>
      <Button
        small
        onClick={() => {
          promptForPassword();
        }}
        color="red"
        stroke
      >
        <FormattedMessage {...messages.cta} />
      </Button>
      <Behind2FADialog
        opened={disable2FADialog}
        setOpened={setDisable2FADialog}
        submit={submit}
        submitMessage={messages.submit}
        onSuccess={onSuccess}
        submitButtonProps={{
          color: 'red',
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

export default Disable2FA;

import { FunctionComponent, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import Dialog from '@sorare/core/src/atoms/layout/Dialog';
import { Text16, Title5 } from '@sorare/core/src/atoms/typography';
import {
  GraphQLResult,
  GraphqlForm,
  SubmitButtonProps,
  TextField,
} from 'components/form/Form';
import { OTP_ATTEMPT_LENGTH } from '@sorare/core/src/constants/verificationCode';
import { useCurrentUserContext } from 'contexts/currentUser';
import { useIntlContext } from 'contexts/intl';
import { useSnackNotificationContext } from 'contexts/snackNotification';
import { useWalletContext } from 'contexts/wallet';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useUpdate2FA from '@sorare/core/src/hooks/useUpdate2FA';
import { glossary, userAttributes } from '@sorare/core/src/lib/glossary';

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

const StyledGraphqlForm = styled(GraphqlForm)`
  margin-bottom: 0;
`;
const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--double-unit);
`;
const Centered = styled(Text16)`
  text-align: center;
`;
const DialogForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--double-unit);
  padding: var(--double-unit);
  border: 1px solid var(--c-neutral-300);
  border-radius: var(--double-unit);
  box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.1);
  align-self: stretch;
`;

export const Disable2FA = () => {
  const { formatMessage } = useIntlContext();
  const { getPassword } = useWalletContext();
  const { up: isTablet } = useScreenSize('tablet');

  const [disable2FADialog, setDisable2FADialog] = useState(false);
  const { showNotification } = useSnackNotificationContext();
  const { currentUser } = useCurrentUserContext();

  const { disable2FAMutation } = useUpdate2FA();

  if (!currentUser) return null;

  const submit = async (
    attributes: any,
    onResult: (result: GraphQLResult) => void,
    onCancel: () => void
  ) => {
    const currentPasswordHash = await getPassword();
    if (!currentPasswordHash) {
      onCancel();
      return;
    }

    const { data: mutationData } = await disable2FAMutation({
      variables: {
        input: {
          ...attributes,
          password: currentPasswordHash,
        },
      },
    });
    if (mutationData?.disable2Fa) {
      onResult(mutationData.disable2Fa);
    }
  };

  const onSuccess = () => {
    showNotification('2faDisabled');
  };

  return (
    <div>
      <Button
        small
        onClick={() => setDisable2FADialog(true)}
        color="red"
        stroke
      >
        <FormattedMessage {...messages.cta} />
      </Button>
      <Dialog
        open={disable2FADialog}
        onClose={() => setDisable2FADialog(false)}
        headerCentered
        title={
          <Title5>
            <FormattedMessage {...glossary.twofa} />
          </Title5>
        }
        fullScreen={!isTablet}
      >
        <StyledGraphqlForm
          onSubmit={(values, doOnResult, doOnCancel) => {
            submit(values, doOnResult, doOnCancel);
          }}
          onChange={(values, doSubmit) => {
            const { otpAttempt } = values;
            if (otpAttempt?.length === OTP_ATTEMPT_LENGTH) doSubmit();
          }}
          onSuccess={onSuccess}
          render={(
            Error: React.ComponentType,
            SubmitButton: FunctionComponent<SubmitButtonProps>
          ) => (
            <DialogContent>
              <Centered>
                <FormattedMessage {...messages.dialogDescription} />
              </Centered>
              <Centered>
                <FormattedMessage {...messages.dialogDescriptionRecovery} />
              </Centered>

              <DialogForm>
                <div>
                  <Error />
                </div>

                <Centered
                  bold
                  required
                  name="otpAttempt"
                  label={formatMessage(userAttributes.otpDisableAttempts)}
                  as={TextField}
                />
                <SubmitButton medium stroke color="red">
                  <FormattedMessage {...messages.submit} />
                </SubmitButton>
              </DialogForm>
            </DialogContent>
          )}
        />
      </Dialog>
    </div>
  );
};

export default Disable2FA;

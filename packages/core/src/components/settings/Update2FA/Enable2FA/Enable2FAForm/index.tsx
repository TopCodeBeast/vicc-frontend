import { QRCodeCanvas } from 'qrcode.react';
import { FunctionComponent } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Overline, Text14, Text16, Title5 } from '@core/atoms/typography';
import {
  GraphQLResult,
  GraphqlForm,
  SubmitButtonProps,
  TextField,
} from '@core/components/form/Form';
import { OTP_ATTEMPT_LENGTH } from '@core/constants/verificationCode';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';
import useUpdate2FA from '@core/hooks/useUpdate2FA';

const messages = defineMessages({
  dialogSubtitle: {
    id: 'Settings.enable2FA.dialogSubtitle',
    defaultMessage: 'Setup instructions:',
  },
  dialogDescription1: {
    id: 'Settings.enable2FA.dialogDescription1',
    defaultMessage:
      '1. Download an authenticator app (e.g. Google Authenticator, 1Password, Authy)',
  },
  dialogDescription2: {
    id: 'Settings.enable2FA.dialogDescription2',
    defaultMessage: '2. Scan the QR code using your authenticator app',
  },
  dialogDescription2Subtitle: {
    id: 'Settings.enable2FA.dialogDescription2Subtitle',
    defaultMessage:
      'Or copy this key and enter it manually in your authenticator app',
  },
  dialogDescription3: {
    id: 'Settings.enable2FA.dialogDescription3',
    defaultMessage: '3. Enter the six-digit code',
  },
  submit: {
    id: 'Settings.enable2FA.submit',
    defaultMessage: 'Enable 2FA',
  },
});

const StyledGraphqlForm = styled(GraphqlForm)`
  margin-bottom: 0;
`;

const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  text-align: center;
  align-items: center;
`;

const QRBorder = styled.div`
  .dark-theme & {
    display: inline-flex;
    border: var(--half-unit) solid var(--c-neutral-1000);
  }
`;

const DialogForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--double-unit);
`;

const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

type Props = {
  onEnabling2FA: (codes: string[]) => void;
};
export const Enable2FAForm = ({ onEnabling2FA }: Props) => {
  const { showNotification } = useSnackNotificationContext();

  const {
    enable2FAMutation,
    update2FAQuery: { data },
  } = useUpdate2FA();

  const otpProvisioningUri = data?.currentUser?.otpProvisioningUri;
  const otpCode = otpProvisioningUri
    ? new URL(otpProvisioningUri).searchParams.get('secret')
    : null;

  const submit = async (
    attributes: any,
    onResult: (result: GraphQLResult) => void
  ) => {
    const { data: mutationData } = await enable2FAMutation({
      variables: {
        input: { ...attributes },
      },
    });
    if (mutationData?.enable2Fa) {
      onResult(mutationData.enable2Fa);
    }
  };

  const onSuccess = (result: any) => {
    showNotification('2faEnabled');
    onEnabling2FA(result.otpBackupCodes);
  };

  return (
    <StyledGraphqlForm
      onSubmit={(attributes, doOnResult) => {
        submit(attributes, doOnResult);
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
          <Title5>
            <FormattedMessage {...messages.dialogSubtitle} />
          </Title5>
          <Text16>
            <FormattedMessage {...messages.dialogDescription1} />
          </Text16>
          <Text16>
            <FormattedMessage {...messages.dialogDescription2} />
          </Text16>
          <QRCodeContainer>
            <QRBorder>
              <QRCodeCanvas value={otpProvisioningUri!} />
            </QRBorder>
            <Text14 bold>
              <FormattedMessage {...messages.dialogDescription2Subtitle} />
            </Text14>
            <Overline>{otpCode}</Overline>
          </QRCodeContainer>
          <Text16>
            <FormattedMessage {...messages.dialogDescription3} />
          </Text16>
          <DialogForm>
            <div>
              <Error />
            </div>

            <TextField
              required
              name="otpAttempt"
              autoComplete="one-time-code"
              autoFocus
            />
            <SubmitButton medium color="blue">
              <FormattedMessage {...messages.submit} />
            </SubmitButton>
          </DialogForm>
        </DialogContent>
      )}
    />
  );
};

export default Enable2FAForm;

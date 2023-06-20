import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { useState } from 'react';
import { defineMessages } from 'react-intl';
import styled from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import Dialog, { Actions } from '@sorare/core/src/atoms/layout/Dialog';
import { Text16, Title4, Title5 } from '@sorare/core/src/atoms/typography';
import { GraphQLResult, GraphqlForm, TextField } from 'components/form/Form';
import { OTP_ATTEMPT_LENGTH } from '@sorare/core/src/constants/verificationCode';
import NewDeviceDialog from 'contexts/connection/NewDeviceDialog';
import { useIntlContext } from 'contexts/intl';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { glossary } from '@sorare/core/src/lib/glossary';

type Props = {
  open: boolean;
  reason?: string;
  onSubmit: (values: any, onResult: (result: GraphQLResult) => void) => void;
  onSuccess?: (result: GraphQLResult) => void;
  onError?: (
    result: GraphQLResult & {
      tcuToken?: string;
    }
  ) => void;
  onCancel?: () => void;
  onClose: () => void;
};

const messages = defineMessages({
  field: {
    id: 'Prompt2faDialog.field',
    defaultMessage: 'code',
  },
  authenticateFromNewCountry: {
    id: 'Prompt2faDialog.title.authenticateFromNewCountry',
    defaultMessage: 'Authenticating from another country',
  },
  enterVerificationCodeSentViaEmail: {
    id: 'Prompt2faDialog.authenticateFromNewCountry',
    defaultMessage:
      'Please enter the verification code that you received via email.',
  },
  enter6DigitCodeFromAuthenticatorApp: {
    id: 'Prompt2faDialog.enterCodeFromAuthenticatorApp',
    defaultMessage: 'Enter the 6-digit code from your authenticator app',
  },
  recoveryCode: {
    id: 'Prompt2faDialog.recovery_code',
    defaultMessage:
      "If you've lost your device, you may enter one of your recovery codes.",
  },
  twoFaPlaceHolder: {
    id: 'Prompt2faDialog.2faPlaceHolder',
    defaultMessage: '6-digit code or recovery code',
  },
  verificationCodePlaceHolder: {
    id: 'Prompt2faDialog.verificationCodePlaceHolder',
    defaultMessage: 'Verification code',
  },
});

const CloseButton = styled(IconButton).attrs({
  color: 'transparent',
  icon: faTimes,
  rounded: true,
})`
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: var(--double-unit);
  position: absolute;
  right: 0;
`;

const TitleDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--quadruple-unit);
  width: 100%;
`;

interface TitleProps {
  authenticateFromNewCountry: boolean;
  onClose: () => void;
}

const Title = ({ authenticateFromNewCountry, onClose }: TitleProps) => {
  const { formatMessage } = useIntlContext();
  return (
    <TitleDiv>
      <Title5 style={{ textAlign: 'center' }}>
        {formatMessage(
          authenticateFromNewCountry
            ? messages.authenticateFromNewCountry
            : glossary.twofa
        )}
      </Title5>
      <CloseButton onClick={onClose} />
    </TitleDiv>
  );
};

interface HeaderProps {
  authenticateFromNewCountry: boolean;
  desktop: boolean;
}

const HeaderDiv = styled.div<{ desktop: boolean }>`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  padding: ${({ desktop }) => (desktop ? '0 calc(var(--unit) * 6)' : '0')};
`;

const Header = ({ authenticateFromNewCountry, desktop }: HeaderProps) => {
  const { formatMessage } = useIntlContext();
  if (authenticateFromNewCountry) {
    return (
      <Title4>
        {formatMessage(messages.enterVerificationCodeSentViaEmail)}
      </Title4>
    );
  }
  return (
    <HeaderDiv desktop={desktop}>
      <Title4>
        {formatMessage(messages.enter6DigitCodeFromAuthenticatorApp)}
      </Title4>
      <Text16>{formatMessage(messages.recoveryCode)}</Text16>
    </HeaderDiv>
  );
};

const Root = styled(GraphqlForm)`
  display: flex;
  align-items: center;
  text-align: center;
  flex-direction: column;
  gap: var(--double-unit);
  margin: var(--double-unit);
  overflow: auto;
`;
const Input = styled(TextField)`
  width: 100%;
  & input {
    border-radius: 2em;
    padding: var(--intermediate-unit) var(--double-unit);
    text-align: center;
  }
`;
const StyledActions = styled(Actions)`
  width: 100%;
`;

export const TwoFactAuthDialog = ({
  open,
  onSubmit,
  onSuccess,
  onClose,
  onError,
  onCancel,
  reason,
}: Props) => {
  const authenticateFromNewCountry = reason === 'authenticate_from_new_country';
  const { formatMessage } = useIntlContext();
  const [newDeviceConfirmation, promptNewDeviceConfirmation] =
    useState<boolean>(false);

  const doOnSuccess = (result: GraphQLResult) => {
    if (onSuccess) onSuccess(result);
    onClose();
  };

  const handleClose = () => {
    if (onCancel) onCancel();
    onClose();
  };

  const doOnError = (result: GraphQLResult & { tcuToken?: string }) => {
    if (
      result?.errors
        ?.map(({ message }) => message)
        .includes('authenticate_from_new_device') ||
      result?.error === 'authenticate_from_new_device'
    ) {
      promptNewDeviceConfirmation(true);
    }
    if (onError) onError(result);
  };

  const { up: isTablet } = useScreenSize('tablet');

  if (newDeviceConfirmation) return <NewDeviceDialog onClose={handleClose} />;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      hideCloseButton
      title={
        <Title
          authenticateFromNewCountry={authenticateFromNewCountry}
          onClose={handleClose}
        />
      }
      fullScreen={!isTablet}
      headerCentered
      scroll="body"
    >
      <Root
        onChange={(values: any, submit: () => void) => {
          const { otpAttempt } = values;
          if (otpAttempt?.length === OTP_ATTEMPT_LENGTH) submit();
        }}
        onSubmit={onSubmit}
        onSuccess={doOnSuccess}
        onError={doOnError}
        render={(Error, SubmitButton) => (
          <>
            <Header
              authenticateFromNewCountry={authenticateFromNewCountry}
              desktop={isTablet}
            />

            <Error code />
            <Input
              name="otpAttempt"
              type="text"
              autoFocus
              autoComplete="one-time-code"
              placeholder={formatMessage(
                authenticateFromNewCountry
                  ? messages.verificationCodePlaceHolder
                  : messages.twoFaPlaceHolder
              )}
            />
            <StyledActions>
              <SubmitButton fullWidth medium>
                {formatMessage(glossary.submit)}
              </SubmitButton>
            </StyledActions>
          </>
        )}
      />
    </Dialog>
  );
};

export default TwoFactAuthDialog;

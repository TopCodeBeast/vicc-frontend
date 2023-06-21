import { faCircleExclamation, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { PrivateKeyRecoveryOptionStatusEnum } from '@core/__generated__/globalTypes';
import Button from '@core/atoms/buttons/Button';
import IconButton from '@core/atoms/buttons/IconButton';
import DialogWithNavigation from '@core/atoms/layout/DialogWithNavigation';
import { Text14, Text16, Title5 } from '@core/atoms/typography';
import useScreenSize from '@core/hooks/device/useScreenSize';
import useDeactivateWalletRecoveryEmail from '@core/hooks/recovery/useDeactivateWalletRecoveryEmail';
import useRecoveryOptions from '@core/hooks/recovery/useRecoveryOptions';
import useResendVerificationCodeForRecoveryEmail from '@core/hooks/recovery/useResendVerificationCodeForRecoveryEmail';
import { glossary } from '@core/lib/glossary';

import { AddRecoveryEmailForm } from './AddRecoveryEmailForm';
import { VerifyRecoveryEmailForm } from './VerifyRecoveryEmailForm';

const messages = defineMessages({
  title: {
    id: 'Settings.recoveryEmails.title',
    defaultMessage: 'Recovery email(s)',
  },
  helperWithoutRecoveryEmails: {
    id: 'Settings.recoveryEmails.helperWithoutRecoveryEmails',
    defaultMessage:
      'Consider adding a recovery email. It will help us contact you if you get locked out or to help you recover your Sorare wallet.',
  },
  helperWithRecoveryEmails: {
    id: 'Settings.recoveryEmails.helperWithRecoveryEmails',
    defaultMessage:
      'We can contact you to this email if you get locked out or to help you recover your Sorare wallet.',
  },
  submit: {
    id: 'Settings.recoveryEmails.submit',
    defaultMessage: 'Add recovery emails',
  },
});

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const StyledText16 = styled(Text16)`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

const Line = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RecoveryEmail = () => {
  const { up: isTablet } = useScreenSize('tablet');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [showVerify, setShowVerify] = useState<boolean>(false);
  const [currentRecoveryEmail, setCurrentRecoveryEmail] = useState<
    string | null
  >(null);
  const { recoveryEmails } = useRecoveryOptions();
  const { deactivateWalletRecoveryEmail } = useDeactivateWalletRecoveryEmail();
  const { resendVerificationCodeForRecoveryEmail } =
    useResendVerificationCodeForRecoveryEmail();
  const hasRecoveryEmails = !!recoveryEmails.length;
  const hasNotVerifiedRecoveryEmail = !recoveryEmails.find(
    r => r.status === PrivateKeyRecoveryOptionStatusEnum.ACTIVE
  );
  const header = {
    title: messages.title,
    description: hasRecoveryEmails
      ? messages.helperWithRecoveryEmails
      : messages.helperWithoutRecoveryEmails,
  };

  const addRecoveryEmail = () => {
    setCurrentRecoveryEmail(null);
    setOpenDialog(true);
  };

  const resendCode = (reference: string, destination: string) => {
    resendVerificationCodeForRecoveryEmail(reference);
    setCurrentRecoveryEmail(destination);
    setOpenDialog(true);
    setShowVerify(true);
  };
  const onClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <StyledText16>
        {hasNotVerifiedRecoveryEmail && (
          <FontAwesomeIcon
            icon={faCircleExclamation}
            color="var(--c-red-300)"
          />
        )}{' '}
        <FormattedMessage {...header.title} />
      </StyledText16>
      {hasRecoveryEmails && (
        <List>
          {recoveryEmails.map(email => (
            <li key={email.destination}>
              <Line>
                <Text14>{email.destination}</Text14>
                <Text14 color="var(--c-red-600)">
                  <IconButton
                    icon={faTrash}
                    small
                    color="transparent"
                    onClick={() => {
                      deactivateWalletRecoveryEmail(email.destination);
                    }}
                  />
                </Text14>
              </Line>
              {email.status ===
                PrivateKeyRecoveryOptionStatusEnum.PENDING_VALIDATION && (
                <>
                  <Text14 color="var(--c-neutral-600)">
                    <FormattedMessage
                      id="Setting.RecoveryEmail.pendingVerification.status"
                      defaultMessage="{icon} Pending verification"
                      values={{
                        icon: (
                          <FontAwesomeIcon
                            color="var(--c-red-300)"
                            icon={faCircleExclamation}
                          />
                        ),
                      }}
                    />
                  </Text14>
                  <button
                    type="button"
                    onClick={() => resendCode(email.id, email.destination)}
                  >
                    <Text14 color="var(--c-brand-600)">
                      <FormattedMessage {...glossary.resendVerificationCode} />
                    </Text14>
                  </button>
                </>
              )}
            </li>
          ))}
        </List>
      )}
      <div>
        <Button small color="blue" onClick={addRecoveryEmail}>
          <FormattedMessage {...messages.submit} />
        </Button>
      </div>
      <DialogWithNavigation
        open={openDialog}
        onBackButton={() =>
          !currentRecoveryEmail ? onClose() : setCurrentRecoveryEmail(null)
        }
        title={
          <Title5>
            <FormattedMessage {...glossary.recoveryEmail} />
          </Title5>
        }
        onClose={onClose}
        hideCloseButton
        fullScreen={!isTablet}
      >
        {showVerify && currentRecoveryEmail ? (
          <VerifyRecoveryEmailForm
            email={currentRecoveryEmail}
            onSuccess={() => {
              setCurrentRecoveryEmail(null);
              setShowVerify(false);
              onClose();
            }}
          />
        ) : (
          <AddRecoveryEmailForm
            email={currentRecoveryEmail}
            onSuccess={(email: string) => {
              setCurrentRecoveryEmail(email);
              setShowVerify(true);
            }}
          />
        )}
      </DialogWithNavigation>
    </>
  );
};
export default RecoveryEmail;

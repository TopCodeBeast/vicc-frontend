import { useRef, useState } from 'react';
import { FormattedMessage, defineMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import Dialog from '@sorare/core/src/atoms/layout/Dialog';
import { Text14, Text16, Title5 } from '@sorare/core/src/atoms/typography';
import TwoFactAuthDialog from 'components/TwoFactAuth/TwoFactAuthDialog';
import { RestForm, RestResult, TextField } from 'components/form/Form';
import { GoogleReCAPTCHA, ReCAPTCHA } from 'components/recaptcha';
import DisabledEmailWarning from 'components/user/DisabledEmailWarning';
import { UpdateUserEmailAttributes } from '@sorare/core/src/contexts/auth';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { useWalletContext } from '@sorare/core/src/contexts/wallet';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { glossary, userAttributes } from '@sorare/core/src/lib/glossary';
import { theme } from '@sorare/core/src/style/theme';

import UpdateEmailDialog from './UpdateEmailDialog';

const Container = styled(RestForm)`
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
  gap: var(--double-unit);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    align-items: stretch;
  }
`;

const message = defineMessage({
  id: 'Settings.updateEmail.submit',
  defaultMessage: 'Change email',
});

const UpdateEmail = () => {
  const [openDialogEmail, setOpenDialogEmail] = useState<string | null>(null);
  const [openDialogForm, setOpenDialogForm] = useState<boolean>(false);
  const [open2FA, setOpen2FA] = useState<boolean>(false);
  const [twoFACallback, setTwoFACallback] = useState<{
    resolve: any;
    reject: any;
  } | null>(null);

  const { up: isTablet } = useScreenSize('tablet');

  const recaptchaRef = useRef<GoogleReCAPTCHA>(null);

  const { formatMessage } = useIntlContext();
  const { currentUser } = useCurrentUserContext();
  const { updateUserEmailWithPassword } = useWalletContext();

  if (!currentUser) return null;

  const { email, otpRequiredForLogin } = currentUser;

  const submitUpdateUserMethodFactory: <T extends { email: string }>(
    callback: (attributes: T) => Promise<any>
  ) => (attributes: T, doOnResult: any) => Promise<void> =
    <T extends { email: string }>(callback: (attributes: T) => Promise<any>) =>
    async (attributes: T, doOnResult: any) => {
      if (!attributes.email || attributes.email === email) {
        return Promise.reject();
      }

      recaptchaRef.current?.reset();
      const recaptchaTokenV2 = await recaptchaRef.current?.executeAsync();

      if (recaptchaTokenV2) {
        const result = await callback({ ...attributes, recaptchaTokenV2 });

        doOnResult(result);
        if (!result.errors || result.errors.length === 0) {
          setOpenDialogEmail(attributes.email);
          setOpenDialogForm(false);
        }
        return Promise.resolve();
      }
      return Promise.reject();
    };

  const submitUpdateUser = async (
    attributes: UpdateUserEmailAttributes,
    doOnResult: (result: RestResult) => void
  ) => {
    let abort = false;
    const otpAttempt = await new Promise((resolve, reject) => {
      if (!otpRequiredForLogin) return resolve(null);
      setTwoFACallback({ resolve, reject });
      setOpen2FA(true);
      return null;
    }).catch(() => {
      abort = true;
    });

    if (abort) return () => {};
    return submitUpdateUserMethodFactory(updateUserEmailWithPassword)(
      { ...attributes, ...(otpRequiredForLogin ? { otpAttempt } : {}) },
      doOnResult
    );
  };

  return (
    <>
      <Text16>
        <FormattedMessage {...glossary.accountEmail} />
      </Text16>
      <Text14>{email}</Text14>
      <div>
        <Button small color="darkGray" onClick={() => setOpenDialogForm(true)}>
          <FormattedMessage {...message} />
        </Button>
      </div>
      <Dialog
        open={openDialogForm}
        onClose={() => setOpenDialogForm(false)}
        headerCentered
        title={
          <Title5>
            <FormattedMessage {...message} />
          </Title5>
        }
        fullScreen={!isTablet}
      >
        <DisabledEmailWarning />
        <Container
          onSubmit={(values, onResult) => {
            submitUpdateUser(values, onResult);
          }}
          onSuccess={() => {}}
          render={(Error, SubmitButton) => (
            <>
              <Error code />
              <TextField
                name="email"
                defaultValue={email}
                label={formatMessage(userAttributes.email)}
              />
              <ReCAPTCHA ref={recaptchaRef} />
              <SubmitButton color="blue">
                <FormattedMessage {...message} />
              </SubmitButton>
            </>
          )}
        />
      </Dialog>
      {otpRequiredForLogin && (
        <TwoFactAuthDialog
          onSubmit={(values, onResult) => {
            twoFACallback?.resolve(values.otpAttempt);
            onResult(values);
          }}
          onSuccess={() => setOpen2FA(false)}
          onClose={() => setOpen2FA(false)}
          onCancel={() => twoFACallback?.reject('no 2FA')}
          open={open2FA}
          reason={formatMessage(message)}
        />
      )}
      {openDialogEmail && (
        <UpdateEmailDialog
          email={openDialogEmail}
          onClose={() => {
            setOpenDialogEmail(null);
          }}
        />
      )}
    </>
  );
};
export default UpdateEmail;

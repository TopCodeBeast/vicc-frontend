import { ChangeEvent, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import { CreateWalletRecovery } from '@sorare/wallet-shared';
import { PrivateKeyRecoveryOptionStatusEnum } from '__generated__/globalTypes';
import { Text14, Text16, Title3 } from '@core/atoms/typography';
import TwoFADialog from '@core/components/TwoFA/TwoFADialog';
import { GraphQLResult, GraphqlForm, TextField } from '@core/components/form/Form';
import { GoogleReCAPTCHA, ReCAPTCHA } from '@core/components/recaptcha';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useMessagingContext } from '@core/contexts/wallet';
import { useWalletDrawerContext } from '@core/contexts/walletDrawer';
import useAddWalletRecoveryEmail from '@core/hooks/recovery/useAddWalletRecoveryEmail';
import useRecoveryOptions, {
  RecoveryOption,
} from '@core/hooks/recovery/useRecoveryOptions';
import useResendVerificationCodeForRecoveryEmail from '@core/hooks/recovery/useResendVerificationCodeForRecoveryEmail';
import { glossary } from '@core/lib/glossary';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  form {
    margin-bottom: 0;
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const StyledTextField = styled(TextField)`
  width: 100%;
`;

type Props = {
  email: string | null;
  onSuccess: (newRecoveryEmail: string) => void;
};

const getRecoveryOptionFromEmail = (
  email: string,
  recoveryOptions?: RecoveryOption[]
) => {
  return (
    recoveryOptions?.length &&
    recoveryOptions.find(o => o.destination === email)
  );
};

export const AddRecoveryEmailForm = ({
  onSuccess: doOnSuccess,
  email,
}: Props) => {
  const { formatMessage } = useIntl();
  const recaptchaRef = useRef<GoogleReCAPTCHA>(null);
  const { currentUser } = useCurrentUserContext();
  const { accountEmail, recoveryEmails } = useRecoveryOptions();
  const { addWalletRecoveryEmail } = useAddWalletRecoveryEmail();
  const { resendVerificationCodeForRecoveryEmail } =
    useResendVerificationCodeForRecoveryEmail();
  const { sendRequest } = useMessagingContext();
  const { closeWalletAndDrawer } = useWalletDrawerContext();
  const [newRecoveryEmail, setNewRecoveryEmail] = useState<string | null>(
    email
  );
  const [open2FA, setOpen2FA] = useState<boolean>(false);
  const [twoFACallback, setTwoFACallback] = useState<{
    resolve: any;
    reject: any;
  } | null>(null);

  const handleNewRecoveryEmail = (event: ChangeEvent<Element>) => {
    setNewRecoveryEmail((event.target as HTMLInputElement).value.toLowerCase());
  };

  const submit = async (
    values: any,
    onResult: (res: GraphQLResult) => void
  ) => {
    const recoveryDestination =
      values?.email?.toLowerCase() || newRecoveryEmail;

    const alreadyRegisteredOption = getRecoveryOptionFromEmail(
      recoveryDestination,
      recoveryEmails
    );

    if (
      alreadyRegisteredOption ||
      recoveryDestination === accountEmail?.destination
    ) {
      if (
        alreadyRegisteredOption &&
        alreadyRegisteredOption.status ===
          PrivateKeyRecoveryOptionStatusEnum.PENDING_VALIDATION
      ) {
        const { errors } = await resendVerificationCodeForRecoveryEmail(
          alreadyRegisteredOption.id
        );
        onResult({ errors });
        return;
      }
      onResult({
        error: formatMessage({
          id: 'Settings.addRecoveryEmailForm.alreadyRegisteredEmailError',
          defaultMessage: 'This email is already registered.',
        }),
      });
      return;
    }

    let abort = false;
    const otpAttempt = await new Promise<string | undefined>(
      (resolve, reject) => {
        if (!currentUser?.otpRequiredForLogin) return resolve(undefined);
        setTwoFACallback({ resolve, reject });
        setOpen2FA(true);
        return undefined;
      }
    ).catch(() => {
      abort = true;
      return undefined;
    });
    if (abort) return;

    const { result, error } = await sendRequest<CreateWalletRecovery>(
      'createWalletRecovery',
      {
        recoveryMethod: 'email',
        recoveryDestination,
      }
    );

    if (error) {
      onResult({ error });
      return;
    }

    if (!result) {
      onResult({
        error: formatMessage({
          id: 'updateUserEmailWithPassword.privateKeyGenerationError',
          defaultMessage: 'Unable to generate recovery key.',
        }),
      });
      return;
    }
    closeWalletAndDrawer();
    const { privateKeyRecovery } = result;

    const gqlResults = await addWalletRecoveryEmail({
      privateKeyRecovery,
      otpAttempt,
    });

    const recoveryOptions =
      gqlResults?.data?.addWalletRecovery?.currentUser?.wallet?.recoveryOptions;

    const hasNotRegistered = !getRecoveryOptionFromEmail(
      recoveryDestination,
      recoveryOptions
    );

    onResult({
      ...gqlResults,
      errors: [
        ...gqlResults.errors,
        ...(hasNotRegistered && gqlResults.errors.length === 0
          ? [
              {
                message: formatMessage({
                  id: 'Settings.addWalletRecoveryEmail.notRegistered',
                  defaultMessage: 'Email is not valid',
                }),
              },
            ]
          : []),
      ],
    });
  };

  const onSuccess = () => {
    if (newRecoveryEmail) doOnSuccess(newRecoveryEmail);
  };

  if (!currentUser) return null;

  const { otpRequiredForLogin } = currentUser;

  return (
    <Wrapper>
      <Group>
        <Title3 bold>
          <FormattedMessage {...glossary.recoveryEmail} />
        </Title3>
        <Text16>
          <FormattedMessage
            id="Settings.addRecoveryEmailForm.desc"
            defaultMessage="Your recovery email is used to contact you in case you get locked out or to help you recover your Vicc wallet."
          />
        </Text16>
      </Group>
      <Text14 color="var(--c-neutral-600)">
        <FormattedMessage
          id="Settings.addRecoveryEmailForm.helper"
          defaultMessage="You can add any email, even if not yours, as long as you are confident that you can easily and consistently access it."
        />
      </Text14>
      <GraphqlForm
        onSubmit={(values, doOnResult) => {
          submit(values, doOnResult);
        }}
        onSuccess={onSuccess}
        render={(Error, SubmitButton) => (
          <Group>
            <Error code />
            <StyledTextField
              name="email"
              value={newRecoveryEmail || ''}
              onChange={handleNewRecoveryEmail}
              label={
                <Text14 bold>
                  <FormattedMessage {...glossary.recoveryEmail} />
                </Text14>
              }
            />
            <ReCAPTCHA ref={recaptchaRef} />
            <SubmitButton fullWidth color="blue">
              <FormattedMessage {...glossary.next} />
            </SubmitButton>
          </Group>
        )}
      />
      {otpRequiredForLogin && (
        <TwoFADialog
          onSubmit={(values, onResult) => {
            twoFACallback?.resolve(values.otpAttempt);
            onResult(values);
          }}
          onSuccess={() => setOpen2FA(false)}
          onClose={() => setOpen2FA(false)}
          onCancel={() => twoFACallback?.reject('no 2FA')}
          open={open2FA}
          reason="recoverEmail"
        />
      )}
    </Wrapper>
  );
};

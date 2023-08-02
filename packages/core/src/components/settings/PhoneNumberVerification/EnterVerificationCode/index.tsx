import { Suspense, useCallback, useEffect, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import enterVerificationCode from '@core/assets/user/enter_verification_code.svg';
import Button from '@core/atoms/buttons/Button';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import { Text16, Title4 } from '@core/atoms/typography';
import Bold from '@core/atoms/typography/Bold';
import { type GraphQLResult, GraphqlForm } from '@core/components/form/Form';
import { errorMessages } from '@core/components/user/VerifyPhoneNumber/i18n';
import { PHONE_VERIFICATION_CODE_LENGTH } from '@core/constants/verificationCode';
import { glossary } from '@core/lib/glossary';

import VerificationCodeInput from './VerificationCodeInput';

const messages = defineMessages({
  header: {
    id: 'Settings.PhoneNumberVerification.EnterVerificationCode.header',
    defaultMessage: 'Enter the 4-digit code',
  },
  description: {
    id: 'Settings.PhoneNumberVerification.EnterVerificationCode.description',
    defaultMessage: 'We have sent a code to <b>{phoneNumber}</b>',
  },
  didNotReceiveCode: {
    id: 'Settings.PhoneNumberVerification.EnterVerificationCode.codeNotReceived',
    defaultMessage: "Didn't get a code? <link>Click to resend</link>",
  },
  cta: {
    id: 'Settings.PhoneNumberVerification.EnterVerificationCode.cta',
    defaultMessage: 'Verify code',
  },
});

type Error = NonNullable<GraphQLResult['errors']>[number];

export interface EnterVerificationCodeProps {
  submitVerificationCode: (verificationCode: string) => Promise<Error[] | null>;
  resendVerificationCode: (phoneNumber: string) => Promise<Error[] | null>;
  onCancel: () => void;
  onSuccess?: () => void;
  phoneNumber: string;
}

const NotReceivedLink = styled.button.attrs({
  type: 'button',
})`
  color: inherit;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  text-decoration: underline;
`;

const Root = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: var(--double-unit);
  text-align: center;
  width: 100%;
`;

const Info = styled.div`
  padding: var(--double-unit);
`;

const Form = styled(GraphqlForm)`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  margin: 0;
  width: 100%;
`;

const Buttons = styled.div`
  display: flex;
  gap: var(--unit);
  justify-content: space-between;
  margin: auto;
  padding-top: var(--unit);
  width: 100%;
`;

const EnterVerificationCode = ({
  submitVerificationCode,
  phoneNumber,
  resendVerificationCode,
  onCancel,
  onSuccess,
}: EnterVerificationCodeProps) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [disabled, setDisabled] = useState<boolean>(true);

  const submitVerificationCodeCb = useCallback(
    (_vars: any, onResult: (result: GraphQLResult) => void) => {
      submitVerificationCode(verificationCode).then(errors => {
        onResult({ errors });
      });
    },
    [verificationCode, submitVerificationCode]
  );
  const resend = useCallback(() => {
    setDisabled(true);
    resendVerificationCode(phoneNumber).finally(() => {
      setDisabled(false);
    });
  }, [phoneNumber, resendVerificationCode]);

  useEffect(() => {
    setDisabled(verificationCode.length === 0);
  }, [verificationCode]);

  return (
    <Root>
      <img src={enterVerificationCode} alt="Enter received verification code" />
      <Info>
        <Title4>
          <FormattedMessage {...messages.header} />
        </Title4>
        <Text16 color="var(--c-neutral-600)">
          <FormattedMessage
            values={{
              b: Bold,
              phoneNumber,
            }}
            {...messages.description}
          />
        </Text16>
      </Info>
      <Suspense fallback={<LoadingIndicator />}>
        <Form
          autoComplete
          onSubmit={submitVerificationCodeCb}
          onSuccess={() => {
            if (onSuccess) onSuccess();
          }}
          onChange={(values, submit) => {
            if (verificationCode?.length === PHONE_VERIFICATION_CODE_LENGTH)
              submit();
          }}
          errorMessages={errorMessages}
          render={(Error, SubmitButton) => (
            <>
              <Error />
              <VerificationCodeInput
                value={verificationCode}
                onChange={setVerificationCode}
              />
              <Text16 color="var(--c-neutral-600)">
                <FormattedMessage
                  values={{
                    link: (chunks: string[]) => (
                      <NotReceivedLink onClick={resend}>
                        {chunks}
                      </NotReceivedLink>
                    ),
                  }}
                  {...messages.didNotReceiveCode}
                />
              </Text16>
              <Buttons>
                <Button medium fullWidth color="darkGray" onClick={onCancel}>
                  <FormattedMessage {...glossary.cancel} />
                </Button>
                <SubmitButton fullWidth medium disabled={disabled}>
                  <FormattedMessage {...messages.cta} />
                </SubmitButton>
              </Buttons>
            </>
          )}
        />
      </Suspense>
    </Root>
  );
};

export default EnterVerificationCode;

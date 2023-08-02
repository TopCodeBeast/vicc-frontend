import { TypedDocumentNode, gql } from '@apollo/client';
import { Suspense, useCallback, useState } from 'react';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
} from 'react-intl';
import styled from 'styled-components';

import verifyPhoneNumber from '@core/assets/user/verify_phone_number.svg';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import { Text16, Title4 } from '@core/atoms/typography';
import { type GraphQLResult, GraphqlForm } from '@core/components/form/Form';
import IntlTelInput from '@core/components/form/Form/IntlTelInput';
import { errorMessages } from '@core/components/user/VerifyPhoneNumber/i18n';

import { SendVerificationCode_currentUser } from './__generated__/index.graphql';

const messages = defineMessages({
  header: {
    id: 'Settings.PhoneNumberVerification.SendVerificationCode.header',
    defaultMessage: 'Verify your phone number',
  },
  description: {
    id: 'Settings.PhoneNumberVerification.SendVerificationCode.description',
    defaultMessage:
      'A 4-digit code will be sent via sms to verify your mobile number',
  },
  cta: {
    id: 'Settings.PhoneNumberVerification.SendVerificationCode.cta',
    defaultMessage: 'Send verification code',
  },
});

type Error = NonNullable<GraphQLResult['errors']>[number];

export interface SendVerificationCodeProps {
  currentUser: SendVerificationCode_currentUser;
  sendVerificationCode: (phoneNumber: string) => Promise<Error[]>;
  title?: MessageDescriptor;
  onSuccess?: (phoneNumber: string) => void;
}

const RootDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--double-unit);
`;

const InfoDiv = styled.div`
  padding: var(--double-unit);
`;

const Form = styled(GraphqlForm)`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  margin: 0;
`;

const SendVerificationCode = ({
  currentUser,
  sendVerificationCode,
  title,
  onSuccess,
}: SendVerificationCodeProps) => {
  const [phoneNumber, setFullPhoneNumber] = useState<string | null>(
    currentUser.unverifiedPhoneNumber
  );
  const [validPhoneNumber, setValidPhoneNumber] = useState<boolean | null>(
    !!currentUser.unverifiedPhoneNumber
  );

  const sendVerificationCodeCb = useCallback(
    (
      _vars: any,
      onResult: (result: GraphQLResult) => void,
      onCancel: () => void | undefined
    ) => {
      if (!phoneNumber) {
        onCancel();
        return;
      }
      sendVerificationCode(phoneNumber).then(errors => {
        onResult({ errors });
      });
    },
    [sendVerificationCode, phoneNumber]
  );
  const onChange = useCallback(({ isValid, fullNumber }: any) => {
    setValidPhoneNumber(isValid);
    setFullPhoneNumber(fullNumber);
  }, []);

  const doOnSuccess = () => {
    if (onSuccess && phoneNumber) onSuccess(phoneNumber);
  };

  return (
    <RootDiv>
      <img src={verifyPhoneNumber} alt="Verify Your Phone Number" />
      <InfoDiv>
        <Title4>
          <FormattedMessage {...(title || messages.header)} />
        </Title4>
        <Text16 color="var(--c-neutral-600)">
          <FormattedMessage {...messages.description} />
        </Text16>
      </InfoDiv>
      <Suspense fallback={<LoadingIndicator />}>
        <Form
          onSubmit={sendVerificationCodeCb}
          onSuccess={doOnSuccess}
          errorMessages={errorMessages}
          render={(Error, SubmitButton) => (
            <>
              <Error />
              <IntlTelInput
                name="phoneNumber"
                defaultCountry={currentUser.userSettings.locale}
                defaultPhone={phoneNumber}
                onChange={onChange}
              />
              <SubmitButton medium disabled={!validPhoneNumber}>
                <FormattedMessage {...messages.cta} />
              </SubmitButton>
            </>
          )}
        />
      </Suspense>
    </RootDiv>
  );
};

SendVerificationCode.fragments = {
  currentUser: gql`
    fragment SendVerificationCode_currentUser on CurrentUser {
      slug
      phoneNumber
      phoneNumberVerificationRequested
      unverifiedPhoneNumber
      userSettings {
        id
        locale
      }
    }
  ` as TypedDocumentNode<SendVerificationCode_currentUser>,
};

export default SendVerificationCode;

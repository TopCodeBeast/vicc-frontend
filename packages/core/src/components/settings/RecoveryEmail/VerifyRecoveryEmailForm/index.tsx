import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16, Title3 } from '@core/atoms/typography';
import { GraphQLResult, GraphqlForm, TextField } from '@core/components/form/Form';
import { RECOVERY_EMAIL_VERIFICATION_CODE_LENGTH } from '@core/constants/verificationCode';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';
// import useActivateWalletRecoveryEmail from '@core/hooks/recovery/useActivateWalletRecoveryEmail';
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
  gap: var(--double-unit);
`;
const StyledTextField = styled(TextField)`
  width: 100%;
`;

type Props = {
  email: string;
  onSuccess: () => void;
};

export const VerifyRecoveryEmailForm = ({
  email,
  onSuccess: doOnSuccess,
}: Props) => {
  const { currentUser } = useCurrentUserContext();
  const { showNotification } = useSnackNotificationContext();
  // const { activateWalletRecoveryEmail } = useActivateWalletRecoveryEmail();
  const submit = async (values: any, onResult: (r: GraphQLResult) => void) => {
    // const results = await activateWalletRecoveryEmail({
    //   destination: email,
    //   verificationCode: values.verificationCode,
    // });
    // onResult(results);
  };

  const onSuccess = () => {
    showNotification('recoveryEmailRegistered', { email });
    doOnSuccess();
  };

  if (!currentUser) return null;

  return (
    <Wrapper>
      <Group>
        <Title3 bold>
          <FormattedMessage
            id="verifyRecoveryEmail.title"
            defaultMessage="Verify your recovery email"
          />
        </Title3>
        <Text16>
          <FormattedMessage
            id="verifyRecoveryEmail.desc"
            defaultMessage="Enter the 6-digit code sent to { email }."
            values={{ email }}
          />
        </Text16>
      </Group>
      <GraphqlForm
        onSubmit={(values, doOnResult) => {
          submit(values, doOnResult);
        }}
        onChange={(values, doSubmit) => {
          const { verifiactionCode } = values;
          if (
            verifiactionCode?.length === RECOVERY_EMAIL_VERIFICATION_CODE_LENGTH
          )
            doSubmit();
        }}
        onSuccess={onSuccess}
        render={(Error, SubmitButton) => (
          <Group>
            <Error code />
            <StyledTextField name="verificationCode" />
            <SubmitButton fullWidth color="blue">
              <FormattedMessage {...glossary.verify} />
            </SubmitButton>
          </Group>
        )}
      />
    </Wrapper>
  );
};

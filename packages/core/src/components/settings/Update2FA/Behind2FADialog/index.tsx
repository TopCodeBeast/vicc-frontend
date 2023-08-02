import { FunctionComponent, PropsWithChildren } from 'react';
import { MessageDescriptor } from 'react-intl';
import styled from 'styled-components';

import Dialog from '@core/atoms/layout/Dialog';
import { Text16, Title5 } from '@core/atoms/typography';
import {
  GraphQLResult,
  GraphqlForm,
  SubmitButtonProps,
  TextField,
} from '@core/components/form/Form';
import { OTP_ATTEMPT_LENGTH } from '@core/constants/verificationCode';
import { useIntlContext } from '@core/contexts/intl';
import useScreenSize from '@core/hooks/device/useScreenSize';
import { glossary, userAttributes } from '@core/lib/glossary';

const StyledGraphqlForm = styled(GraphqlForm)`
  margin-bottom: 0;
`;
const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--double-unit);
`;
export const Centered = styled(Text16)`
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
  box-shadow: var(--shadow-200);
  align-self: stretch;
`;

export type WithOtpAttempt = { otpAttempt: string };

interface Props {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  submit: (
    attributes: WithOtpAttempt,
    onResult: (result: GraphQLResult) => void,
    onCancel: () => void
  ) => Promise<void>;
  onSuccess: () => void;
  submitMessage: MessageDescriptor;
  submitButtonProps?: Partial<SubmitButtonProps>;
}

export const Behind2FADialog = ({
  opened,
  setOpened,
  submit,
  onSuccess,
  submitMessage,
  submitButtonProps,
  children,
}: PropsWithChildren<Props>) => {
  const { formatMessage } = useIntlContext();
  const { up: isTablet } = useScreenSize('tablet');

  return (
    <Dialog
      open={opened}
      onClose={() => setOpened(false)}
      headerCentered
      title={<Title5>{formatMessage(glossary.twofa)}</Title5>}
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
          Error: React.ComponentType<React.PropsWithChildren<unknown>>,
          SubmitButton: FunctionComponent<
            React.PropsWithChildren<SubmitButtonProps>
          >
        ) => (
          <DialogContent>
            {children}

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
              <SubmitButton medium stroke {...(submitButtonProps || {})}>
                {formatMessage(submitMessage)}
              </SubmitButton>
            </DialogForm>
          </DialogContent>
        )}
      />
    </Dialog>
  );
};

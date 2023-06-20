import {
  faEnvelope,
  faEnvelopeCircleCheck,
} from '@fortawesome/pro-light-svg-icons';
import { faEnvelopeDot } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import CloseButton from '@sorare/core/src/atoms/buttons/CloseButton';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import { Text16, Title3 } from '@sorare/core/src/atoms/typography';
import Dialog from 'components/dialog';
import { GoogleReCAPTCHA, ReCAPTCHA } from 'components/recaptcha';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { avoidOrphan } from '@sorare/core/src/lib/text';
import { theme } from '@sorare/core/src/style/theme';

import useResendConfirmationInstructions from './useResendConfirmationInstructions';

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--double-unit);
  padding: calc(3 * var(--unit));
  text-align: center;
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    width: 480px;
  }
`;
const GreyText = styled(Text16)`
  color: var(--c-neutral-600);
`;
const ButtonContainer = styled.div`
  padding: var(--unit);
`;
const CloseButtonWrapper = styled.div`
  position: absolute;
  top: var(--double-unit);
  right: var(--double-unit);
`;
const EnveloppeIcon = styled(FontAwesomeIcon)`
  margin-left: var(--unit);
`;

const buttonTextMessages = defineMessages({
  emailNotSent: {
    id: 'user.verifyEmail.cta.emailNotSent',
    defaultMessage: 'Resend an email',
  },
  emailSent: {
    id: 'user.verifyEmail.cta.emailSent',
    defaultMessage: 'Email sent',
  },
});

type Props = { closable?: boolean; onClose: () => void };

const EmailVerificationDialog = ({ closable = true, onClose }: Props) => {
  const track = useEvents();
  const { formatMessage } = useIntl();
  const resendConfirmationInstructions = useResendConfirmationInstructions();
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const recaptchaRef = useRef<GoogleReCAPTCHA>(null);

  useEffect(() => {
    track('View Email Confirmation Popin');
  }, [track]);

  const onClick = async () => {
    setLoading(true);

    recaptchaRef.current?.reset();
    const recaptchaTokenV2 = await recaptchaRef.current?.executeAsync();

    if (recaptchaTokenV2) {
      const { errors } = await resendConfirmationInstructions({
        variables: {
          input: {
            recaptchaTokenV2,
          },
        },
      });
      if (!errors.length) {
        setEmailSent(true);
      }
    }
    setLoading(false);
  };

  return (
    <Dialog open maxWidth={false} onClose={closable ? onClose : () => {}}>
      <DialogContainer>
        {closable && (
          <CloseButtonWrapper>
            <CloseButton onClose={onClose} />
          </CloseButtonWrapper>
        )}

        <FontAwesomeIcon
          icon={faEnvelopeDot}
          fontSize={64}
          color="var(--c-brand-600)"
        />

        <Title3>
          {avoidOrphan(
            formatMessage({
              id: 'user.verifyEmail.title',
              defaultMessage: 'We still need you to confirm your account.',
            })
          )}
        </Title3>

        <GreyText>
          <FormattedMessage
            id="user.verifyEmail.subtitle"
            defaultMessage="Check your emails to confirm your account or try resending a new confirmation email."
          />
        </GreyText>

        <ReCAPTCHA ref={recaptchaRef} />

        <ButtonContainer>
          <LoadingButton
            medium
            color="blue"
            onClick={() => {
              onClick();
            }}
            disabled={emailSent}
            loading={loading}
            startIcon={
              !loading &&
              (emailSent ? (
                <EnveloppeIcon icon={faEnvelopeCircleCheck} />
              ) : (
                <EnveloppeIcon icon={faEnvelope} />
              ))
            }
          >
            {formatMessage(
              emailSent
                ? buttonTextMessages.emailSent
                : buttonTextMessages.emailNotSent
            )}
          </LoadingButton>
        </ButtonContainer>
      </DialogContainer>
    </Dialog>
  );
};

export default EmailVerificationDialog;

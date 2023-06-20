import {
  faCircleCheck,
  faCircleExclamation,
  faEye,
  faEyeSlash,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { PrivateKeyRecoveryOptionStatusEnum } from '__generated__/globalTypes';
import { Text14, Text16, Title6 } from '@sorare/core/src/atoms/typography';
import {
  SecurityCheckTab,
  useAccountSecurityCheckContext,
} from '@sorare/core/src/contexts/accountSecurityCheck';
import useRecoveryEmails, {
  RecoveryOption,
} from '@sorare/core/src/hooks/recovery/useRecoveryOptions';
import useResendVerificationCodeForRecoveryEmail from '@sorare/core/src/hooks/recovery/useResendVerificationCodeForRecoveryEmail';
import useToggle from '@sorare/core/src/hooks/useToggle';
import { glossary } from '@sorare/core/src/lib/glossary';
import { hideEmailDetails } from '@sorare/core/src/lib/privacy';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const Title = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;

const Emails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const Email = styled(Text16)`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;

const EmailItem = ({ email }: { email: string }) => {
  const [show, toggleShow] = useToggle(false);

  return (
    <Email color="var(--c-neutral-1000)">
      {show ? email : hideEmailDetails(email)}
      <button type="button" onClick={toggleShow}>
        <FontAwesomeIcon
          icon={show ? faEyeSlash : faEye}
          size="xs"
          color="var(--c-neutral-1000)"
        />
      </button>
    </Email>
  );
};

export const RecoveryEmail = () => {
  const { setOnBackTarget, setSecurityCheckTab, setUnverifiedRecoveryEmail } =
    useAccountSecurityCheckContext();
  const { resendVerificationCodeForRecoveryEmail } =
    useResendVerificationCodeForRecoveryEmail();
  const { recoveryEmails } = useRecoveryEmails();
  const hasRecoveryEmail = !!recoveryEmails.length;
  const hasActiveRecoveryEmail = recoveryEmails.find(
    option => option.status === PrivateKeyRecoveryOptionStatusEnum.ACTIVE
  );

  const resendCode = (option: RecoveryOption) => {
    resendVerificationCodeForRecoveryEmail(option.id);
    setOnBackTarget(SecurityCheckTab.HOME);
    setSecurityCheckTab(SecurityCheckTab.VERIFY_RECOVERY_EMAIL);
    setUnverifiedRecoveryEmail(option.destination);
  };

  return (
    <Wrapper>
      <Title>
        {hasActiveRecoveryEmail ? (
          <FontAwesomeIcon icon={faCircleCheck} color="var(--c-green-600)" />
        ) : (
          <FontAwesomeIcon
            icon={faCircleExclamation}
            color="var(--c-red-300)"
          />
        )}
        <Title6 color="var(--c-neutral-1000)">
          <FormattedMessage
            id="accountSecurityCheck.recoveryEmails.title"
            defaultMessage="Recovery email(s)"
          />
        </Title6>
      </Title>
      {!hasRecoveryEmail && (
        <Text14 color="var(--c-neutral-600)">
          <FormattedMessage
            id="accountSecurityCheck.recoveryEmails.desc"
            defaultMessage="We strongly recommend adding a recovery email. It will help us contact you if you get locked out and assist in recovering your Sorare wallet."
          />
        </Text14>
      )}
      {!!recoveryEmails.length && (
        <Emails>
          {recoveryEmails.map(email => (
            <div key={email.destination}>
              <EmailItem email={email.destination} />
              {email.status ===
                PrivateKeyRecoveryOptionStatusEnum.PENDING_VALIDATION && (
                <>
                  <Text14 color="var(--c-neutral-600)">
                    <FormattedMessage
                      id="accountSecurityCheck.recoveryEmails.status.pending"
                      defaultMessage="{icon} Pending verification"
                      values={{
                        icon: (
                          <FontAwesomeIcon
                            icon={faCircleExclamation}
                            color="var(--c-red-300)"
                          />
                        ),
                      }}
                    />
                  </Text14>
                  <Text14 color="var(--c-link)">
                    <button type="button" onClick={() => resendCode(email)}>
                      <FormattedMessage {...glossary.resendVerificationCode} />
                    </button>
                  </Text14>
                </>
              )}
            </div>
          ))}
        </Emails>
      )}
      <Text16 color="var(--c-link)">
        <button
          type="button"
          onClick={() => {
            setSecurityCheckTab(SecurityCheckTab.ADD_RECOVERY_EMAIL);
            setUnverifiedRecoveryEmail(null);
          }}
        >
          {hasRecoveryEmail ? (
            <FormattedMessage
              id="accountSecurityCheck.recoveryEmails.addAnother"
              defaultMessage="Add another recovery email"
            />
          ) : (
            <FormattedMessage
              id="accountSecurityCheck.recoveryEmails.add"
              defaultMessage="Add recovery email"
            />
          )}
        </button>
      </Text16>
    </Wrapper>
  );
};

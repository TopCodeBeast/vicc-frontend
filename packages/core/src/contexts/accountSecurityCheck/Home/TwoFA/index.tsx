import {
  faCircleCheck,
  faCircleExclamation,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Caption, Text14, Text16, Title6 } from '@core/atoms/typography';
import {
  SecurityCheckTab,
  useAccountSecurityCheckContext,
} from '@core/contexts/accountSecurityCheck';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { glossary } from '@core/lib/glossary';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const Title = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;

const Badge = styled.div<{ enabled: boolean }>`
  color: ${({ enabled }) =>
    enabled ? 'var(--c-green-600)' : 'var(--c-red-800)'};
  display: inline-block;
  padding: 0 var(--half-unit);
  gap: var(--double-unit);
  border: solid 1px currentColor;
  border-radius: var(--half-unit);
`;
const RecoveryCodes = styled.div`
  border-top: solid 1px var(--c-neutral-400);
  padding-top: var(--double-unit);
`;

export const TwoFA = () => {
  const { setSecurityCheckTab } = useAccountSecurityCheckContext();

  const { currentUser } = useCurrentUserContext();
  if (!currentUser) return null;
  const { otpRequiredForLogin } = currentUser;

  return (
    <Wrapper>
      <Header>
        <Title>
          {otpRequiredForLogin ? (
            <FontAwesomeIcon icon={faCircleCheck} color="var(--c-green-600)" />
          ) : (
            <FontAwesomeIcon
              icon={faCircleExclamation}
              color="var(--c-red-300)"
            />
          )}
          <Title6 color="var(--c-neutral-1000)">
            <FormattedMessage
              id="accountSecurityCheck.2fa.title"
              defaultMessage="Two-Factor Authentication"
            />
          </Title6>
        </Title>
        {!otpRequiredForLogin && (
          <Text14 color="var(--c-neutral-600)">
            <FormattedMessage
              id="accountSecurityCheck.2fa.desc"
              defaultMessage="Two-factor authentication (known as “2FA”) adds an extra layer of security to your account to ensure that only you have the ability to log in."
            />
          </Text14>
        )}
      </Header>
      <div>
        <Text16 color="var(--c-neutral-1000)">
          <FormattedMessage
            id="accountSecurityCheck.2fa.authenticatorApp"
            defaultMessage="Authenticator app"
          />
        </Text16>
        <Badge enabled={otpRequiredForLogin}>
          <Caption bold>
            {otpRequiredForLogin ? (
              <FormattedMessage {...glossary.enabled} />
            ) : (
              <FormattedMessage {...glossary.disabled} />
            )}
          </Caption>
        </Badge>
      </div>
      {otpRequiredForLogin && (
        <RecoveryCodes>
          <Text16 color="var(--c-neutral-1000)">
            <FormattedMessage
              id="accountSecurityCheck.2fa.codes"
              defaultMessage="Recovery codes"
            />
          </Text16>
          <Badge enabled>
            <Caption bold>
              <FormattedMessage {...glossary.viewed} />
            </Caption>
          </Badge>
        </RecoveryCodes>
      )}
      {!otpRequiredForLogin && (
        <Text16 color="var(--c-link)">
          <button
            type="button"
            onClick={() => setSecurityCheckTab(SecurityCheckTab.ENABLE_2FA)}
          >
            <FormattedMessage
              id="accountSecurityCheck.2fa.enable"
              defaultMessage="Enable 2FA"
            />
          </button>
        </Text16>
      )}
    </Wrapper>
  );
};

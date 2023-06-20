import { faCircleExclamation } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { useCurrentUserContext } from 'contexts/currentUser';
import useUpdate2FA from '@sorare/core/src/hooks/useUpdate2FA';
import { glossary } from '@sorare/core/src/lib/glossary';

import Disable2FA from './Disable2FA';
import Enable2FA from './Enable2FA';
import RecoveryCodes from './RecoveryCodes';
import RecoveryCodesDialog from './RecoveryCodesDialog';

const messages = defineMessages({
  description: {
    id: 'Settings.update2FA.description',
    defaultMessage:
      'Two-Factor authentication (2FA for short) is a good way to add an extra layer of security to your account to make sure that only you have the ability to log in.',
  },
});

const Buttons = styled.div`
  display: flex;
  gap: var(--double-unit);
  flex-wrap: wrap;
`;
const StyledText16 = styled(Text16)`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;
export const Update2FA = () => {
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const { currentUser } = useCurrentUserContext();

  const {
    update2FAQuery: { loading },
  } = useUpdate2FA();

  if (!currentUser) return null;

  const { otpRequiredForLogin } = currentUser;
  const twoFactorDisabled = !otpRequiredForLogin;

  return loading ? (
    <LoadingIndicator />
  ) : (
    <>
      <StyledText16 bold>
        {!otpRequiredForLogin && (
          <FontAwesomeIcon
            icon={faCircleExclamation}
            color="var(--c-red-300)"
          />
        )}
        <FormattedMessage {...glossary.twofa} />
      </StyledText16>
      <Text16 color="var(--c-neutral-600)">
        <FormattedMessage {...messages.description} />
      </Text16>
      <Buttons>
        {!twoFactorDisabled && (
          <RecoveryCodes setRecoveryCodes={setRecoveryCodes} />
        )}
        {twoFactorDisabled ? (
          <Enable2FA onEnabling2FA={setRecoveryCodes} />
        ) : (
          <Disable2FA />
        )}
      </Buttons>
      {recoveryCodes && (
        <RecoveryCodesDialog
          codes={recoveryCodes}
          onClose={() => setRecoveryCodes(null)}
        />
      )}
    </>
  );
};

export default Update2FA;

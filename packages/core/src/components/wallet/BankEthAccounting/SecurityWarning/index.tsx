import { faCircleExclamation } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { PrivateKeyRecoveryOptionStatusEnum } from '__generated__/globalTypes';
import { Text14, Text16, Title6 } from '@core/atoms/typography';
import { SETTINGS_SECURITY } from '@core/constants/routes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useWalletDrawerContext } from '@core/contexts/walletDrawer';
import useRecoveryOptions from '@core/hooks/recovery/useRecoveryOptions';

const Wrapper = styled.div`
  border: 1px solid var(--c-neutral-300);
  border-radius: var(--unit);
  background-color: var(--c-neutral-200);
  padding: var(--unit);
  display: flex;
  flex-direction: row;
  gap: var(--unit);
  align-items: baseline;
  .dark-theme & {
    border: 1px solid var(--c-neutral-500);
    background-color: var(--c-neutral-400);
  }
`;

const Button = styled.button`
  .dark-theme & {
    text-decoration: underline;
  }
`;

export const SecurityWarning = () => {
  const { currentUser } = useCurrentUserContext();
  const { closeWalletAndDrawer } = useWalletDrawerContext();
  const { recoveryEmails } = useRecoveryOptions();
  const navigate = useNavigate();

  const hasVerifiedRecoveryEmail =
    recoveryEmails.filter(
      r => r.status === PrivateKeyRecoveryOptionStatusEnum.ACTIVE
    ).length > 0;

  if (!currentUser) return null;
  const { wallet, otpRequiredForLogin } = currentUser;

  if (!wallet || (otpRequiredForLogin && hasVerifiedRecoveryEmail)) return null;

  const { holdsValue } = wallet;

  if (!holdsValue) return null;

  const navigateAndCloseDrawer = () => {
    closeWalletAndDrawer();
    navigate(SETTINGS_SECURITY);
  };
  return (
    <Wrapper>
      <Text16>
        <FontAwesomeIcon
          icon={faCircleExclamation}
          color="var(--c-neutral-600)"
        />
      </Text16>
      <div>
        <Title6 color="var(--c-neutral-1000)">
          <FormattedMessage
            id="Wallet.BankEthAccounting.securityWaring.title"
            defaultMessage="Protect your Sorare account and wallet."
          />
        </Title6>
        <Text14 color="var(--c-neutral-600)">
          <FormattedMessage
            id="Wallet.BankEthAccounting.securityWaring.desc"
            defaultMessage="Add a recovery email and enable two-factor authentication to keep your account secure."
          />
        </Text14>
        <Text16 color="var(--c-link)">
          <Button type="button" onClick={navigateAndCloseDrawer}>
            <FormattedMessage
              id="Wallet.BankEthAccounting.securityWaring.cta"
              defaultMessage="Update security preferences"
            />
          </Button>
        </Text16>
      </div>
    </Wrapper>
  );
};

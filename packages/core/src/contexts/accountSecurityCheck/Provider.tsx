import { addHours, addWeeks, isPast } from 'date-fns';
import { ReactNode, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { SorareLogo } from '@sorare/core/src/atoms/icons/SorareLogo';
import DialogWithNavigation from '@sorare/core/src/atoms/layout/DialogWithNavigation';
import SmallerStarBall from '@sorare/core/src/atoms/navigation/SmallerStarBall';
import { Title4 } from '@sorare/core/src/atoms/typography';
import { AddRecoveryEmailForm } from 'components/settings/RecoveryEmail/AddRecoveryEmailForm';
import { VerifyRecoveryEmailForm } from 'components/settings/RecoveryEmail/VerifyRecoveryEmailForm';
import { useCurrentUserContext } from 'contexts/currentUser';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useWalletNeedsRecover from '@sorare/core/src/hooks/recovery/useWalletNeedsRecover';
import useLifecycle, { LIFECYCLE, Lifecycle } from '@sorare/core/src/hooks/useLifecycle';
import { glossary, userAttributes } from '@sorare/core/src/lib/glossary';

import AccountSecurityCheckContextProvider, { SecurityCheckTab } from '.';
import AddPhoneNumber from './AddPhoneNumber';
import { Enable2FA } from './Enable2FA';
import { Home } from './Home';
import VerifyPhoneNumber from './VerifyPhoneNumber';

interface Props {
  children: ReactNode;
}

const tabTitles = {
  [SecurityCheckTab.HOME]: undefined,
  [SecurityCheckTab.ADD_RECOVERY_EMAIL]: glossary.recoveryEmail,
  [SecurityCheckTab.VERIFY_RECOVERY_EMAIL]: glossary.recoveryEmail,
  [SecurityCheckTab.ADD_PHONE_NUMBER]: userAttributes.phoneNumber,
  [SecurityCheckTab.VERIFY_PHONE_NUMBER]: userAttributes.phoneNumber,
  [SecurityCheckTab.ENABLE_2FA]: glossary.twofa,
};
const SorareTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--unit);
`;

const AccountSecurityCheckProvider = ({ children }: Props) => {
  const { update, loading } = useLifecycle();
  const { up: isTabletOrDesktop } = useScreenSize('tablet');
  const [shouldCheckSecurityNow, setShouldCheckSecurityNow] =
    useState<boolean>(false);
  const [securityCheckTab, setSecurityCheckTab] = useState<SecurityCheckTab>(
    SecurityCheckTab.HOME
  );
  const [onBackTarget, setOnBackTarget] = useState<SecurityCheckTab>(
    SecurityCheckTab.HOME
  );

  const [unverifiedPhoneNumber, setUnverifiedPhoneNumber] = useState<
    string | null
  >(null);
  const [unverifiedRecoveryEmail, setUnverifiedRecoveryEmail] = useState<
    string | null
  >(null);

  const { currentUser } = useCurrentUserContext();
  const walletNeedsRecover = useWalletNeedsRecover();

  const nextTimeUserNeedsCheckSecurity =
    ((currentUser?.userSettings?.lifecycle as Lifecycle)
      ?.nextTimeUserNeedsCheckSecurity as string | undefined) ||
    (currentUser?.createdAt &&
      addHours(new Date(currentUser.createdAt), 1).toISOString());

  const needsSecurityCheck =
    currentUser?.wallet?.holdsValue &&
    !walletNeedsRecover &&
    !shouldCheckSecurityNow &&
    (!nextTimeUserNeedsCheckSecurity ||
      (nextTimeUserNeedsCheckSecurity &&
        isPast(new Date(nextTimeUserNeedsCheckSecurity))));

  const onClose = () => {
    update(
      LIFECYCLE.nextTimeUserNeedsCheckSecurity,
      addWeeks(Date.now(), 1).toISOString()
    );
    setShouldCheckSecurityNow(false);
  };

  const onBackButton = () => {
    setSecurityCheckTab(onBackTarget);
    setOnBackTarget(SecurityCheckTab.HOME);
  };

  if (needsSecurityCheck && !loading) {
    setShouldCheckSecurityNow(true);
  }

  return (
    <AccountSecurityCheckContextProvider
      value={{
        setSecurityCheckTab,
        setOnBackTarget,
        setUnverifiedRecoveryEmail,
        setUnverifiedPhoneNumber,
      }}
    >
      {children}
      {currentUser && (
        <DialogWithNavigation
          open={shouldCheckSecurityNow}
          onBackButton={
            securityCheckTab !== SecurityCheckTab.HOME
              ? onBackButton
              : undefined
          }
          title={
            tabTitles[securityCheckTab] ? (
              <Title4 color="var(--c-neutral-1000)">
                <FormattedMessage {...tabTitles[securityCheckTab]} />
              </Title4>
            ) : (
              <SorareTitle>
                <SmallerStarBall color="var(--c-neutral-1000)" />
                <SorareLogo variant="var(--c-neutral-1000)" />
              </SorareTitle>
            )
          }
          headerCentered
          hideCloseButton
          fullScreen={!isTabletOrDesktop}
        >
          {securityCheckTab === SecurityCheckTab.HOME && (
            <Home onClose={onClose} />
          )}
          {securityCheckTab === SecurityCheckTab.ENABLE_2FA && (
            <Enable2FA
              onClose={() => setSecurityCheckTab(SecurityCheckTab.HOME)}
            />
          )}
          {securityCheckTab === SecurityCheckTab.ADD_PHONE_NUMBER && (
            <AddPhoneNumber
              onSuccess={(phoneNumber: string) => {
                setSecurityCheckTab(SecurityCheckTab.VERIFY_PHONE_NUMBER);
                setOnBackTarget(SecurityCheckTab.ADD_PHONE_NUMBER);
                setUnverifiedPhoneNumber(phoneNumber);
              }}
            />
          )}
          {securityCheckTab === SecurityCheckTab.VERIFY_PHONE_NUMBER &&
            unverifiedPhoneNumber && (
              <VerifyPhoneNumber
                unverifiedPhoneNumber={unverifiedPhoneNumber}
                onCancel={() => {
                  setSecurityCheckTab(SecurityCheckTab.ADD_PHONE_NUMBER);
                  setUnverifiedPhoneNumber(null);
                  setOnBackTarget(SecurityCheckTab.HOME);
                }}
                onSuccess={() => {
                  setSecurityCheckTab(SecurityCheckTab.HOME);
                  setOnBackTarget(SecurityCheckTab.HOME);
                  setUnverifiedPhoneNumber(null);
                }}
              />
            )}
          {securityCheckTab === SecurityCheckTab.ADD_RECOVERY_EMAIL && (
            <AddRecoveryEmailForm
              email={unverifiedRecoveryEmail}
              onSuccess={(newRecoveryEmail: string) => {
                setUnverifiedRecoveryEmail(newRecoveryEmail);
                setOnBackTarget(SecurityCheckTab.ADD_RECOVERY_EMAIL);
                setSecurityCheckTab(SecurityCheckTab.VERIFY_RECOVERY_EMAIL);
              }}
            />
          )}
          {unverifiedRecoveryEmail &&
            securityCheckTab === SecurityCheckTab.VERIFY_RECOVERY_EMAIL && (
              <VerifyRecoveryEmailForm
                email={unverifiedRecoveryEmail}
                onSuccess={() => {
                  setOnBackTarget(SecurityCheckTab.HOME);
                  setSecurityCheckTab(SecurityCheckTab.HOME);
                  setUnverifiedRecoveryEmail(null);
                }}
              />
            )}
        </DialogWithNavigation>
      )}
    </AccountSecurityCheckContextProvider>
  );
};

export default AccountSecurityCheckProvider;

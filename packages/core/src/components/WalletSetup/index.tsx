import { addHours, addWeeks, isPast } from 'date-fns';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import DialogWithNavigation from '@sorare/core/src/atoms/layout/DialogWithNavigation';
import { TERMS } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import useLifecycle, { LIFECYCLE, Lifecycle } from '@sorare/core/src/hooks/useLifecycle';
import { useWalletPreferences } from '@sorare/core/src/hooks/wallets/useWalletPreferences';

import { Home } from './Home';
import { Setup } from './Setup';
import { StepIndicator } from './StepIndicator';
import { WhatsNew } from './WhatsNew';
import { WalletSetupTab } from './type';

const backTargets = {
  [WalletSetupTab.HOME]: undefined,
  [WalletSetupTab.WHATS_NEW]: WalletSetupTab.HOME,
  [WalletSetupTab.SETUP]: WalletSetupTab.WHATS_NEW,
};

const WalletSetup = () => {
  const {
    flags: { useNewWallet = false },
  } = useFeatureFlags();

  const { hasMigratedAndSetupWallet } = useWalletPreferences();
  const location = useLocation();
  const { update, loading } = useLifecycle();
  const { up: isTabletOrDesktop } = useScreenSize('tablet');
  const [walletSetupTab, setWalletSetupTab] = useState<WalletSetupTab>(
    WalletSetupTab.HOME
  );
  const [shouldSetupWalletNow, setShouldSetupWalletNow] =
    useState<boolean>(false);

  const { currentUser } = useCurrentUserContext();

  if (!currentUser) {
    return null;
  }

  const nextTimeUserNeedsSetupWallet =
    ((currentUser?.userSettings?.lifecycle as Lifecycle)
      ?.nextTimeUserNeedsSetupWallet as string | undefined) ||
    (currentUser?.createdAt &&
      addHours(new Date(currentUser.createdAt), 1).toISOString());

  const needsSetupWallet =
    !shouldSetupWalletNow &&
    (!nextTimeUserNeedsSetupWallet ||
      (nextTimeUserNeedsSetupWallet &&
        isPast(new Date(nextTimeUserNeedsSetupWallet))));

  const onClose = () => {
    update(
      LIFECYCLE.nextTimeUserNeedsSetupWallet,
      addWeeks(Date.now(), 1).toISOString()
    );
    setShouldSetupWalletNow(false);
  };

  const onBackButton = () => {
    if (backTargets[walletSetupTab]) {
      setWalletSetupTab(backTargets[walletSetupTab]!);
    }
  };

  if (
    useNewWallet &&
    needsSetupWallet &&
    !loading &&
    !hasMigratedAndSetupWallet
  ) {
    setShouldSetupWalletNow(true);
  }

  const isAuthorizedRoute = !location.pathname.match(TERMS);

  return (
    <DialogWithNavigation
      open={shouldSetupWalletNow && isAuthorizedRoute}
      onBackButton={
        walletSetupTab !== WalletSetupTab.HOME ? onBackButton : undefined
      }
      hideCloseButton
      onClose={onClose}
      title={<StepIndicator walletSetupTab={walletSetupTab} />}
      fullScreen={!isTabletOrDesktop}
    >
      {walletSetupTab === WalletSetupTab.HOME && (
        <Home onClose={onClose} setWalletSetupTab={setWalletSetupTab} />
      )}
      {walletSetupTab === WalletSetupTab.WHATS_NEW && (
        <WhatsNew setWalletSetupTab={setWalletSetupTab} />
      )}
      {walletSetupTab === WalletSetupTab.SETUP && <Setup onClose={onClose} />}
    </DialogWithNavigation>
  );
};

export default WalletSetup;

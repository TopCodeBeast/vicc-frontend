import { isBefore } from 'date-fns/esm';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { FiatWalletAccountState } from '__generated__/globalTypes';
import CreateFiatWallet from '@core/components/fiatWallet/CreateFiatWallet';
import { CreateFiatWalletSteps } from '@core/components/fiatWallet/CreateFiatWallet/type';
import { PRIVACY_POLICY, TERMS } from '@core/constants/routes';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import useLifecycle, { LIFECYCLE, Lifecycle } from '@core/hooks/useLifecycle';
import useQueryString from '@core/hooks/useQueryString';
import { useFiatBalance } from '@core/hooks/wallets/useFiatBalance';

const cashWalletLaunchDate = new Date('2023-08-01T00:00:00.000Z');

const WalletSetup = () => {
  const {
    flags: { useCashWallet = false },
  } = useFeatureFlags();

  const {
    currentUser,
    walletPreferences: { hasMigratedAndSetupWallets },
  } = useCurrentUserContext();

  const location = useLocation();
  const navigate = useNavigate();
  const { update, loading } = useLifecycle();

  const [shouldSetupWalletNow, setShouldSetupWalletNow] =
    useState<boolean>(false);

  const { fiatBalanceStatus } = useFiatBalance();
  const action = useQueryString('action');
  const needsToKycBecauseRefused = action === 'kyc';

  if (!currentUser) {
    return null;
  }

  const userCreatedAt = new Date(currentUser.createdAt);

  const userHasBeenCreatedBeforeCashWalletLaunch = isBefore(
    userCreatedAt,
    cashWalletLaunchDate
  );

  const userHasSetupWallet = !!(
    currentUser?.userSettings?.lifecycle as Lifecycle
  )?.userHasSetupWallet;

  const onClose = () => {
    if (!userHasSetupWallet) {
      update(LIFECYCLE.userHasSetupWallet, true);
    }
    setShouldSetupWalletNow(false);
    if (needsToKycBecauseRefused) {
      // remove the ?action=
      navigate(location.pathname);
    }
  };

  if (
    useCashWallet &&
    !userHasSetupWallet &&
    !loading &&
    (!hasMigratedAndSetupWallets || userHasBeenCreatedBeforeCashWalletLaunch) &&
    !shouldSetupWalletNow
  ) {
    setShouldSetupWalletNow(true);
  }

  if (
    useCashWallet &&
    needsToKycBecauseRefused &&
    fiatBalanceStatus !== FiatWalletAccountState.VALIDATED_OWNER &&
    !shouldSetupWalletNow
  ) {
    setShouldSetupWalletNow(true);
  }

  const isAuthorizedRoute =
    !location.pathname.match(TERMS) || !location.pathname.match(PRIVACY_POLICY);

  if (!shouldSetupWalletNow || !isAuthorizedRoute) {
    return null;
  }

  return (
    <CreateFiatWallet
      initialStep={
        !needsToKycBecauseRefused ? CreateFiatWalletSteps.WHATS_NEW : undefined
      }
      statusTarget={FiatWalletAccountState.VALIDATED_OWNER}
      canDismissAfterActivation={!needsToKycBecauseRefused}
      onClose={onClose}
      onDismissActivationSuccess={onClose}
      onDismissBeforeActivation={onClose}
    />
  );
};

export default WalletSetup;

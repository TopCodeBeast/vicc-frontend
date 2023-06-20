import { EnabledWallet } from '__generated__/globalTypes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';

export const useWalletPreferences = () => {
  const {
    flags: { useNewWallet = false },
  } = useFeatureFlags();
  const { currentUser } = useCurrentUserContext();
  // enabledWallets:
  // - before migration: null
  // - after user has migrated: EnabledWallet[] and cannot be empty array
  const enabledWallets = currentUser?.profile.enabledWallets;

  const hasMigratedAndSetupWallet = !!(useNewWallet && enabledWallets);

  const showEthWallet = hasMigratedAndSetupWallet
    ? enabledWallets.includes(EnabledWallet.ETH)
    : true;

  const showFiatWallet = !!(
    useNewWallet && enabledWallets?.includes(EnabledWallet.FIAT)
  );

  const onlyShowFiatCurrency = !!(
    useNewWallet &&
    showFiatWallet &&
    !showEthWallet
  );

  return {
    enabledWallets,
    hasMigratedAndSetupWallet,
    onlyShowFiatCurrency,
    showEthWallet,
    showFiatWallet,
  };
};

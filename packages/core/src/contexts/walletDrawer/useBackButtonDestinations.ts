import { useCurrentUserContext } from '@core/contexts/currentUser';

import { WalletTab } from '.';

const backButtonDestinations = {
  [WalletTab.RECOVER_KEY]: null,
  [WalletTab.RESTORE_WALLET]: WalletTab.HOME,
  [WalletTab.GENERATE_KEY]: null,
  [WalletTab.GENERATE_KEYS]: null,
  [WalletTab.CHANGE_PASSWORD]: null,
  [WalletTab.GET_PASSWORD]: null,
  [WalletTab.HOME]: null,
  [WalletTab.SETTINGS]: WalletTab.HOME,
  [WalletTab.PRIVATE_KEY_EXPORT]: WalletTab.SETTINGS,
  [WalletTab.DEPOSIT]: WalletTab.SETTINGS,
  [WalletTab.ADD_FUNDS]: WalletTab.HOME,
  [WalletTab.ADD_FUNDS_TO_FIAT_WALLET]: WalletTab.ADD_FUNDS,
  [WalletTab.ADD_FUNDS_TO_FIAT_WALLET_SUCCEEDED]: WalletTab.HOME,
  [WalletTab.ADD_FUNDS_TO_FIAT_WALLET_REVIEW]:
    WalletTab.ADD_FUNDS_TO_FIAT_WALLET,
  [WalletTab.ADD_FUNDS_TO_ETH_WALLET]: WalletTab.ADD_FUNDS,
  [WalletTab.ADD_FUNDS_TO_ETH_WALLET_FIAT]: WalletTab.ADD_FUNDS_TO_ETH_WALLET,
  [WalletTab.ADD_FUNDS_TO_ETH_WALLET_ETH]: WalletTab.ADD_FUNDS_TO_ETH_WALLET,
  [WalletTab.WITHDRAW_WALLET_CONNECT]: WalletTab.HOME,
  [WalletTab.WITHDRAW_TO]: WalletTab.HOME,
  [WalletTab.WITHDRAW_TO_ETH_WALLET]: WalletTab.WITHDRAW_TO,
  [WalletTab.WITHDRAW_TO_FIAT_WALLET]: WalletTab.WITHDRAW_TO,
  [WalletTab.WITHDRAW_TO_FIAT_WALLET_REVIEW]: WalletTab.WITHDRAW_TO_FIAT_WALLET,
  [WalletTab.WITHDRAW_TO_FIAT_WALLET_SUCCESS]: WalletTab.HOME,
  [WalletTab.WITHDRAW_TO_FIAT_WALLET_ADD_BANK_ACCOUNT]:
    WalletTab.WITHDRAW_TO_FIAT_WALLET,
};

export const useBackButtonDestinations = () => {
  const {
    walletPreferences: { showEthWallet, showFiatWallet },
  } = useCurrentUserContext();

  return {
    ...backButtonDestinations,
    ...(showFiatWallet &&
      !showEthWallet && {
        [WalletTab.ADD_FUNDS_TO_FIAT_WALLET]: WalletTab.HOME,
        [WalletTab.WITHDRAW_TO_FIAT_WALLET]: WalletTab.HOME,
      }),
    ...(showEthWallet &&
      !showFiatWallet && {
        [WalletTab.ADD_FUNDS_TO_ETH_WALLET]: WalletTab.HOME,
        [WalletTab.WITHDRAW_TO_ETH_WALLET]: WalletTab.HOME,
      }),
  };
};

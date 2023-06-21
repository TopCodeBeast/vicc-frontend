import { RefObject, createContext, useContext } from 'react';

import type { GoogleReCAPTCHA } from '@core/components/recaptcha';

export enum WalletTab {
  // Open from outside the wallet
  RECOVER_KEY = 'recoverKey',
  RESTORE_WALLET = 'restoreWallet',
  GENERATE_KEY = 'generateKey',
  GENERATE_KEYS = 'generateKeys',
  CHANGE_PASSWORD = 'changePassword',
  GET_PASSWORD = 'getPassword',

  // Open inside the wallet
  HOME = 'home',
  SETTINGS = 'settings',
  PRIVATE_KEY_EXPORT = 'privateKeyExport',
  DEPOSIT = 'deposit',
  ADD_FUNDS = 'addFunds',
  ADD_FUNDS_FIAT = 'addFundsFiat',
  ADD_FUNDS_ETH = 'addFundsEth',
  WITHDRAW = 'withdraw',
  WITHDRAW_TO = 'withdrawTo',
}

export const backButtonDestinations = {
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
  [WalletTab.ADD_FUNDS_FIAT]: WalletTab.ADD_FUNDS,
  [WalletTab.ADD_FUNDS_ETH]: WalletTab.ADD_FUNDS,
  [WalletTab.WITHDRAW]: WalletTab.HOME,
  [WalletTab.WITHDRAW_TO]: WalletTab.HOME,
};

type VoidFn = () => void;

export interface WalletDrawerContextType {
  mounted: boolean;
  setMounted: (mounted: boolean) => void;
  drawerOpened: boolean;
  showDrawer: () => void;
  hideDrawer: () => void;
  toggleDrawer: () => void;
  walletOpened: boolean;
  showWallet: () => void;
  hideWallet: () => void;
  currentTab: WalletTab;
  setCurrentTab: (currentTab: WalletTab) => void;
  navFromMenu: boolean;
  setNavFromMenu: (bool: boolean) => void;
  walletIsLocked: boolean;
  setWalletIsLocked: (bool: boolean) => void;
  onBackButton: () => void;
  setBeforeBackButton: (fn: VoidFn) => void;
  closeWalletAndDrawer: () => void;
  recaptchaRef: RefObject<GoogleReCAPTCHA>;
}

export const walletDrawerContext =
  createContext<WalletDrawerContextType | null>(null);

export const useWalletDrawerContext = () => useContext(walletDrawerContext)!;

export default walletDrawerContext.Provider;

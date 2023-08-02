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
  ADD_FUNDS_TO_FIAT_WALLET = 'addFundsToFiatWallet',
  ADD_FUNDS_TO_FIAT_WALLET_SUCCEEDED = 'addFundsToFiatWalletSucceeded',
  ADD_FUNDS_TO_FIAT_WALLET_REVIEW = 'addFundsToFiatWalletReview',
  ADD_FUNDS_TO_ETH_WALLET = 'addFundsToEthWallet',
  ADD_FUNDS_TO_ETH_WALLET_FIAT = 'addFundsFiat',
  ADD_FUNDS_TO_ETH_WALLET_ETH = 'addFundsEth',
  WITHDRAW_WALLET_CONNECT = 'withdrawWalletConnect',
  WITHDRAW_TO = 'withdrawTo',
  WITHDRAW_TO_ETH_WALLET = 'withdrawToEthWallet',
  WITHDRAW_TO_FIAT_WALLET = 'withdrawToFiatWallet',
  WITHDRAW_TO_FIAT_WALLET_REVIEW = 'withdrawToFiatWalletReview',
  WITHDRAW_TO_FIAT_WALLET_SUCCESS = 'withdrawToFiatWalletSuccess',
  WITHDRAW_TO_FIAT_WALLET_ADD_BANK_ACCOUNT = 'withdrawToFiatWalletAddBankAccount',
}

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

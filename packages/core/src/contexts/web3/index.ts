import { Web3Provider } from '@coinbase/wallet-sdk/dist/provider/Web3Provider';
import { createContext, useContext } from 'react';

import { EthereumSetupStatus, Wallet } from '@sorare/core/src/lib/web3';

export interface Web3ContextType {
  currentProvider: any;
  ethereumSetupStatus: EthereumSetupStatus;
  walletConnectRequestPending: boolean;
  walletConnectAlreadyRequestedError: boolean;
  wallet: Wallet;
  setupCoinbaseWallet: () => void;
  setupWalletConnect: () => void;
  setupPortis: () => void;
  enable: (input: { provider: any; legacyWeb3?: boolean }) => Promise<boolean>;
  setCurrentProvider: (provider: any) => void;
}

declare global {
  interface Window {
    ethereum?: Web3Provider;
    web3: any;
  }
}

export const web3Context = createContext<Web3ContextType | null>(null);

export const useWeb3Context = () => useContext(web3Context)!;

export default web3Context.Provider;

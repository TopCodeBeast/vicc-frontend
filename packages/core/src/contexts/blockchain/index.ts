/* eslint-disable no-restricted-imports */

import { createContext, useContext } from 'react';

import { Deal, EthereumManagers } from '@sorare/blockchain';

import { DepositAction } from './types';

export interface AccountData {
  ethAccount?: string;
  ethBalance?: string | null;
  bankMapping?: string | null;
  ethereum: EthereumManagers;
}

export interface CreateOfferArgs {
  receiver?: string;
  sendAmountInEth?: string;
  receiveAmountInEth?: string;
  sendCardIds?: string[];
  receiveCardIds?: string[];
  endingAt?: string;
}

export interface EthereumAccountHandler {
  resolve: (v: AccountData) => void;
  reject: (reason: any) => void;
}

export type InitEthereumSource = 'InBackground' | 'OnUserRequest';

export interface BlockchainContext {
  getAccountData: () => Promise<AccountData>;
  loading: boolean;
  depositEth: (amountInEth: number) => Promise<
    | null
    | {
        result: string | null;
        err?: undefined;
      }
    | {
        err: any;
        result?: undefined;
      }
  >;
  depositNft: (
    contractAddress: string,
    assetId: string
  ) => Promise<null | {
    err?: Error;
    txHash?: string;
    type?: DepositAction;
  }>;
  withdrawFromBank: (
    amountInWei: string,
    nonce: number,
    signature: string
  ) => Promise<any>;
  depositCardOnAccount: (cardId: string) => Promise<any>;
  unmapWallet: () => Promise<any>;
  signMappedTokensForDeal: (
    deal: Deal,
    side: 'sender' | 'receiver'
  ) => Promise<string>;
  ethereumInitialized: boolean;
  connectToEthereum: (source: InitEthereumSource) => void;
  promptEthereumAccount: boolean;
  ethereumNetworkId?: string;
  expectedEthereumNetwork?: string;
  ethereumAccountHandlers: EthereumAccountHandler[];
  signMigratorApprovalForMappedAccount: (
    nonce: number,
    address: string
  ) => Promise<string>;
  signMigration: (
    cardIds: string[],
    expirationBlock: number
  ) => Promise<string>;
}

export const blockchainContext = createContext<BlockchainContext | null>(null);

export const useBlockchainContext = () => useContext(blockchainContext)!;

export default blockchainContext.Provider;

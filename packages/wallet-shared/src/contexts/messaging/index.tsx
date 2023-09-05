import { createContext } from 'react';

import { LimitOrder, Signature, Transfer } from '@sorare/crypto';

import { AuthorizationApproval, AuthorizationRequest } from './authorizations';
import { Dict } from './dict';
import { Props, MessagingProvider as Provider } from './provider';
import { MessagingContext as IMessagingContext, RPC } from './types';

export const appHandlers = [
  'addStarkKey',
  'changePassword',
  'forgotPassword',
  'generatedKey',
  'init',
  'keys',
  'prepareEthDeposit',
  'recoverKey',
  'resetPassword',
  'resetPrivateKey',
  'verify2FA',
  'salt',
  'signIn',
  'signUp',
  'toggle',
  'transaction',
  'user',
  'walletIsLocked',
  'requestPlaceholderResize',
  'requestOAuth',
  'returnToWalletSettingsTab',
  'passwordForgotten',
  'onBackForgotPassword',
  'setMode',
  'signUpAdditionalScreen',
  'backFromSignUpAdditionalScreen',
] as const;
export const walletHandlers = [
  'cancelUnlockScreen',
  'prompt',
  'promptResetPassword',
  'promptDeposit',
  'promptRecoverKey',
  'promptRestoreWallet',
  'password',
  'generateKey',
  'createWalletRecovery',
  'signSettleDeal',
  'signTransfer',
  'signPaymentIntent',
  'signWalletChallenge',
  'signLimitOrders',
  'approveAuthorizationRequests',
  'approveBank',
  'approveMigrator',
  'signMigration',
  'signEthMigration',
  'logOut',
  'errorTracking',
  'setTheme',
] as const;

export type AppHandler = (typeof appHandlers)[number];
export type WalletHandler = (typeof walletHandlers)[number];

export type Handler = AppHandler | WalletHandler;

type WalletRPC = RPC<Handler>;

export interface EncryptedPrivateKey {
  salt: string;
  iv: string;
  encryptedPrivateKey: string;
}

export interface PasswordEncryptedPrivateKey {
  iv: string;
  payload: string;
  salt: string;
}

export interface PrivateKeyRecovery {
  appId: string;
  encryptionKey: string;
  email?: string;
  iv: string;
  payload: string;
  phone?: string;
  teamId: string;
}

export const backupOwners = ['vaultinum'] as const;

export type BackupOwner = (typeof backupOwners)[number];

export interface BackupPrivateKeyRecovery {
  encryptedSymmetricKey: string;
  iv: string;
  payload: string;
  rsaEncryptionKey: BackupOwner;
  rsaPublicKey: string;
}

export interface PrivateKeyRecoveryPayload {
  iv: string;
  ivTemp: string;
  encryptionKey: string;
  payload: string;
}

export interface Wallet {
  starkKeyWithPrefix: string;
  ethereumAddress: string;
  passwordEncryptedPrivateKey: PasswordEncryptedPrivateKey;
  privateKeyRecovery: PrivateKeyRecovery;
  backupPrivateKeyRecoveries: BackupPrivateKeyRecovery[];
  legacyBackupPrivateKeyRecovery?: string;
}

export enum SettleDealSignatureType {
  SendETH = 0, // 0
  SendInternalTokens, // 1
  SendMappedTokens, // 2
  ReceiveETH, // 3
  ReceiveInternalTokens, // 4
  ReceiveMappedTokens, // 5
}

export interface Deal {
  dealId: number | string;
  sender: string;
  receiver?: string | null;
  sendAmountInWei?: number | string | null;
  minReceiveAmountInWei?: number | string | null;
  sendTokenIds?: (number | string)[] | null;
  receiveTokenIds?: (number | string)[] | null;
  bankAddress: string;
}

/* APP REQUESTS */

export interface Prompt extends WalletRPC {
  request: {
    handler: 'prompt';
    args: {
      type:
        | 'signUp'
        | 'signUpMobileView'
        | 'signIn'
        | 'passwordForgotten'
        | 'changePassword'
        | 'privateKeyExport'
        | 'deposit'
        | 'generateKey'
        | 'createWalletRecovery'
        | 'generateKeys'
        | 'signMessage';
      version?: string; // the version of the prompt to use
    };
  };
}

export interface PromptDeposit extends WalletRPC {
  request: {
    handler: 'promptDeposit';
    args: {
      id?: string;
    };
  };
}

export interface PromptResetPassword extends WalletRPC {
  request: {
    handler: 'promptResetPassword';
    args: {
      email: string;
      nickname: string;
      resetPasswordToken: string;
    };
  };
}

type ResultOrError<T, CODES extends number> =
  | { result: T; error?: never }
  | {
      result?: never;
      error: {
        code: CODES;
        message: string;
      };
    };

export interface PromptRecoverKey extends WalletRPC {
  request: {
    handler: 'promptRecoverKey';
    args: {
      userPrivateKeyRecovery: string;
    };
  };
}

export interface PromptRestoreWallet extends WalletRPC {
  request: {
    handler: 'promptRestoreWallet';
    args: {
      privateKeyRecoveryPayload: PrivateKeyRecoveryPayload;
      privateKeyRecoveryPayloads?: PrivateKeyRecoveryPayload[];
    };
  };
}

export enum PasswordError {
  INVALID_PASSWORD = 'InvalidPassword',
}

type PasswordArgs =
  | {
      error?: PasswordError;
      unlockWallet: false;
    }
  | { error?: never; unlockWallet?: never };

export interface Password extends WalletRPC {
  request: {
    handler: 'password';
    args: PasswordArgs;
  };
  response: {
    result: {
      passwordHash?: string;
    };
  };
}

export interface GenerateKey extends WalletRPC {
  request: {
    handler: 'generateKey';
    args: {
      email: string;
    };
  };
  response: {
    result?: {
      wallet: Wallet;
    };
  };
}

export interface CreateWalletRecovery extends WalletRPC {
  request: {
    handler: 'createWalletRecovery';
    args: {
      recoveryMethod: 'email' | 'phone';
      recoveryDestination: string;
    };
  };
  response:
    | {
        result: {
          privateKeyRecovery: PrivateKeyRecovery;
        };
        error?: never;
      }
    | {
        result?: never;
        error: string;
      };
}

export interface SignSettleDeal extends WalletRPC {
  request: {
    handler: 'signSettleDeal';
    args: {
      deal: Deal;
      action: SettleDealSignatureType;
      receiveAmountInWei?: string;
    };
  };
  response: {
    result?: {
      signature: string;
    };
  };
}

export interface SignTransfer extends WalletRPC {
  request: {
    handler: 'signTransfer';
    args: {
      transfer: Transfer;
    };
  };
  response: {
    result?: {
      signature: Signature;
    };
  };
}

export interface ApproveAuthorizationRequests extends WalletRPC {
  request: {
    handler: 'approveAuthorizationRequests';
    args: {
      authorizationRequests: AuthorizationRequest[];
    };
  };
  response: ResultOrError<
    {
      authorizationApprovals: AuthorizationApproval[];
      starkKey: string;
    },
    SignLimitOrdersErrorCodes
  >;
}

export interface SignPaymentIntent extends WalletRPC {
  request: {
    handler: 'signPaymentIntent';
    args: {
      id: string;
      amount: string;
    };
  };
  response: {
    result?: {
      signature: Signature;
    };
  };
}

export interface SignWalletChallenge extends WalletRPC {
  request: {
    handler: 'signWalletChallenge';
    args: {
      challenge: string;
    };
  };
  response: {
    result?: {
      signature: Signature;
    };
  };
}

export enum SignLimitOrdersErrorCodes {
  STARK_KEY_MISMATCH = 0,
  PROMPT_CANCELED = 1,
  MISSING_STARK_KEY = 2,
  SIGNING_ERROR = 3,
}

export interface SignLimitOrders extends WalletRPC {
  request: {
    handler: 'signLimitOrders';
    args: {
      limitOrders: LimitOrder[];
    };
  };
  response: ResultOrError<
    {
      signatures: Signature[];
      starkKey: string;
    },
    SignLimitOrdersErrorCodes
  >;
}

export interface ApproveBank extends WalletRPC {
  request: {
    handler: 'approveBank';
    args: {
      nonce: string;
    };
  };
  response: {
    result?: {
      encodedFunction: string;
      signature: string;
      extraGas: number;
    };
  };
}

export interface ApproveMigrator extends WalletRPC {
  request: {
    handler: 'approveMigrator';
    args: {
      nonce: number | string;
    };
  };
  response: {
    result?: {
      encodedFunction: string;
      signature: string;
      extraGas: number;
    };
  };
}

export interface SignMigration extends WalletRPC {
  request: {
    handler: 'signMigration';
    args: {
      cardIds: string[];
      expirationBlock: number | string;
    };
  };
  response: {
    result?: {
      signature: string;
    };
  };
}

export interface SignEthMigration extends WalletRPC {
  request: {
    handler: 'signEthMigration';
    args: {
      dealId: string | number;
      sendAmountInWei: string | number;
    };
  };
  response: {
    result?: {
      signature: string;
    };
  };
}

export interface LogOut extends WalletRPC {
  request: {
    handler: 'logOut';
    args: {
      flushMessagingQueue: boolean;
    };
  };
}

/* WALLET REQUESTS */

interface UserInfo {
  email: string;
  nickname: string;
  address?: string;
  userPrivateKey?: EncryptedPrivateKey;
  starkKey?: string;
}

export interface Toggle extends WalletRPC {
  request: {
    handler: 'toggle';
    args: {
      display: boolean;
      closeDrawer?: boolean;
    };
  };
}

export interface RequestResize extends WalletRPC {
  request: {
    handler: 'requestPlaceholderResize';
    args: {
      height: number;
      width: number;
      swallowIfNoHandler: true;
    };
  };
}

export interface Init extends WalletRPC {
  request: {
    handler: 'init';
  };
  response: {
    result: {
      user?: UserInfo;
      dict: Dict;
      featureFlags: Record<string, any>;
      currency: {
        code: string;
        symbol: string;
      };
      ethRate: number;
      langDir?: 'ltr' | 'rtl';
    };
  };
}

export interface Salt extends WalletRPC {
  request: {
    handler: 'salt';
    args: {
      email: string;
    };
  };
  response: {
    result: {
      salt: string;
    };
  };
}

type SharedSignUpArgs = {
  email: string;
  passwordHash: string;
  nickname: string;
  wallet: Wallet;
  mobile?: boolean;
};

type V1SignUpArgs = SharedSignUpArgs & {
  version?: '1';
};

export type AcceptTermsInfo = {
  acceptTerms: true;
  acceptAgeLimit: true;
  acceptPrivacyPolicy: true;
  agreedToReceiveOffersFromPartners: boolean;
  agreedToReceiveOffersFromPartnersSpecific?: string[];
};

type V2SignUpArgs = SharedSignUpArgs &
  AcceptTermsInfo & {
    version: '2';
  };

export interface SignUp extends WalletRPC {
  request: {
    handler: 'signUp';
    args: V1SignUpArgs | V2SignUpArgs;
  };
  response: {
    error?: Record<string, any>;
  };
}

export interface SignIn extends WalletRPC {
  request: {
    handler: 'signIn';
    args: {
      email: string;
      passwordHash: string;
      otpAttempt: string;
    };
  };
  response: {
    result?: UserInfo;
    error?: 'invalid' | 'unconfirmed' | 'rate-limit';
  };
}

export interface Keys extends WalletRPC {
  request: {
    handler: 'keys';
  };
  response: {
    result: {
      userPrivateKey?: EncryptedPrivateKey;
      viccEncryptionKey: string;
    };
    error?: 'invalid-otp';
  };
}

export interface PrepareEthDeposit extends WalletRPC {
  request: {
    handler: 'prepareEthDeposit';
    args: {
      weiAmount: string;
    };
  };
  response: {
    result?: {
      assetType: string;
      weiAmount: string;
      vaultId: number;
    };
  };
}

export interface ChangePassword extends WalletRPC {
  request: {
    handler: 'changePassword';
    args: {
      currentPasswordHash: string;
      passwordHash: string;
      userPrivateKey?: EncryptedPrivateKey;
    };
  };
}

export interface ResetPassword extends WalletRPC {
  request: {
    handler: 'resetPassword';
    args: {
      passwordHash: string;
      resetPasswordToken: string;
    };
  };
}

export interface ResetPrivateKey extends WalletRPC {
  request: {
    handler: 'resetPrivateKey';
    args: {
      starkKey: string;
    };
  };
}

export interface Verify2FA extends WalletRPC {
  request: {
    handler: 'verify2FA';
  };
  response: {
    result?: {
      userPrivateKey?: EncryptedPrivateKey;
    };
    error?: 'invalid-otp';
  };
}

export interface RecoverKey extends WalletRPC {
  request: {
    handler: 'recoverKey';
    args: {
      passwordHash: string;
      userPrivateKey: EncryptedPrivateKey;
    };
  };
}

export interface GeneratedKey extends WalletRPC {
  request: {
    handler: 'generatedKey';
    args: {
      address?: string;
      passwordHash: string;
      userPrivateKey?: EncryptedPrivateKey;
      userPrivateKeyBackup?: string;
      starkKey?: string;
      wallet: Wallet;
    };
  };
}

export interface ForgotPassword extends WalletRPC {
  request: {
    handler: 'forgotPassword';
    args: {
      email: string;
      remainOpened?: true;
    };
  };
}

export interface OnBackForgotPassword extends WalletRPC {
  request: {
    handler: 'onBackForgotPassword';
  };
}

export interface Transaction extends WalletRPC {
  request: {
    handler: 'transaction';
    args: {
      hash?: string;
      depositId?: string;
      error?: string;
    };
  };
}

export interface ErrorTracking extends WalletRPC {
  request: {
    handler: 'errorTracking';
  };
  response: {
    result: {
      message: {
        errorTitle: string;
        errorBody: string;
      };
    };
  };
}
export interface WalletIsLocked extends WalletRPC {
  request: {
    handler: 'walletIsLocked';
    args: {
      isLocked: boolean;
    };
  };
}

export interface CancelUnlockScreen extends WalletRPC {
  request: {
    handler: 'cancelUnlockScreen';
    args: {
      bypassMessagingQueue: boolean;
    };
  };
}

export interface RequestOAuth2 extends WalletRPC {
  request: {
    handler: 'requestOAuth';
    args: {
      platform: 'google' | 'facebook';
    };
  };
}

export interface ReturnToWalletSettingsTab extends WalletRPC {
  request: {
    handler: 'returnToWalletSettingsTab';
  };
}

export interface PasswordForgotten extends WalletRPC {
  request: {
    handler: 'passwordForgotten';
  };
}

export interface SetMode extends WalletRPC {
  request: {
    handler: 'setMode';
    args: {
      mode: 'signin' | 'signup';
    };
  };
}

export interface SignUpAdditionalScreen extends WalletRPC {
  request: {
    handler: 'signUpAdditionalScreen';
  };
}

export interface BackFromSignUpAdditionalScreen extends WalletRPC {
  request: {
    handler: 'backFromSignUpAdditionalScreen';
  };
}
export interface SetTheme extends WalletRPC {
  request: {
    handler: 'setTheme';
    args: {
      dark: boolean;
    };
  };
}

export const MessagingContext =
  createContext<IMessagingContext<Handler> | null>(null);

export const MessagingProvider = (props: Props<Handler>) =>
  Provider<Handler>(props);

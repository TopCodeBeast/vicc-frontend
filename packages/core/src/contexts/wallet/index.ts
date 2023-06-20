import { createContext, useContext } from 'react';

import {
  ApproveMigrator,
  Deal,
  MessagingContext,
  PrivateKeyRecoveryPayload,
  Prompt,
  RequestOAuth2,
  SettleDealSignatureType,
  SignLimitOrder,
  SignTransfer,
} from '@sorare/wallet-shared';
import {
  AuthorizationApproval,
  AuthorizationRequest,
} from '@sorare/wallet-shared/src/contexts/messaging/authorizations';
import { UpdateUserAttributes, UpdateUserEmailAttributes } from '@sorare/core/src/contexts/auth';
import { RecoveryOption } from '@sorare/core/src/hooks/recovery/useRecoveryOptions';
import { Side } from '@sorare/core/src/lib/deal';

export type LimitOrder = SignLimitOrder['request']['args']['limitOrder'];
export type Transfer = SignTransfer['request']['args']['transfer'];

export type { StarkexLimitOrderAuthorizationApproval } from '@sorare/wallet-shared/src/contexts/messaging/authorizations';

type OAuth2Platform = RequestOAuth2['request']['args']['platform'];

export type WalletPlaceHolderRequestedSize = {
  height: number;
  width: number;
};

export type WalletPlaceHolderResizeHandler = (
  dimensions: WalletPlaceHolderRequestedSize
) => void;

export type OAuth2RequestHandler = (platform: OAuth2Platform) => void;

interface WalletContext {
  setWindow: (window: Window | undefined) => void;
  signIn: () => Promise<void>;
  signUp: () => Promise<void>;
  signUpMobileView: () => Promise<void>;
  passwordForgotten: () => Promise<void>;
  promptResetPassword: () => Promise<void>;
  logOut: () => Promise<void>;
  prompt: (type: Prompt['request']['args']['type']) => Promise<void>;
  promptDeposit: (starkRegistrationSignature?: string) => Promise<void>;
  promptRestoreWallet: (
    privateKeyRecoveryPayloads: PrivateKeyRecoveryPayload[],
    recoveryOption?: RecoveryOption
  ) => Promise<void>;
  selectedRecoveryOption: RecoveryOption | null;
  handleWalletSuccessullyRecovered: () => Promise<void>;
  getPassword: (error?: boolean) => Promise<string | undefined>;
  checkUserPhoneNumberVerificationCodeWithRecovery: (
    code: string
  ) => Promise<{ message: string }[] | null>;
  updateUserEmailWithPassword: (
    attributes: UpdateUserEmailAttributes
  ) => Promise<any>;
  updateUserWithPassword: (attributes: UpdateUserAttributes) => Promise<any>;
  signInternalTokensForDeal: (
    deal: Deal,
    side: Side
  ) => Promise<string | undefined>;
  signSettleDeal: (
    deal: Deal,
    action: SettleDealSignatureType,
    receiveAmountInWei?: string
  ) => Promise<string | undefined>;
  approveMigrator: (
    nonce: number
  ) => Promise<ApproveMigrator['response']['result'] | undefined>;
  signMigration: (
    cardsIds: string[],
    expirationBlock: number | string
  ) => Promise<string | undefined>;
  signEthMigration: (
    nonce: string,
    amount: string
  ) => Promise<string | undefined>;
  signLimitOrders: (
    orders: LimitOrder[]
  ) => Promise<{ signatures?: string[]; starkKey?: string }>;
  signTransfer: (transfer: Transfer) => Promise<string | null>;
  approveAuthorizationRequests: (
    authorizationRequests: AuthorizationRequest[]
  ) => Promise<{
    authorizationApprovals?: AuthorizationApproval[];
    starkKey?: string;
  }>;
  signPaymentIntent: (id: string, amount: string) => Promise<string | null>;
  walletNode: Element | null;
  setWalletNode: (elt: Element | null) => void;
  setOnWalletResizeRequest: (
    callback: WalletPlaceHolderResizeHandler
  ) => () => void;
  registerOAuthHandler: (callback: OAuth2RequestHandler) => () => void;
}

export const walletContext = createContext<WalletContext | null>(null);

export const useWalletContext = () => useContext(walletContext)!;
export const useMessagingContext = () => useContext(MessagingContext)!;

export default walletContext.Provider;

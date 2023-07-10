import { LimitOrder, Signature, Transfer } from '@sorare/crypto';

type IAuthorizationRequest<T, R> = R & { __typename: T; fingerprint: string };

type StarkexTransferAuthorizationRequest = IAuthorizationRequest<
  'StarkexTransferAuthorizationRequest',
  Transfer
>;

type StarkexLimitOrderAuthorizationRequest = IAuthorizationRequest<
  'StarkexLimitOrderAuthorizationRequest',
  LimitOrder
>;

type StripeWalletTransferAuthorizationRequest = IAuthorizationRequest<
  'StripeWalletTransferAuthorizationRequest',
  {
    stripeAccountId: string;
    operationHash: string;
    currency: string;
    amount: number;
    nonce: number;
  }
>;

export type AuthorizationRequest =
  | StarkexTransferAuthorizationRequest
  | StarkexLimitOrderAuthorizationRequest
  | StripeWalletTransferAuthorizationRequest;

export const isAStarkexTransferAuthorizationRequest = (
  request: AuthorizationRequest
): request is StarkexTransferAuthorizationRequest => {
  return request.__typename === 'StarkexTransferAuthorizationRequest';
};

export const isAStarkexLimitOrderAuthorizationRequest = (
  request: AuthorizationRequest
): request is StarkexLimitOrderAuthorizationRequest => {
  return request.__typename === 'StarkexLimitOrderAuthorizationRequest';
};

export const isAStripeWalletTransferAuthorizationRequest = (
  request: AuthorizationRequest
): request is StripeWalletTransferAuthorizationRequest => {
  return request.__typename === 'StripeWalletTransferAuthorizationRequest';
};

type IAuthorizationApproval = {
  fingerprint: string;
};

type StarkexAuthorizationApproval = {
  nonce: number;
  expirationTimestamp: number;
  signature: Signature;
};

type StarkexTransferAuthorizationApproval = IAuthorizationApproval & {
  starkexTransferApproval: StarkexAuthorizationApproval;
};

export type StarkexLimitOrderAuthorizationApproval = IAuthorizationApproval & {
  starkexLimitOrderApproval: StarkexAuthorizationApproval;
};

type StripeWalletTransferAuthorizationApproval = IAuthorizationApproval & {
  stripeWalletTransferApproval: {
    nonce: number;
    signature: Signature;
  };
};

export type AuthorizationApproval =
  | StarkexTransferAuthorizationApproval
  | StarkexLimitOrderAuthorizationApproval
  | StripeWalletTransferAuthorizationApproval;

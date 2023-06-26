import { Tradeable, WalletStatus } from '__generated__/globalTypes';

import { BANK_APPROVAL_ERROR, WALLET_ACCESS_ERROR } from '../constants/errors';

export const isTransferable = (card: { tradeableStatus: Tradeable }) =>
  card.tradeableStatus === Tradeable.YES;

const handledErrors = [BANK_APPROVAL_ERROR, WALLET_ACCESS_ERROR];

export interface Card {
  __typename: 'Card';
  blockchainId: string;
  slug: string;
  tradeableStatus: Tradeable;
  walletStatus: WalletStatus;
  user: { slug: string } | null;
}

export interface Token {
  __typename: 'Token';
  ethereumId: string;
  slug: string;
  tradeableStatus: Tradeable;
  walletStatus: WalletStatus;
  owner: {
    user: { slug: string } | null;
  };
}

export const sides = ['sender', 'receiver'] as const;

export type Side = (typeof sides)[number];

export const generateDealId = () =>
  window.crypto.getRandomValues(new Uint32Array(4)).join('');

export const isHandledError = (e: Error) => handledErrors.includes(e.name);

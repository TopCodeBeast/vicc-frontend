import { createContext, useContext } from 'react';

import {
  EncryptedPrivateKey,
  PrivateKeyRecovery,
  Wallet,
} from '@sorare/wallet-shared';

export interface UpdateUserAttributes {
  email?: string;
  passwordHash?: string;
  currentPasswordHash?: string;
  sorarePrivateKey?: EncryptedPrivateKey;
  nickname?: string;
  sorareAddress?: string;
  sorarePrivateKeyBackup?: string;
  starkKey?: string;
  recaptchaToken?: string;
  recaptchaTokenV2?: string;
  wallet?: Wallet;
}

export interface UpdateUserEmailAttributes {
  email: string;
  recaptchaToken?: string;
  recaptchaTokenV2?: string;
  privateKeyRecovery: PrivateKeyRecovery;
}

export interface AuthContext {
  updateUser: (params: UpdateUserAttributes) => Promise<any>;
  confirmDevice: (confirmationToken: string) => Promise<any>;
  createResetPasswordRequest: (
    email: string,
    recaptchaToken: string
  ) => Promise<any>;
  resetPassword: (password: string, token: string) => Promise<any>;
  refreshCurrentUser: () => Promise<any>;
}

export const authContext = createContext<AuthContext | null>(null);

export const useAuthContext = () => useContext(authContext)!;

export default authContext.Provider;

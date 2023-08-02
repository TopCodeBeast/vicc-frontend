import { RefObject, createContext, useContext } from 'react';

import { EncryptedPrivateKey } from '@sorare/wallet-shared';
import { GoogleReCAPTCHA } from '@core/components/recaptcha';

export type SignedInInfo = {
  email: string;
  nickname: string;
  sorareAddress: string | null;
  sorarePrivateKey: EncryptedPrivateKey | null;
  mustAcceptTcus: boolean;
  error?: 'invalid';
};
export type Prompt2faCallback = {
  resolve: (params: SignedInInfo) => void;
  reject: (reason: any) => void;
};

export type AcceptTermsInfo = {
  acceptTerms: boolean;
  acceptAgeLimit: boolean;
  acceptPrivacyPolicy: boolean;
  acceptGameRules: boolean;
  agreedToReceiveOffersFromPartners: boolean;
};

export type PromptTermsCallback = {
  resolve: (params: AcceptTermsInfo) => void;
  reject: (reason: any) => void;
};

export type PromptTermsOptions = {
  closable?: boolean;
  withoutAcceptTermsMutation?: boolean;
  tcuToken?: string | null;
  initialTermsDisplay?: boolean;
};

export interface ConnectionContextType {
  signIn: () => void;
  signUp: () => void;
  showMobileWebviewSignUp: () => void;
  showMobileSignUpConfirmation: () => void;
  togglePasswordForgotten: () => void;
  toggleResetPassword: () => void;
  prompt2fa: (
    cb: Prompt2faCallback,
    otpSessionChallenge: string,
    reason?: string
  ) => void;
  promptTerms: (options: PromptTermsOptions, cb?: PromptTermsCallback) => void;
  promptNewDeviceConfirmation: () => void;
  passwordForgotten: boolean;
  acceptedTerms: AcceptTermsInfo | null;
  closeConnectionDialog: (email: string) => void;
  recaptchaRef: RefObject<GoogleReCAPTCHA>;
}

export const modes = [
  'signin',
  'signup',
  'resetPassword',
  'forgotPassword',
  '2fa',
  'dismissed',
  'recoverKey',
  'restoreWallet',
  'addFundsEth',
  'newDevice',
  'showTerms',
  'acceptTerms',
  'signUpSuccessMobileView',
  'kyc',
] as const;
export type Mode = (typeof modes)[number];

export const popModes = ['mustAcceptTerms'] as const;

export type PopMode = (typeof popModes)[number];

export const isConnectionMode = (action: string): action is Mode =>
  modes.includes(action as Mode);

export const connectionContext = createContext<ConnectionContextType | null>(
  null
);

export const useConnectionContext = () => useContext(connectionContext)!;

export default connectionContext.Provider;

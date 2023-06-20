import { createContext, useContext } from 'react';

export enum SecurityCheckTab {
  HOME = 'home',
  ENABLE_2FA = 'enable2FA',
  ADD_RECOVERY_EMAIL = 'addRecoveryEmail',
  VERIFY_RECOVERY_EMAIL = 'verifyRecoveryEmail',
  ADD_PHONE_NUMBER = 'addPhoneNumber',
  VERIFY_PHONE_NUMBER = 'verifyPhoneNumber',
}

type AccountSecurityCheckContext = {
  setSecurityCheckTab: (tab: SecurityCheckTab) => void;
  setOnBackTarget: (tab: SecurityCheckTab) => void;
  setUnverifiedRecoveryEmail: (email: string | null) => void;
  setUnverifiedPhoneNumber: (phoneNumber: string | null) => void;
};

export const accountSecurityCheckContext =
  createContext<AccountSecurityCheckContext | null>(null);

export const useAccountSecurityCheckContext = () =>
  useContext(accountSecurityCheckContext)!;

export default accountSecurityCheckContext.Provider;

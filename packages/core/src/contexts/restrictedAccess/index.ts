import { Dispatch, SetStateAction, createContext, useContext } from 'react';

export type RestrictedAccessReason = 'email' | 'phone';

export interface RestrictedAccessContext {
  setShowRestrictedAccess: Dispatch<
    SetStateAction<RestrictedAccessReason | undefined>
  >;
  showRestrictedAccess: RestrictedAccessReason | undefined;
}

export const restrictedAccessContext =
  createContext<RestrictedAccessContext | null>(null);

export const useRestrictedAccessContext = () =>
  useContext(restrictedAccessContext)!;

export default restrictedAccessContext.Provider;

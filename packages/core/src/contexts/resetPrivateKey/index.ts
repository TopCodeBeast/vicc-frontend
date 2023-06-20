import { Dispatch, SetStateAction, createContext, useContext } from 'react';

export interface ResetPrivateKeyContext {
  resetPrivateKey: boolean;
  setResetPrivateKey: Dispatch<SetStateAction<boolean>>;
}

export const resetPrivateKeyContext =
  createContext<ResetPrivateKeyContext | null>(null);

export const useResetPrivateKeyContext = () =>
  useContext(resetPrivateKeyContext)!;

export default resetPrivateKeyContext.Provider;

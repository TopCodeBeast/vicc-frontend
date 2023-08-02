import { createContext, useContext } from 'react';

export interface ReorgAppContext {
  isReorgApp: boolean;
}

export const reorgAppContext = createContext<ReorgAppContext | null>(null);

export const useReorgAppContext = () => useContext(reorgAppContext)!;

export default reorgAppContext.Provider;

import { createContext, useContext } from 'react';

// tm stands for telemetry, but has been named this way to avoid being blocked by ad blockers

export interface Operation {
  name: string;
  timeMs: number;
  path: string;
}

export interface TMContext {
  logOperation: (operation: Operation) => void;
  flushOperations: () => Operation[];
}

export const tmContext = createContext<TMContext | null>(null);

export const useTMContext = () => useContext(tmContext);

export default tmContext.Provider;

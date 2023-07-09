import { createContext, useContext } from 'react';

export interface TickerContextType {
  now: Date;
}

export const tickerContext = createContext<TickerContextType | null>(null);

export const useTickerContext = () => useContext(tickerContext)!;

export default tickerContext.Provider;

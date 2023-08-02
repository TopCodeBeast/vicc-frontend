import { createContext, useContext } from 'react';

export interface AnalyticsContext {
  identify: (id: string, traits?: { [trait: string]: any }) => void;
  track: (event: string, properties?: { [propery: string]: any }) => void;
}

export const analyticsContext = createContext<AnalyticsContext | null>(null);

export const useEventsContext = () => useContext(analyticsContext)!;

export default analyticsContext.Provider;

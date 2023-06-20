import { createContext, useContext } from 'react';

export interface TrackingContextType {
  subPath: string;
}

export const trackingContext = createContext<TrackingContextType | null>(null);

export const useEventContext = () => useContext(trackingContext)!;

export default trackingContext.Provider;

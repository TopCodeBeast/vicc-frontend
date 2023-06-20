import { User } from '@sentry/react';
import { createContext, useContext } from 'react';

export interface SentryContext {
  sendSafeError: (error: unknown) => void;
  identifyUser: (user: User | null) => void;
}

export const sentryContext = createContext<SentryContext | null>(null);

export const useSentryContext = () => useContext(sentryContext)!;

export default sentryContext.Provider;

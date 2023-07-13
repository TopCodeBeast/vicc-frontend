import { ReactNode, createContext, useContext, useState } from 'react';
import useLocalStorage from '@core/hooks/useLocalStorage';

export type SessionContextType = {
  sessionId: string | undefined;
  setSessionId: (session: string | undefined) => void;
  apiKey: string | null | undefined;
  setApiKey: (apiKey: string | null | undefined) => void;
};

export const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [apiKey, setApiKey] = useLocalStorage<string | undefined>('APIKEY', undefined);

  return (
    <SessionContext.Provider
      value={{ sessionId, setSessionId, apiKey, setApiKey }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => useContext(SessionContext)!;

export default SessionProvider;

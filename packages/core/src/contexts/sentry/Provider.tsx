import { User, setUser } from '@sentry/react';
import { useCallback, useMemo } from 'react';

import { sendSafeError } from '@sorare/core/src/lib/error';
import FallbackComponent from '@sorare/core/src/routing/FallbackComponent';

import SentryContextProvider from '.';
import { ACTUAL_ENV, REVISION } from '../../config';
import ErrorBoundary from './ErrorBoundary';
import { startSentry } from './sentry';

export const SentryProvider: React.FC<{ dsn: string }> = ({
  dsn,
  children,
}) => {
  useMemo(
    () =>
      startSentry({
        dsn,
        env: ACTUAL_ENV,
        release: REVISION.toString(),
      }),
    [dsn]
  );

  const identifyUser = useCallback((user: User | null) => {
    setUser(user);
  }, []);

  const sendSafeErrorCb = useCallback(sendSafeError, []);

  return (
    <SentryContextProvider
      value={{
        identifyUser,
        sendSafeError: sendSafeErrorCb,
      }}
    >
      <ErrorBoundary
        fallback={(error: Error) => <FallbackComponent error={error} />}
      >
        {children}
      </ErrorBoundary>
    </SentryContextProvider>
  );
};

export default SentryProvider;

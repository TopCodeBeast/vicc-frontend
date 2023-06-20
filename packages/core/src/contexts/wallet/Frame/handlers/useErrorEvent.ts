import { useContext, useEffect } from 'react';

import { ErrorTracking, MessagingContext } from '@sorare/wallet-shared';
import { useSentryContext } from '@sorare/core/src/contexts/sentry';

export function useErrorEvent() {
  const { registerHandler } = useContext(MessagingContext)!;
  const { sendSafeError } = useSentryContext();

  useEffect(
    () =>
      registerHandler<ErrorTracking>('errorTracking', async error => {
        sendSafeError(error);
        return {
          result: {
            // Use default message from the Init, we can then later send more specific message per error if we need
            message: {
              errorTitle: '',
              errorBody: '',
            },
          },
        };
      }),
    [registerHandler, sendSafeError]
  );
}

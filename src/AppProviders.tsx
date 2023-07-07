import { ReactNode, Suspense, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';

import { SO5_SENTRY_DSN } from '@sorare/core/src/config';
import ConfigProvider from '@sorare/core/src/contexts/config/Provider';
import CurrentUserProvider from '@sorare/core/src/contexts/currentUser/Provider';
import DebugProvider from '@sorare/core/src/contexts/debug/Provider';
import DeviceFingerprintProvider from '@sorare/core/src/contexts/deviceFingerprint/Provider';
import GrapqhqlProvider from '@sorare/core/src/contexts/graphql/Provider';
import HighlightProvider from '@sorare/core/src/contexts/highlight/Provider';
import { IntlProvider } from '@sorare/core/src/contexts/intl/Provider';
import SentryProvider from '@sorare/core/src/contexts/sentry/Provider';
import SeoProvider from '@sorare/core/src/contexts/seo/Provider';
import SessionProvider from '@sorare/core/src/contexts/session';
import SnackNotificationProvider from '@sorare/core/src/contexts/snackNotification/Provider';
import TMProvider from '@sorare/core/src/contexts/tm/Provider';

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <SentryProvider dsn={SO5_SENTRY_DSN}>
        <IntlProvider>
          <SessionProvider>
            <TMProvider>
              <DebugProvider>
                <SnackNotificationProvider>
                  <DeviceFingerprintProvider>
                    <GrapqhqlProvider>
                      <HighlightProvider>
                        <ConfigProvider>
                          <SeoProvider>
                            <CurrentUserProvider>
                              <Suspense fallback={null}>{children}</Suspense>
                            </CurrentUserProvider>
                          </SeoProvider>
                        </ConfigProvider>
                      </HighlightProvider>
                    </GrapqhqlProvider>
                  </DeviceFingerprintProvider>
                </SnackNotificationProvider>
              </DebugProvider>
            </TMProvider>
          </SessionProvider>
        </IntlProvider>
      </SentryProvider>
    </BrowserRouter>
  );
};

export default AppProviders;

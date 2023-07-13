import { ReactNode, Suspense, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';

import { SO5_SENTRY_DSN } from '@sorare/core/src/config';
import AuthProvider from '@sorare/core/src/contexts/auth/Provider';
import ConfigProvider from '@sorare/core/src/contexts/config/Provider';
import ConnectionProvider from '@sorare/core/src/contexts/connection/Provider';
import CurrentUserProvider from '@sorare/core/src/contexts/currentUser/Provider';
import DebugProvider from '@sorare/core/src/contexts/debug/Provider';
import DeviceFingerprintProvider from '@sorare/core/src/contexts/deviceFingerprint/Provider';
import FollowProvider from '@sorare/core/src/contexts/follow/Provider';
import GrapqhqlProvider from '@sorare/core/src/contexts/graphql/Provider';
import HighlightProvider from '@sorare/core/src/contexts/highlight/Provider';
import { IntlProvider } from '@sorare/core/src/contexts/intl/Provider';
import ManagerTaskProvider from '@sorare/core/src/contexts/managerTask/Provider';
import RestrictedAccessProvider from '@sorare/core/src/contexts/restrictedAccess/Provider';
import SentryProvider from '@sorare/core/src/contexts/sentry/Provider';
import SeoProvider from '@sorare/core/src/contexts/seo/Provider';
import SessionProvider from '@sorare/core/src/contexts/session';
import SnackNotificationProvider from '@sorare/core/src/contexts/snackNotification/Provider';
import SportProvider from '@sorare/core/src/contexts/sport/Provider';
import TickerProvider from '@sorare/core/src/contexts/ticker/Provider';
import TMProvider from '@sorare/core/src/contexts/tm/Provider';
import WalletFrame from '@sorare/core/src/contexts/wallet/Frame';
import WalletProvider from '@sorare/core/src/contexts/wallet/Provider';
import WalletDrawerProvider from '@sorare/core/src/contexts/walletDrawer/Provider';
import ThemeProvider from '@sorare/core/src/style/theme';

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <SentryProvider dsn={SO5_SENTRY_DSN}>
        <IntlProvider>
          <ThemeProvider>
            <SessionProvider>
              <TMProvider>
                <DebugProvider>
                  <SnackNotificationProvider>
                    <DeviceFingerprintProvider>
                      <GrapqhqlProvider>
                        <HighlightProvider>
                          <ManagerTaskProvider>
                            <ConfigProvider>
                              <SeoProvider>
                                <RestrictedAccessProvider>
                                  <CurrentUserProvider>
                                    <AuthProvider>
                                      <FollowProvider>
                                        <WalletDrawerProvider>
                                          <WalletProvider>
                                            <ConnectionProvider>
                                              <TickerProvider>
                                                <SportProvider>
                                                  <Suspense fallback={null}>
                                                    {children}
                                                  </Suspense>
                                                  <Suspense fallback={null}>
                                                    <WalletFrame />
                                                  </Suspense>
                                                </SportProvider>
                                              </TickerProvider>
                                            </ConnectionProvider>
                                          </WalletProvider>
                                        </WalletDrawerProvider>
                                      </FollowProvider>
                                    </AuthProvider>
                                  </CurrentUserProvider>
                                </RestrictedAccessProvider>
                              </SeoProvider>
                            </ConfigProvider>
                          </ManagerTaskProvider>
                        </HighlightProvider>
                      </GrapqhqlProvider>
                    </DeviceFingerprintProvider>
                  </SnackNotificationProvider>
                </DebugProvider>
              </TMProvider>
            </SessionProvider>
          </ThemeProvider>
        </IntlProvider>
      </SentryProvider>
    </BrowserRouter>
  );
};

export default AppProviders;

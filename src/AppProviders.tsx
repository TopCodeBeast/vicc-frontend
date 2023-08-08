import { ReactNode, Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import NetworkInfo from '@sorare/core/src/components/NetworkInfo';
import { PersistsQueryStringParameters } from '@sorare/core/src/components/PersistsQueryStringParameters';
import ResolveImpactClickId from '@sorare/core/src/components/ResolveImpactClickId';
import WalletSetup from '@sorare/core/src/components/WalletSetup';
import RestrictedAccessModals from '@sorare/core/src/components/restrictedAccess/RestrictedAccessModals';
import CookieConsentBanner from '@sorare/core/src/components/user/CookieConsentBanner';
import { SO5_SENTRY_DSN } from '@sorare/core/src/config';
import AccountSecurityCheckProvider from '@sorare/core/src/contexts/accountSecurityCheck/Provider';
import AuthProvider from '@sorare/core/src/contexts/auth/Provider';
import ConfigProvider from '@sorare/core/src/contexts/config/Provider';
import ConnectionProvider from '@sorare/core/src/contexts/connection/Provider';
import CurrentUserProvider from '@sorare/core/src/contexts/currentUser/Provider';
import DebugProvider from '@sorare/core/src/contexts/debug/Provider';
import DeviceFingerprintProvider from '@sorare/core/src/contexts/deviceFingerprint/Provider';
import EventsProvider from '@sorare/core/src/contexts/events/Provider';
import FollowProvider from '@sorare/core/src/contexts/follow/Provider';
import GrapqhqlProvider from '@sorare/core/src/contexts/graphql/Provider';
import HighlightProvider from '@sorare/core/src/contexts/highlight/Provider';
import InGameNotificationProvider from '@sorare/core/src/contexts/inGameNotification/Provider';
import { IntlProvider } from '@sorare/core/src/contexts/intl/Provider';
import ManagerTaskProvider from '@sorare/core/src/contexts/managerTask/Provider';
import OneTimeDialogProvider from '@sorare/core/src/contexts/oneTimeDialog/Provider';
import ReorgAppProvider from '@sorare/core/src/contexts/reorgApp/Provider';
import ResetPrivateKeyProvider from '@sorare/core/src/contexts/resetPrivateKey/Provider';
import RestrictedAccessProvider from '@sorare/core/src/contexts/restrictedAccess/Provider';
import SentryProvider from '@sorare/core/src/contexts/sentry/Provider';
import SeoProvider from '@sorare/core/src/contexts/seo/Provider';
import SessionProvider from '@sorare/core/src/contexts/session';
import SnackNotificationProvider from '@sorare/core/src/contexts/snackNotification/Provider';
import SportProvider from '@sorare/core/src/contexts/sport/Provider';
import SvgProvider from '@sorare/core/src/contexts/svg/Provider';
import TickerProvider from '@sorare/core/src/contexts/ticker/Provider';
import TMProvider from '@sorare/core/src/contexts/tm/Provider';
import WalletFrame from '@sorare/core/src/contexts/wallet/Frame';
import WalletProvider from '@sorare/core/src/contexts/wallet/Provider';
import WalletDrawerProvider from '@sorare/core/src/contexts/walletDrawer/Provider';
import useSyncAuthStateAcrossTabs from '@sorare/core/src/hooks/auth/useSyncAuthStateAcrossTabs';
import useVh from '@sorare/core/src/hooks/useVh';
import { getPageName } from '@sorare/core/src/lib/events';
import { logVersion } from '@sorare/core/src/lib/logVersion';
import { EnsureLatestAppVersion } from '@sorare/core/src/routing/EnsureLatestAppVersion';
import HandledErrorBoundary from '@sorare/core/src/routing/HandledErrorBoundary';
import ThemeProvider from '@sorare/core/src/style/theme';

import SingleSaleOfferProvider from '@sorare/marketplace/src/contexts/singleSaleOffer/Provider';

const LocationTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.analytics) {
      window.analytics.page(getPageName(location.pathname));
    }
  }, [location.pathname]);

  return null;
};
const AppProviders = ({
  children,
  isReorgApp,
}: {
  children: ReactNode;
  isReorgApp?: boolean;
}) => {
  useVh();
  useSyncAuthStateAcrossTabs();
  useEffect(() => {
    logVersion();
  }, []);

  return (
    <>
      <LocationTracker />
      <PersistsQueryStringParameters />
      <SentryProvider dsn={SO5_SENTRY_DSN}>
        <HandledErrorBoundary>
          <ReorgAppProvider isReorgApp={!!isReorgApp}>
            <IntlProvider>
              <ThemeProvider>
                <SessionProvider>
                  <TMProvider>
                    <DebugProvider>
                      <EventsProvider>
                        <ResetPrivateKeyProvider>
                          {/* <CookieConsentBanner /> */}
                          <SnackNotificationProvider>
                            <DeviceFingerprintProvider>
                              <GrapqhqlProvider>
                                <HighlightProvider>
                                  <ManagerTaskProvider>
                                    <ConfigProvider>
                                      <EnsureLatestAppVersion />
                                      <SeoProvider>
                                        <RestrictedAccessProvider>
                                          <CurrentUserProvider>
                                            <ResolveImpactClickId />
                                            <RestrictedAccessModals />
                                            <AuthProvider>
                                              <FollowProvider>
                                                <WalletDrawerProvider>
                                                  <WalletProvider>
                                                    <ConnectionProvider>
                                                      <AccountSecurityCheckProvider>
                                                        <WalletSetup />
                                                        <SingleSaleOfferProvider>
                                                          <TickerProvider>
                                                            <InGameNotificationProvider>
                                                              <SvgProvider>
                                                                <SportProvider>
                                                                  <NetworkInfo />
                                                                  <OneTimeDialogProvider>
                                                                    <Suspense
                                                                      fallback={
                                                                        null
                                                                      }
                                                                    >
                                                                      {children}
                                                                    </Suspense>
                                                                    <Suspense
                                                                      fallback={
                                                                        null
                                                                      }
                                                                    >
                                                                      <WalletFrame />
                                                                    </Suspense>
                                                                  </OneTimeDialogProvider>
                                                                </SportProvider>
                                                              </SvgProvider>
                                                            </InGameNotificationProvider>
                                                          </TickerProvider>
                                                        </SingleSaleOfferProvider>
                                                      </AccountSecurityCheckProvider>
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
                        </ResetPrivateKeyProvider>
                      </EventsProvider>
                    </DebugProvider>
                  </TMProvider>
                </SessionProvider>
              </ThemeProvider>
            </IntlProvider>
          </ReorgAppProvider>
        </HandledErrorBoundary>
      </SentryProvider>
    </>
  );
};

export default AppProviders;

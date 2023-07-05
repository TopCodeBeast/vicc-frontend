import { ReactNode, Suspense, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';

import { SO5_SENTRY_DSN } from '@sorare/core/src/config';
import ConfigProvider from '@sorare/core/src/contexts/config/Provider';
import { IntlProvider } from '@sorare/core/src/contexts/intl/Provider';
import SentryProvider from '@sorare/core/src/contexts/sentry/Provider';
import SeoProvider from '@sorare/core/src/contexts/seo/Provider';

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <SentryProvider dsn={SO5_SENTRY_DSN}>
        <IntlProvider>
          <ConfigProvider>
            <SeoProvider>
              <Suspense fallback={null}>{children}</Suspense>
            </SeoProvider>
          </ConfigProvider>
        </IntlProvider>
      </SentryProvider>
    </BrowserRouter>
  );
};

export default AppProviders;

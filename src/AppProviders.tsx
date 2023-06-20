import { ReactNode, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import HighlightProvider from '@sorare/core/src/contexts/highlight/Provider';
import { IntlProvider } from '@sorare/core/src/contexts/intl/Provider';
import ThemeProvider from '@sorare/core/src/style/theme';

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <IntlProvider>
        <ThemeProvider>
          <HighlightProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </HighlightProvider>
        </ThemeProvider>
      </IntlProvider>
    </BrowserRouter>
  );
};

export default AppProviders;

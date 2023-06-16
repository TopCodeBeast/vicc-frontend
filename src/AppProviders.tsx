import { ReactNode, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { IntlProvider } from '@sorare/core/src/contexts/intl/Provider';
import ThemeProvider from '@sorare/core/src/style/theme';

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <IntlProvider>
        <ThemeProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </ThemeProvider>
      </IntlProvider>
    </BrowserRouter>
  );
};

export default AppProviders;

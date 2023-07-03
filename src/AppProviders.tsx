import { ReactNode, Suspense, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';

import { IntlProvider } from '@sorare/core/src/contexts/intl/Provider';

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <IntlProvider>
        <Suspense fallback={null}>{children}</Suspense>
      </IntlProvider>
    </BrowserRouter>
  );
};

export default AppProviders;

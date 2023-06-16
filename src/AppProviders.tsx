import { ReactNode, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ThemeProvider from '@sorare/core/src/style/theme';

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Suspense fallback={null}>{children}</Suspense>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default AppProviders;

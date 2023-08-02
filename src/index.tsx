import '@sorare/core/src/polyfills';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { withProfiler } from '@sorare/core/src/contexts/sentry/sentry';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { withFFProvider } from '@sorare/core/src/lib/featureFlags';
import './remove-child-workaround';

import '@sorare/core/src/style/style.css';
import AppRouter from 'AppRouter';

const Root = () => {
  const {
    flags: { useReorgApp = false },
  } = useFeatureFlags();

  return (
    <BrowserRouter>
      <AppRouter isReorgApp={useReorgApp} />
    </BrowserRouter>
  );
};

const RootWithLDProvider = withProfiler(withFFProvider(Root));

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<RootWithLDProvider />);

// unregister any service worker left-over (see https://gitlab.com/sorare/frontend/-/merge_requests/3852)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
    });
  });
}

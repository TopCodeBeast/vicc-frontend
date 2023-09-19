import '@sorare/core/src/polyfills';

import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { withProfiler } from '@sorare/core/src/contexts/sentry/sentry';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import './remove-child-workaround';

import '@sorare/core/src/style/style.css';
import AppRouter from './AppRouter';

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

const RootWithLDProvider = withProfiler(Root);

ReactDOM.render(<RootWithLDProvider />, document.getElementById('root'));

// unregister any service worker left-over (see https://gitlab.com/sorare/frontend/-/merge_requests/3852)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
    });
  });
}

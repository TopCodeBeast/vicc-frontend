import 'regenerator-runtime';

import '@sorare/core/src/polyfills';

// If React is not in the dom before ReactDOM it can lead to errors like
// ReadDOM.render is not a function.
// eslint-disable-next-line sorare/no-unrendered-component-imports
import ReactDOM from 'react-dom';


import './remove-child-workaround';

import '@sorare/core/src/style/style.css';
import AppRoot from './AppProviders';
import Router from './Router';

const Root = () => (
  <AppRoot>
    <Router />
  </AppRoot>
);

ReactDOM.render(<Root />, document.getElementById('root'));

// unregister any service worker left-over (see https://gitlab.com/sorare/frontend/-/merge_requests/3852)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
    });
  });
}

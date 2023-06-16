import { Suspense } from 'react';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';

import Router from './routing/Router';

export const Root = () => {
  return (
    <Suspense fallback={<LoadingIndicator fullScreen />}>
      <Router />
    </Suspense>
  );
};

export default Root;

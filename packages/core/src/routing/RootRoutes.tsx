// This is a hacky solution to be able to used absolute
// url on nested Routes while waiting for a fix here
// https://github.com/remix-run/react-router/issues/8035

import { useContext, useMemo } from 'react';
import {
  UNSAFE_RouteContext as RouteContext,
  Routes,
  RoutesProps,
} from 'react-router-dom';

export const RootRoutes = (props: RoutesProps) => {
  const ctx = useContext(RouteContext);

  const value = useMemo(
    () => ({
      ...ctx,
      matches: [],
    }),
    [ctx]
  );

  return (
    <RouteContext.Provider value={value}>
      <Routes {...props} />
    </RouteContext.Provider>
  );
};

import { ReactElement, createContext, useContext } from 'react';
import {
  Route,
  RouteObject,
  Routes,
  createRoutesFromChildren,
  resolvePath,
} from 'react-router-dom';

import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';

// dialogRoutes are made for 2 things:
// - Dialogs that should be available from anywhere in the app from a specific URL
// - Dialogs that should transform to a standalone page version if coming from a public url
//
// Thanks to the routes passed to a context provider, the wrapped Link component detect automatically
// What is a dialog route and what is not, opening the component in the right context (either a dialog or a standalone page)

export const RoutingContext = createContext<{
  dialogRoutes: RouteObject[];
}>({
  dialogRoutes: [],
});

type Props = React.ComponentProps<typeof Routes> & {
  basePath: string;
  dialogRoutes?: ({ isDialog }: { isDialog: boolean }) => ReactElement;
};

export const RoutesWithDialogs = ({
  basePath,
  dialogRoutes,
  children,
  ...props
}: Props) => {
  const { dialogRoutes: dialogRoutesProps } = useContext(RoutingContext);
  const bgLocation = useBgLocation();

  return (
    <RoutingContext.Provider
      value={{
        dialogRoutes: [
          ...(dialogRoutesProps || []),
          ...createRoutesFromChildren(dialogRoutes?.({ isDialog: true })).map(
            ({ path, ...otherRouteProps }) => ({
              ...otherRouteProps,
              path: path ? resolvePath(path, basePath).pathname : undefined,
            })
          ),
        ],
      }}
    >
      <Routes {...props} location={bgLocation}>
        {dialogRoutes?.({ isDialog: false })}
        {children}
      </Routes>
      {bgLocation && (
        <Routes {...props}>
          {dialogRoutes?.({ isDialog: true })}
          {/**
           * This is to avoid triggering a warning happening because `dialogRoutes` doesn't cover all routes
           * especially when you are nesting this component, so you end up with a `Routes` here with only a
           * specific number of `Route` that we want to render.
           *
           * Imagine the senario where location is "/dialog" and bgLocation is "/football"
           *
           * <RoutesWithDialog dialogRoutes={<Route path="/special-route-dialog" />}
           *   <RoutesWithDialog dialogRoutes={<Route path="/dialog" />}>
           *     <Route path="/football" />
           *   </RoutesWithDialog>
           * </RoutesWithDialog>
           *
           * Then the first RoutesWithDialog won't have the route "/dialog" which will trigger error event though
           * it is expected, we don't want to render anything, hence the null.
           */}
          <Route path="*" element={null} />
        </Routes>
      )}
    </RoutingContext.Provider>
  );
};

import { forwardRef, useContext } from 'react';
import {
  Link as RRDLink,
  LinkProps as RRDLinkProps,
  matchRoutes,
  useResolvedPath,
} from 'react-router-dom';

import { useBgLocation } from '@core/hooks/useBgLocation';
import { RoutingContext } from '@core/routing/Router';

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  function ForwardedLink({ replace, to, ...rest }, ref) {
    const location = useBgLocation(true);
    const bgLocation = useBgLocation();
    const resolvedPath = useResolvedPath(to);
    const { dialogRoutes } = useContext(RoutingContext);
    const isdialogRoute = matchRoutes(dialogRoutes, resolvedPath);
    const state = {
      ...rest.state,
      backgroundState: isdialogRoute ? location : undefined,
    };

    return (
      <RRDLink
        ref={ref}
        {...rest}
        // WARNING to=".." behaves differently than to={{pathname: '..'}}
        to={to}
        state={state}
        replace={replace ?? !!bgLocation}
      />
    );
  }
);

export type LinkProps = RRDLinkProps;

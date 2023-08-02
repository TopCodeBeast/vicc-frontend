import { ReactNode, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import SidebarLayout, { Link } from '@core/routing/SidebarLayout';

export type LinkDeclaration = Omit<Link, 'id' | 'activeLink' | 'nested'>;

/**
 * A set of link entries where identifiers would uniquely identify a route accessible through a link.
 */
export type LinkSet<ROUTE_ID extends string = string> = {
  [key in ROUTE_ID]: LinkDeclaration;
};
export interface Props<LINK_ID extends string> {
  linkIds: LINK_ID[];
  links: LinkSet<LINK_ID>;
  children: ReactNode;
}

const linkFactory = <ROUTE_ID extends string>(
  id: ROUTE_ID,
  declaration: LinkDeclaration
): Link<ROUTE_ID> => {
  const { label, icon, to } = declaration;
  return {
    ...declaration,
    id,
    label,
    icon,
    to,
  };
};

export const RoutedSidebarMenu = <LINK_ID extends string>({
  linkIds,
  links,
  children,
}: Props<LINK_ID>) => {
  const location = useLocation();

  const sideLinks = useMemo<Link<LINK_ID>[]>(
    () => linkIds.map(id => linkFactory(id, links[id])),
    [linkIds, links]
  );
  const activeLink = useMemo(
    () => sideLinks.find(l => location.pathname === l.to!) || sideLinks[0],
    [location.pathname, sideLinks]
  );

  return (
    <SidebarLayout activeLink={activeLink!.id} links={sideLinks}>
      {children}
    </SidebarLayout>
  );
};

export default RoutedSidebarMenu;

import classNames from 'classnames';
import { ReactNode, Suspense, useEffect, useMemo } from 'react';
import {
  Route,
  Routes,
  generatePath,
  matchPath,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import styled from 'styled-components';

import { Container } from '@core/atoms/container';
import Body from '@core/atoms/layout/Body';
import TabContainer from '@core/atoms/layout/TabContainer';
import LoadingIndicator from '@core/atoms/loader/LoadingIndicator';
import { ScrollableTabBar, Tab } from '@core/components/TabBar';
import { useBgLocation } from '@core/hooks/useBgLocation';
import { relative } from '@core/lib/routing';

import useHandleBackwardCompatibility from './useHandleBackwardCompatibility';

type Item = {
  path: string;
  label: string;
  isIndex?: boolean;
  tabContent: ReactNode;
  search?: string;
};
type Props = {
  children: ReactNode;
  pageSlug?: string;
  pagePath: string;
  items: Item[];
  centered?: boolean;
};

const ResponsiveTabs = styled.div`
  background-color: var(--c-neutral-100);
  border-bottom: 1px solid var(--c-neutral-300);
  padding: var(--unit) 0;
`;

const StyledTabBar = styled(ScrollableTabBar)`
  &.centered {
    margin: 0 auto;
  }
`;

const PageWithTabs = ({
  children,
  pageSlug,
  items,
  pagePath,
  centered = true,
}: Props) => {
  const bgLocation = useBgLocation();
  const { loading } = useHandleBackwardCompatibility({
    deprecatedTabSlugs: items.map(i => relative(pagePath, i.path)),
    pageSlug,
    pagePath,
  });

  const secondaryTabsItems = useMemo(() => {
    const params = pageSlug ? { slug: pageSlug } : {};
    return items.map(({ path, search, ...rest }) => ({
      ...rest,
      to: `${generatePath(path, params)}${search ? `?${search}` : ''}`,
    }));
  }, [items, pageSlug]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const index = items.find(item => item.isIndex);
    if (
      !loading &&
      index &&
      index.path !== '' &&
      matchPath(pagePath, location.pathname)
    ) {
      navigate(relative(pagePath, index.path), { replace: true });
    }
  }, [navigate, location, items, pagePath, loading]);

  const hasTabs = items.length > 1;

  return (
    <Body>
      {children}
      {hasTabs && (
        <ResponsiveTabs>
          <StyledTabBar className={classNames({ centered })}>
            {secondaryTabsItems.map(it => (
              <Tab key={it.to} to={it.to}>
                {it.label}
              </Tab>
            ))}
          </StyledTabBar>
        </ResponsiveTabs>
      )}
      <Container>
        <TabContainer>
          <Routes location={bgLocation}>
            {items.map(({ path, tabContent }) => (
              <Route
                key={path}
                path={relative(pagePath, path)}
                element={
                  <Suspense fallback={<LoadingIndicator fullHeight />}>
                    {tabContent}
                  </Suspense>
                }
              />
            ))}
          </Routes>
        </TabContainer>
      </Container>
    </Body>
  );
};

export default PageWithTabs;

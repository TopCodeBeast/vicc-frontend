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

import { Container } from '@sorare/core/src/atoms/container';
import Body from '@sorare/core/src/atoms/layout/Body';
import TabContainer from '@sorare/core/src/atoms/layout/TabContainer';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { SecondaryTabs } from '@sorare/core/src/atoms/navigation/SecondaryTabs';
import { useBgLocation } from '@sorare/core/src/hooks/useBgLocation';
import { relative } from '@sorare/core/src/lib/routing';
import { theme } from '@sorare/core/src/style/theme';

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
`;
const StyledContainer = styled.div`
  justify-content: flex-start;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    justify-content: center;
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
          <Container>
            <StyledContainer>
              <SecondaryTabs
                noBorder
                centered={centered}
                items={secondaryTabsItems}
              />
            </StyledContainer>
          </Container>
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

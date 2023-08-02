import { ReactNode, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import { AppLayoutRouteComponent } from '@sorare/core/src/components/navigation/AppLayout';
import useIsReorgApp from '@sorare/core/src/hooks/ui/useIsReorgApp';
import { useIsMobileWebView } from '@sorare/core/src/hooks/useIsMobileWebView';
import MultiSportAppBar from '@sorare/core/src/routing/MultiSportAppBar';
import MultiSportFooter from '@sorare/core/src/routing/MultiSportFooter';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--c-neutral-100);
  color: var(--c-neutral-1000);
`;

const Footer = styled(MultiSportFooter)`
  position: sticky;
  top: 100%;
`;

type Props = { children?: ReactNode };
export const AppLayout = ({ children }: Props) => {
  const isMobileWebview = useIsMobileWebView();
  const isReorgApp = useIsReorgApp();

  if (isReorgApp) {
    return <AppLayoutRouteComponent />;
  }

  if (isMobileWebview) {
    return <Suspense fallback={<div />}>{children || <Outlet />}</Suspense>;
  }
  return (
    <Wrapper>
      <MultiSportAppBar />
      <main>
        <Suspense fallback={<div />}>{children || <Outlet />}</Suspense>
      </main>
      <Footer />
    </Wrapper>
  );
};

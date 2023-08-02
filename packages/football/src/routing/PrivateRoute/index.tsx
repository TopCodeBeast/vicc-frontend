import { FC, ReactElement } from 'react';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import { AppLayout } from '@sorare/core/src/components/navigation/AppLayout';
import VerifyPhoneNumber from '@sorare/core/src/components/user/VerifyPhoneNumber';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useRedirectToLogIn from '@sorare/core/src/hooks/auth/useRedirectToLogIn';
import useIsReorgApp from '@sorare/core/src/hooks/ui/useIsReorgApp';

import Layout from '@football/routing/Layout';

interface Props {
  element: ReactElement;
  withLayout?: boolean;
  requireVerifiedPhoneNumber?: boolean;
}

const WithLayout: FC<React.PropsWithChildren<{ withLayout?: boolean }>> = ({
  withLayout,
  children,
}) => {
  const isReorgApp = useIsReorgApp();
  const LayoutComponent = isReorgApp ? AppLayout : Layout;
  return withLayout ? (
    <LayoutComponent>{children}</LayoutComponent>
  ) : (
    <>{children}</>
  );
};

export const PrivateRoute = ({
  element: Component,
  withLayout,
  requireVerifiedPhoneNumber,
}: Props) => {
  const { currentUser } = useCurrentUserContext();
  const redirectToLogIn = useRedirectToLogIn();

  if (!Component) {
    throw new Error('Missing component to render');
  }
  if (!currentUser) {
    return redirectToLogIn();
  }
  return (
    <WithLayout withLayout={withLayout}>
      <>
        {requireVerifiedPhoneNumber && <VerifyPhoneNumber />}
        {Component}
      </>
    </WithLayout>
  );
};

export default PrivateRoute;

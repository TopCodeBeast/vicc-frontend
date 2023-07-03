import { FC, ReactElement } from 'react';

// import VerifyPhoneNumber from '@sorare/core/src/components/user/VerifyPhoneNumber';
// import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
// import useRedirectToLogIn from '@sorare/core/src/hooks/auth/useRedirectToLogIn';

import Layout from '@football/routing/Layout';

interface Props {
  element: ReactElement;
  withLayout?: boolean;
  requireVerifiedPhoneNumber?: boolean;
}

const WithLayout: FC<{ withLayout?: boolean }> = ({ withLayout, children }) =>
  withLayout ? <Layout>{children}</Layout> : <>{children}</>;

export const PrivateRoute = ({
  element: Component,
  withLayout,
  requireVerifiedPhoneNumber,
}: Props) => {
  // const { currentUser } = useCurrentUserContext();
  // const redirectToLogIn = useRedirectToLogIn();

  if (!Component) {
    throw new Error('Missing component to render');
  }
  // if (!currentUser) {
  //   return redirectToLogIn();
  // }
  return (
    <WithLayout withLayout={withLayout}>
      <>
        {/* {requireVerifiedPhoneNumber && <VerifyPhoneNumber />} */}
        {Component}
      </>
    </WithLayout>
  );
};

export default PrivateRoute;

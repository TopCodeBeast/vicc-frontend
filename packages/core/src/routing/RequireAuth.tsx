import { ReactElement } from 'react';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useRedirectToLogIn from '@sorare/core/src/hooks/auth/useRedirectToLogIn';

const RequireAuth: React.FC<{ children: ReactElement; to?: string }> = ({
  children,
  to,
}) => {
  const { currentUser } = useCurrentUserContext();
  const redirectToLogIn = useRedirectToLogIn(to);

  if (!currentUser) {
    return redirectToLogIn();
  }

  return children;
};

export default RequireAuth;

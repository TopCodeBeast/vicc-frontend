import { ReactElement } from 'react';

import { useCurrentUserContext } from '@core/contexts/currentUser';
import useRedirectToLogIn from '@core/hooks/auth/useRedirectToLogIn';

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

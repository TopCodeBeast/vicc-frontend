import { Navigate } from 'react-router-dom';

import { LANDING } from '@sorare/core/src/constants/routes';
import useAfterLoggedInTarget from '@sorare/core/src/hooks/useAfterLoggedInTarget';
import useTruncatedLocation from '@sorare/core/src/hooks/useTruncatedLocation';

export default (to?: string) => {
  const location = useTruncatedLocation();
  const afterLoggedInTarget = useAfterLoggedInTarget() || location;

  return function RedirectToLanding() {
    return (
      <Navigate
        replace
        to={{
          pathname: to || LANDING,
          search: 'action=signin',
        }}
        state={{
          afterLoggedInTarget,
        }}
      />
    );
  };
};

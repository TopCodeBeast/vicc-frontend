import { Navigate } from 'react-router-dom';

import { LANDING } from '@core/constants/routes';
import useAfterLoggedInTarget from '@core/hooks/useAfterLoggedInTarget';
import useTruncatedLocation from '@core/hooks/useTruncatedLocation';

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

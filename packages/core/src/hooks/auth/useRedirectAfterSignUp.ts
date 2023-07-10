import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { MLB_HOME, MLB_SEATTLE_2023 } from '@core/constants/routes';

export default () => {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    if (location.pathname === MLB_SEATTLE_2023) {
      navigate(MLB_HOME, {
        state: { afterLoggedInTarget: null },
        replace: true,
      });
    }
  }, [location.pathname, navigate]);
};

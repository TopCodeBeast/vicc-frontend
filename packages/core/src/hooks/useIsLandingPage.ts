import { useLocation } from 'react-router-dom';

import { isLanding } from '@core/constants/routes';

export default () => {
  const location = useLocation();

  return isLanding(location.pathname);
};

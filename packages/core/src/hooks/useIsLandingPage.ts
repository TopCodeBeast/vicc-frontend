import { useLocation } from 'react-router-dom';

import { isLanding } from '@sorare/core/src/constants/routes';

export default () => {
  const location = useLocation();

  return isLanding(location.pathname);
};

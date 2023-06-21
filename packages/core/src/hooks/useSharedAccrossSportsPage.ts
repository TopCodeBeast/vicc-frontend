import { useLocation } from 'react-router-dom';

import { sharedAcrossSportsPage } from '@core/constants/routes';

export default () => {
  const location = useLocation();

  return sharedAcrossSportsPage(location.pathname);
};

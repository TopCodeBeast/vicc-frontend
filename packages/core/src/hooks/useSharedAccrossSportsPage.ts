import { useLocation } from 'react-router-dom';

import { sharedAcrossSportsPage } from '@sorare/core/src/constants/routes';

export default () => {
  const location = useLocation();

  return sharedAcrossSportsPage(location.pathname);
};

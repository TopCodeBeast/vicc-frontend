import { isMlbPage } from '@sorare/core/src/constants/routes';

import { useBgLocation } from './useBgLocation';

export default () => {
  const location = useBgLocation(true);

  return isMlbPage(location.pathname);
};

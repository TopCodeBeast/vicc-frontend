import { isNBAPage } from '@core/constants/routes';

import { useBgLocation } from './useBgLocation';

export default () => {
  const location = useBgLocation(true);

  return isNBAPage(location.pathname);
};

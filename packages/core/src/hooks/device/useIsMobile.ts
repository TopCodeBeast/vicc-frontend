import { useMedia } from 'react-use';

import { breakpoints } from '@core/style/mediaQuery';

export const useIsMobile = () =>
  useMedia(`(max-width: ${breakpoints.mobile}px)`);

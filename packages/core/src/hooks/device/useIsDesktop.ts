import { useMedia } from 'react-use';

import { theme } from '@core/style/theme';

export const useIsDesktop = () =>
  useMedia(`(min-width: ${theme.breakpoints.values.tablet}px)`);

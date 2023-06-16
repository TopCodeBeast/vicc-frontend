import { useMedia } from 'react-use';

import { theme } from '../../style/theme';

export const useIsDesktop = () =>
  useMedia(`(min-width: ${theme.breakpoints.values.tablet}px)`);

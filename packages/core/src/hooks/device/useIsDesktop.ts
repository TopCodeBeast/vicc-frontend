import { useMedia } from 'react-use';

import { tabletAndAbove } from '@core/style/mediaQuery';

export const useIsDesktop = () => useMedia(tabletAndAbove);

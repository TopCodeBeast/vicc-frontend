import { useMedia } from 'react-use';

import { Breakpoint, breakpoints } from '@core/style/mediaQuery';

function useScreenSize(size: number | Breakpoint) {
  let mediaQuery;
  if (typeof size === 'number') {
    mediaQuery = `(min-width: ${size}px)`;
  } else {
    mediaQuery = `(min-width: ${breakpoints[size]}px)`;
  }
  const up = useMedia(mediaQuery);

  return { up };
}

export default useScreenSize;

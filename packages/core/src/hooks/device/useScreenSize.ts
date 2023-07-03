import { useMediaQuery, useTheme } from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

function useScreenSize(size: number | Breakpoint = 'sm') {
  const theme = useTheme();
  const up = useMediaQuery(theme.breakpoints.up(size), {
    noSsr: true,
  });

  return { up };
}

export default useScreenSize;

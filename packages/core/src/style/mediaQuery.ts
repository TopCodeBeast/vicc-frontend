export const breakpoints = {
  mobile: 360,
  tablet: 720,
  laptop: 960,
  desktop: 1200,
  largeDesktop: 1800,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const mobileAndAbove = `(min-width: ${breakpoints.mobile}px)` as const;
export const tabletAndAbove = `(min-width: ${breakpoints.tablet}px)` as const;
export const laptopAndAbove = `(min-width: ${breakpoints.laptop}px)` as const;
export const desktopAndAbove = `(min-width: ${breakpoints.desktop}px)` as const;
export const largeDesktopAndAbove =
  `(min-width: ${breakpoints.largeDesktop}px)` as const;

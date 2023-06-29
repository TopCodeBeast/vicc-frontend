const breakpoints = {
  mobile: 360,
  tablet: 720,
  laptop: 960,
  desktop: 1200,
} as const;

export const mobileAndAbove = `(min-width: ${breakpoints.mobile}px)` as const;
export const tabletAndAbove = `(min-width: ${breakpoints.tablet}px)` as const;
export const laptopAndAbove = `(min-width: ${breakpoints.laptop}px)` as const;
export const desktopAndAbove = `(min-width: ${breakpoints.desktop}px)` as const;

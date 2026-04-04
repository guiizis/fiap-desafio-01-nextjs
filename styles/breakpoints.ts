export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export const APP_SCREENS = {
  mobile: { raw: `(max-width: ${BREAKPOINTS.md - 1}px)` },
  tablet: {
    raw: `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  },
  desktop: { raw: `(min-width: ${BREAKPOINTS.lg}px)` },
} as const;

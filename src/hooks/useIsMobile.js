import { useMediaQuery } from "react-responsive";

const MOBILE_BREAKPOINT = 768;

/**
 * Hook to detect if viewport is mobile-sized.
 * Uses react-responsive for reliable media query detection.
 *
 * @param {number} breakpoint - Width threshold in pixels (default: 768)
 * @returns {boolean} - True if viewport width < breakpoint
 */
export default function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  return useMediaQuery({ maxWidth: breakpoint - 1 });
}

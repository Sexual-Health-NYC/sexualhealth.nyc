import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Hook to detect if viewport is mobile-sized.
 * Handles resize events and cleans up listener.
 *
 * @param {number} breakpoint - Width threshold in pixels (default: 768)
 * @returns {boolean} - True if viewport width < breakpoint
 */
export default function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < breakpoint,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

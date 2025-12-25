import { useEffect, useCallback } from "react";

/**
 * Hook to handle Escape key press.
 * Stops propagation to prevent multiple handlers firing.
 *
 * @param {Function} onEscape - Callback when Escape is pressed
 * @param {boolean} isActive - Whether the handler is active (default: true)
 */
export default function useEscapeKey(onEscape, isActive = true) {
  const handleEscape = useCallback(
    (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onEscape();
      }
    },
    [onEscape],
  );

  useEffect(() => {
    if (!isActive) return;

    window.addEventListener("keydown", handleEscape, true);
    return () => window.removeEventListener("keydown", handleEscape, true);
  }, [handleEscape, isActive]);
}

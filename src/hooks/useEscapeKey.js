import { useEventListener } from "usehooks-ts";
import { useCallback } from "react";

/**
 * Hook to handle Escape key press.
 * Wrapper around usehooks-ts useEventListener.
 *
 * @param {Function} onEscape - Callback when Escape is pressed
 * @param {boolean} isActive - Whether the handler is active (default: true)
 */
export default function useEscapeKey(onEscape, isActive = true) {
  const handleKeyDown = useCallback(
    (e) => {
      if (isActive && e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onEscape();
      }
    },
    [onEscape, isActive],
  );

  useEventListener("keydown", handleKeyDown);
}

import { useEffect } from "react";

/**
 * Hook to detect clicks outside a referenced element.
 *
 * @param {React.RefObject} ref - Ref to the element to monitor
 * @param {Function} handler - Callback when click outside occurs
 * @param {boolean} isActive - Whether the handler is active (default: true)
 */
export default function useClickOutside(ref, handler, isActive = true) {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler(event);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, handler, isActive]);
}

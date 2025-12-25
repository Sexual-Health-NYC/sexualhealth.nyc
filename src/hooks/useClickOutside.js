import { useOnClickOutside } from "usehooks-ts";

/**
 * Hook to detect clicks outside a referenced element.
 * Wrapper around usehooks-ts for API compatibility.
 *
 * @param {React.RefObject} ref - Ref to the element to monitor
 * @param {Function} handler - Callback when click outside occurs
 * @param {boolean} isActive - Whether the handler is active (default: true)
 */
export default function useClickOutside(ref, handler, isActive = true) {
  useOnClickOutside(ref, isActive ? handler : () => {});
}

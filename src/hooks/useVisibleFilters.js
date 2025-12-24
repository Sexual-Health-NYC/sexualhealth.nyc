import { useMemo } from "react";
import { FILTER_CONFIG } from "../config/filterConfig";
import useAppStore from "../store/useAppStore";

/**
 * Hook that returns filters that should be visible based on current filter state.
 * Handles conditional filters (e.g., gender affirming only shows when gender_affirming service selected)
 */
export default function useVisibleFilters() {
  const { filters } = useAppStore();

  return useMemo(() => {
    return FILTER_CONFIG.filter((config) => {
      // Always show if no parent filter
      if (!config.parentFilter) return true;

      // Show if parent filter has the required value
      const parentFilterValue = filters[config.parentFilter];

      // Handle both Set and direct value comparisons
      if (parentFilterValue instanceof Set) {
        return parentFilterValue.has(config.parentValue);
      }

      return parentFilterValue === config.parentValue;
    }).sort((a, b) => a.order - b.order);
  }, [filters]);
}

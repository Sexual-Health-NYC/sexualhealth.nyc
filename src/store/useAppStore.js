import { create } from "zustand";

// Filter hierarchy: when a parent filter is cleared, clear all children
// Format: { parentFilter: { parentValue: [childFilter1, childFilter2, ...] } }
const filterHierarchy = {
  services: {
    gender_affirming: ["genderAffirming"],
    abortion: ["gestationalWeeks"],
  },
};

// Get child filters that should be cleared when a parent value is removed
function getChildFiltersToReset(filterKey, oldValues, newValues) {
  const hierarchy = filterHierarchy[filterKey];
  if (!hierarchy) return {};

  const resets = {};
  const removedValues = [...oldValues].filter((v) => !newValues.has(v));

  for (const removedValue of removedValues) {
    const childFilters = hierarchy[removedValue];
    if (childFilters) {
      for (const childFilter of childFilters) {
        // gestationalWeeks is a special case (not a Set)
        if (childFilter === "gestationalWeeks") {
          resets[childFilter] = null;
        } else {
          resets[childFilter] = new Set();
        }
      }
    }
  }

  return resets;
}

const useAppStore = create((set, get) => ({
  // Data
  clinics: [],
  virtualClinics: [],

  // Filters
  filters: {
    services: new Set(),
    insurance: new Set(),
    access: new Set(),
    accessType: new Set(),
    genderAffirming: new Set(),
    prep: new Set(),
    boroughs: new Set(),
    gestationalWeeks: null, // null = no filter, number = weeks pregnant
    openNow: false,
    openAfter5pm: false,
    subwayLines: new Set(),
    busRoutes: new Set(),
    searchQuery: "",
  },

  // UI State
  selectedClinic: null,
  mapViewport: {
    longitude: -73.9712,
    latitude: 40.7831,
    zoom: 11,
  },
  mapRef: null,

  // Actions
  setMapRef: (ref) => set({ mapRef: ref }),
  setClinics: (clinics) => set({ clinics }),
  setVirtualClinics: (virtualClinics) => set({ virtualClinics }),
  selectClinic: (clinic) => set({ selectedClinic: clinic }),
  setMapViewport: (viewport) => set({ mapViewport: viewport }),
  setFilter: (category, value) =>
    set((state) => {
      // Check if we need to cascade-clear child filters
      const oldValue = state.filters[category];
      let childResets = {};

      if (oldValue instanceof Set && value instanceof Set) {
        childResets = getChildFiltersToReset(category, oldValue, value);
      }

      return {
        filters: { ...state.filters, [category]: value, ...childResets },
      };
    }),
  clearFilters: () =>
    set({
      filters: {
        services: new Set(),
        insurance: new Set(),
        access: new Set(),
        accessType: new Set(),
        genderAffirming: new Set(),
        prep: new Set(),
        boroughs: new Set(),
        gestationalWeeks: null,
        openNow: false,
        openAfter5pm: false,
        subwayLines: new Set(),
        busRoutes: new Set(),
        searchQuery: "",
      },
    }),
  setGestationalWeeks: (weeks) =>
    set((state) => ({
      filters: { ...state.filters, gestationalWeeks: weeks },
    })),

  // Selectors (derived state)
  getActiveFilterCount: () => {
    const { filters } = get();
    return (
      filters.services.size +
      (filters.genderAffirming?.size || 0) +
      (filters.prep?.size || 0) +
      filters.insurance.size +
      filters.access.size +
      filters.boroughs.size +
      (filters.gestationalWeeks !== null ? 1 : 0) +
      (filters.openNow ? 1 : 0) +
      (filters.openAfter5pm ? 1 : 0) +
      filters.subwayLines.size +
      filters.busRoutes.size +
      (filters.searchQuery.trim() ? 1 : 0)
    );
  },

  hasActiveFilters: () => get().getActiveFilterCount() > 0,
}));

export default useAppStore;

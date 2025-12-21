import { create } from "zustand";

const useAppStore = create((set) => ({
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
    set((state) => ({
      filters: { ...state.filters, [category]: value },
    })),
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
}));

export default useAppStore;

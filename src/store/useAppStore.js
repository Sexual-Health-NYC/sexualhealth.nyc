import { create } from "zustand";

const useAppStore = create((set) => ({
  // Data
  clinics: [],

  // Filters
  filters: {
    services: new Set(),
    insurance: new Set(),
    access: new Set(),
    boroughs: new Set(),
  },

  // UI State
  selectedClinic: null,
  mapViewport: {
    longitude: -73.9712,
    latitude: 40.7831,
    zoom: 11,
  },

  // Actions
  setClinics: (clinics) => set({ clinics }),
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
        boroughs: new Set(),
      },
    }),
}));

export default useAppStore;

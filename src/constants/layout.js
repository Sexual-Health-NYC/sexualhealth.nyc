/**
 * Layout constants used throughout the application.
 * Centralizes magic numbers for consistency and maintainability.
 */

// Responsive breakpoint for mobile detection
export const MOBILE_BREAKPOINT = 768;

// Map padding configurations
export const MAP_PADDING = {
  desktop: {
    top: 80,
    bottom: 80,
    left: 80,
    right: 480,
  },
  mobile: {
    top: 80,
    bottom: 80,
    left: 50,
    right: 50,
  },
};

// Map padding when clinic is selected
export const MAP_SELECTED_PADDING = {
  desktop: {
    top: 50,
    bottom: 50,
    left: 50,
    right: 450,
  },
  mobile: {
    top: 50,
    bottom: null, // Calculated dynamically based on viewport height
    left: 50,
    right: 50,
  },
};

// Map animation durations (in ms)
export const MAP_ANIMATION = {
  fitBounds: 1000,
  easeToCenter: 500,
  updatePadding: 300,
};

// Cluster marker sizing
export const CLUSTER_SIZING = {
  baseSize: 30,
  maxAddition: 40,
};

// Z-index layers
export const Z_INDEX = {
  filterBar: 100,
  dropdown: 1000,
  modal: 1000,
  bottomSheet: 1001,
  detailPanel: 50,
  mapControls: 10,
  telehealthBanner: 25,
};

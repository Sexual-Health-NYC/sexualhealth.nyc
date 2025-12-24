/**
 * Single source of truth for all filter configurations.
 * This ensures desktop and mobile views stay in sync.
 */

export const FILTER_TYPES = {
  MULTI_SELECT: "multi_select", // Checkboxes (mobile) / Dropdown (desktop)
  TOGGLE: "toggle", // Single checkbox or button
  TRANSIT: "transit", // Special react-select for subway/bus
  CHILD_FILTER: "child_filter", // Conditional filter (appears when parent selected)
};

/**
 * Filter configuration schema.
 * Each filter defines its behavior across both desktop and mobile views.
 */
export const FILTER_CONFIG = [
  {
    id: "services",
    type: FILTER_TYPES.MULTI_SELECT,
    category: "services",
    titleKey: "sections:services",
    optionsKey: "serviceOptions",
    order: 1,
  },
  {
    id: "genderAffirming",
    type: FILTER_TYPES.CHILD_FILTER,
    category: "genderAffirming",
    titleKey: "filters:genderAffirmingCare",
    optionsKey: "genderAffirmingOptions",
    parentFilter: "services",
    parentValue: "gender_affirming",
    order: 2,
  },
  {
    id: "prep",
    type: FILTER_TYPES.CHILD_FILTER,
    category: "prep",
    titleKey: "filters:prepServices",
    optionsKey: "prepOptions",
    parentFilter: "services",
    parentValue: "prep",
    order: 3,
  },
  {
    id: "gestational",
    type: "gestational", // Special case for now
    category: "gestationalWeeks",
    titleKey: "gestational:weeksPregnant",
    optionsKey: "gestationalOptions",
    parentFilter: "services",
    parentValue: "abortion",
    order: 4,
  },
  {
    id: "insurance",
    type: FILTER_TYPES.MULTI_SELECT,
    category: "insurance",
    titleKey: "sections:insuranceAndCost",
    optionsKey: "insuranceOptions",
    order: 5,
  },
  {
    id: "boroughs",
    type: FILTER_TYPES.MULTI_SELECT,
    category: "boroughs",
    titleKey: "sections:borough",
    optionsKey: "boroughOptions",
    order: 6,
  },
  {
    id: "access",
    type: FILTER_TYPES.MULTI_SELECT,
    category: "access",
    titleKey: "sections:walkIns",
    optionsKey: "accessOptions",
    order: 7,
  },
  {
    id: "openNow",
    type: FILTER_TYPES.TOGGLE,
    category: "openNow",
    titleKey: "messages:openNow",
    order: 8,
    desktopStyle: {
      color: "open", // Uses theme.colors.open
    },
  },
  {
    id: "openAfter5pm",
    type: FILTER_TYPES.TOGGLE,
    category: "openAfter5pm",
    titleKey: "messages:openAfter5pm",
    order: 9,
  },
  {
    id: "subwayLines",
    type: FILTER_TYPES.TRANSIT,
    category: "subwayLines",
    titleKey: "messages:subway",
    placeholderKey: "messages:selectSubway",
    dataSource: "transitData.subwayLines",
    formatLabel: "subway", // Uses SubwayBullet component
    order: 10,
  },
  {
    id: "busRoutes",
    type: FILTER_TYPES.TRANSIT,
    category: "busRoutes",
    titleKey: "messages:bus",
    placeholderKey: "messages:selectBus",
    dataSource: "transitData.busRoutes",
    formatLabel: "bus", // Uses BusBullet component
    order: 11,
  },
];

/**
 * Get visible filters based on current filter state.
 * @param {Object} filters - Current filter state from store
 * @returns {Array} Array of filter configs that should be visible
 */
export function getVisibleFilters(filters) {
  return FILTER_CONFIG.filter((config) => {
    // Always show if no parent filter
    if (!config.parentFilter) return true;

    // Show if parent filter has the required value
    return filters[config.parentFilter]?.has(config.parentValue);
  }).sort((a, b) => a.order - b.order);
}

/**
 * Get dropdown refs needed for desktop view.
 * @returns {Object} Object with ref keys for all filters
 */
export function getDropdownRefKeys() {
  return FILTER_CONFIG.reduce((acc, config) => {
    if (
      config.type === FILTER_TYPES.MULTI_SELECT ||
      config.type === FILTER_TYPES.CHILD_FILTER ||
      config.type === "gestational"
    ) {
      acc[config.id] = null;
    }
    return acc;
  }, {});
}

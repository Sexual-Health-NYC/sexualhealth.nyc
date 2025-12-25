import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useAppStore from "../store/useAppStore";
import useFilterOptions from "../hooks/useFilterOptions";
import useVisibleFilters from "../hooks/useVisibleFilters";
import useIsMobile from "../hooks/useIsMobile";
import useClickOutside from "../hooks/useClickOutside";
import FilterControls from "./FilterControls";
import SearchAutocomplete from "./SearchAutocomplete";
import DesktopFilterRenderer from "./DesktopFilterRenderer";

export default function FilterBar() {
  const { t } = useTranslation([
    "services",
    "insurance",
    "locations",
    "actions",
    "gestational",
    "messages",
    "filters",
  ]);
  const {
    filters,
    setFilter,
    clearFilters,
    setGestationalWeeks,
    selectedClinic,
  } = useAppStore();
  const filterOptions = useFilterOptions();
  const visibleFilters = useVisibleFilters();
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Close mobile filter modal when a clinic is selected
  useEffect(() => {
    if (selectedClinic && isModalOpen && isMobile) {
      setIsModalOpen(false);
    }
  }, [selectedClinic, isModalOpen, isMobile]);

  const handleCheckbox = (category, value) => {
    const newFilters = { ...filters };
    if (newFilters[category].has(value)) {
      newFilters[category].delete(value);

      // Clear gestational weeks filter if abortion service is deselected
      if (category === "services" && value === "abortion") {
        setGestationalWeeks(null);
      }
    } else {
      newFilters[category].add(value);
    }
    setFilter(category, new Set(newFilters[category]));
  };

  const getActiveFilterCount = () => {
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
  };

  const removeFilter = (category, value) => {
    const newFilters = { ...filters };
    newFilters[category].delete(value);
    setFilter(category, new Set(newFilters[category]));
  };

  const FilterDropdown = ({
    name,
    title,
    options,
    category,
    isChildFilter,
  }) => {
    const isOpen = openDropdown === name;
    const activeCount = filters[category].size;
    const dropdownRef = useRef(null);

    useClickOutside(dropdownRef, () => setOpenDropdown(null), isOpen);

    return (
      <div
        ref={dropdownRef}
        className="relative inline-block transition-transform duration-200"
      >
        <button
          onClick={() => setOpenDropdown(isOpen ? null : name)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={`${title} filter${activeCount > 0 ? `, ${activeCount} selected` : ""}`}
          className={`filter-pill py-2 px-4 rounded-md text-sm font-medium cursor-pointer flex items-center gap-2 focus-ring ${
            activeCount > 0
              ? "bg-primary text-white border-2 border-primary"
              : isChildFilter
                ? "bg-primary/5 text-text-primary border-2 border-primary/20"
                : "bg-white text-text-primary border-2 border-border"
          }`}
        >
          {title}
          {activeCount > 0 && (
            <span
              className="bg-white text-primary rounded-full px-2 text-xs font-bold min-w-[20px] text-center"
              aria-hidden="true"
            >
              {activeCount}
            </span>
          )}
          <span aria-hidden="true">{isOpen ? "▲" : "▼"}</span>
        </button>

        {isOpen && (
          <div
            role="menu"
            className="absolute top-[calc(100%+4px)] start-0 bg-white border border-border rounded-md shadow-lg p-2 min-w-[220px] z-[1000]"
          >
            {options.map((option) => (
              <label
                key={option.value}
                role="menuitemcheckbox"
                aria-checked={filters[category].has(option.value)}
                className={`flex items-center p-2 cursor-pointer rounded-sm transition-colors ${
                  filters[category].has(option.value)
                    ? "bg-primary-light/15"
                    : "hover:bg-surface"
                }`}
              >
                <input
                  type="checkbox"
                  checked={filters[category].has(option.value)}
                  onChange={() => handleCheckbox(category, option.value)}
                  className="me-2 w-[18px] h-[18px] cursor-pointer accent-primary"
                />
                <span
                  className={`text-sm select-none flex-1 ${
                    filters[category].has(option.value)
                      ? "font-medium"
                      : "font-normal"
                  }`}
                >
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  const GestationalDropdown = () => {
    const isOpen = openDropdown === "gestational";
    const hasFilter = filters.gestationalWeeks !== null;
    const dropdownRef = useRef(null);
    const { gestationalOptions } = filterOptions;
    const currentLabel =
      gestationalOptions.find((o) => o.value === filters.gestationalWeeks)
        ?.label || t("gestational:weeksPregnant");

    useClickOutside(dropdownRef, () => setOpenDropdown(null), isOpen);

    return (
      <div
        ref={dropdownRef}
        className="relative inline-block transition-transform duration-200"
      >
        <button
          onClick={() => setOpenDropdown(isOpen ? null : "gestational")}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={`Gestational age filter${hasFilter ? `, ${currentLabel}` : ""}`}
          className={`filter-pill py-2 px-4 rounded-md text-sm font-medium cursor-pointer flex items-center gap-2 focus-ring ${
            hasFilter
              ? "bg-primary text-white border-2 border-primary"
              : "bg-primary/5 text-text-primary border-2 border-primary/20"
          }`}
        >
          {hasFilter ? currentLabel : t("gestational:weeksPregnant")}
          <span aria-hidden="true">{isOpen ? "▲" : "▼"}</span>
        </button>

        {isOpen && (
          <div
            role="menu"
            className="absolute top-[calc(100%+4px)] start-0 bg-white border border-border rounded-md shadow-lg p-2 min-w-[200px] z-[1000]"
          >
            {gestationalOptions.map((option) => (
              <label
                key={option.value ?? "any"}
                role="menuitemradio"
                aria-checked={filters.gestationalWeeks === option.value}
                className={`flex items-center p-2 cursor-pointer rounded-sm transition-colors ${
                  filters.gestationalWeeks === option.value
                    ? "bg-accent/15"
                    : "hover:bg-surface"
                }`}
              >
                <input
                  type="radio"
                  name="gestational"
                  checked={filters.gestationalWeeks === option.value}
                  onChange={() => {
                    setGestationalWeeks(option.value);
                    setOpenDropdown(null);
                  }}
                  className="me-2 w-[18px] h-[18px] cursor-pointer accent-accent"
                />
                <span
                  className={`text-sm select-none flex-1 ${
                    filters.gestationalWeeks === option.value
                      ? "font-medium"
                      : "font-normal"
                  }`}
                >
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  const ActiveFilterPill = ({ category, value, label }) => {
    return (
      <span className="inline-flex items-center gap-2 py-1 px-3 bg-surface hover:bg-primary/10 text-primary border-[1.5px] border-primary rounded-full text-sm font-medium transition-colors">
        {label}
        <button
          onClick={() => removeFilter(category, value)}
          aria-label={`Remove ${label} filter`}
          className="bg-transparent border-none text-primary cursor-pointer text-lg p-2 min-w-[20px] min-h-[20px] flex items-center justify-center rounded-sm focus-ring -me-1"
        >
          ×
        </button>
      </span>
    );
  };

  // Desktop view
  if (!isMobile) {
    return (
      <div
        role="region"
        aria-label="Filter clinics"
        className="border-b border-border bg-white py-3 px-6"
      >
        {/* Top row: Logo, Search, Clear All, and Language */}
        <div className="flex items-center gap-3 mb-3">
          <a href="/" className="flex shrink-0">
            <img
              src="/logo-horizontal.png"
              srcSet="/logo-horizontal.png 1x, /logo-horizontal@2x.png 2x, /logo-horizontal@3x.png 3x"
              alt="sexualhealth.nyc"
              width={187}
              height={40}
              fetchPriority="high"
              className="h-10 w-auto"
            />
          </a>

          <SearchAutocomplete
            placeholder={t("messages:searchByName")}
            className="flex-1 max-w-[400px]"
          />

          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearFilters}
              className="btn-interactive py-2 px-4 bg-white text-text-secondary border border-border rounded-md text-sm font-medium cursor-pointer ms-auto focus-ring"
            >
              {t("actions:clearAll")}
            </button>
          )}
        </div>

        {/* Filter dropdowns row - config-driven */}
        <div
          className={`flex gap-3 flex-wrap items-center ${getActiveFilterCount() > 0 ? "mb-3" : ""}`}
        >
          {visibleFilters.map((config) => (
            <DesktopFilterRenderer
              key={config.id}
              config={config}
              FilterDropdown={FilterDropdown}
              GestationalDropdown={GestationalDropdown}
            />
          ))}
        </div>

        {/* Bottom row: Active filter pills - config-driven */}
        {getActiveFilterCount() > 0 && (
          <div
            role="status"
            aria-live="polite"
            aria-label={`${getActiveFilterCount()} filters active`}
            className="flex flex-wrap gap-2"
          >
            {visibleFilters.map((config) => {
              const filterValue = filters[config.category];
              const options = config.optionsKey
                ? filterOptions[config.optionsKey]
                : [];

              // Multi-select filters (Set)
              if (filterValue instanceof Set && filterValue.size > 0) {
                return Array.from(filterValue).map((value) => (
                  <ActiveFilterPill
                    key={`${config.category}-${value}`}
                    category={config.category}
                    value={value}
                    label={options.find((o) => o.value === value)?.label}
                  />
                ));
              }

              // Gestational filter (special case)
              if (
                config.type === "gestational" &&
                filters.gestationalWeeks !== null
              ) {
                return (
                  <span
                    key="gestational"
                    className="inline-flex items-center gap-2 py-1 px-3 bg-service-abortion-bg text-accent border border-accent rounded-full text-sm font-medium"
                  >
                    {options.find((o) => o.value === filters.gestationalWeeks)
                      ?.label || ""}
                    <button
                      onClick={() => setGestationalWeeks(null)}
                      aria-label="Remove gestational filter"
                      className="bg-transparent border-none text-accent cursor-pointer text-base p-0 flex items-center"
                    >
                      ×
                    </button>
                  </span>
                );
              }

              return null;
            })}
          </div>
        )}
      </div>
    );
  }

  // Mobile view
  return (
    <>
      {/* Mobile filter button */}
      <div className="sticky top-0 z-[100] border-b border-border bg-white p-3">
        <div className="flex items-center gap-3">
          <a href="/" className="flex">
            <img
              src="/logo-horizontal.png"
              srcSet="/logo-horizontal.png 1x, /logo-horizontal@2x.png 2x"
              alt="sexualhealth.nyc"
              width={140}
              height={30}
              fetchPriority="high"
              className="h-[30px] w-auto"
            />
          </a>
          <button
            onClick={() => setIsModalOpen(true)}
            aria-expanded={isModalOpen}
            aria-label={`${t("actions:filters")}${getActiveFilterCount() > 0 ? `, ${getActiveFilterCount()} active` : ""}`}
            className="btn-interactive flex-1 py-2 px-4 bg-primary text-white border-none rounded-md text-sm font-medium cursor-pointer flex items-center justify-center gap-2"
          >
            {t("actions:filters")}
            {getActiveFilterCount() > 0 && (
              <span className="bg-white text-primary rounded-full px-2 py-0.5 text-xs font-bold min-w-[20px]">
                {getActiveFilterCount()}
              </span>
            )}
          </button>
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearFilters}
              className="btn-interactive py-2 px-3 bg-transparent text-primary border border-primary rounded-md text-sm font-medium cursor-pointer whitespace-nowrap"
            >
              {t("actions:clearAll")}
            </button>
          )}
        </div>
      </div>

      {/* Mobile filter modal (bottom sheet) */}
      {isModalOpen && (
        <>
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/30 z-[1000] pointer-events-none"
            aria-hidden="true"
          />
          <div
            data-filter-modal
            role="dialog"
            aria-modal="true"
            aria-label="Filter options"
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[60vh] z-[1001] flex flex-col pointer-events-auto"
          >
            <div className="flex justify-between items-center p-4 pb-3 border-b border-border shrink-0">
              <h2 className="text-xl font-bold m-0">{t("actions:filters")}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close filters"
                className="bg-transparent border-none text-2xl cursor-pointer p-0"
              >
                ×
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4 pt-3">
              <FilterControls mode="mobile" />
            </div>

            <div className="flex gap-3 p-4 pt-3 border-t border-border shrink-0">
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={() => {
                    clearFilters();
                    setIsModalOpen(false);
                  }}
                  className="flex-1 p-3 bg-white text-text-secondary border border-border rounded-md text-base font-medium cursor-pointer"
                >
                  {t("actions:clearAll")}
                </button>
              )}
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn-interactive flex-1 p-3 bg-primary text-white border-none rounded-md text-base font-medium cursor-pointer"
              >
                {t("actions:apply")}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

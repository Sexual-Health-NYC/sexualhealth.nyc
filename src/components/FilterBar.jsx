import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useAppStore from "../store/useAppStore";
import useFilterOptions from "../hooks/useFilterOptions";
import useVisibleFilters from "../hooks/useVisibleFilters";
import useIsMobile from "../hooks/useIsMobile";
import FilterControls from "./FilterControls";
import SearchAutocomplete from "./SearchAutocomplete";
import DesktopFilterRenderer from "./DesktopFilterRenderer";
import FilterDropdown from "./filters/FilterDropdown";
import GestationalDropdown from "./filters/GestationalDropdown";
import ActiveFilterPill from "./filters/ActiveFilterPill";

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
    getActiveFilterCount,
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

  const removeFilter = (category, value) => {
    const newFilters = { ...filters };
    newFilters[category].delete(value);
    setFilter(category, new Set(newFilters[category]));
  };

  // Wrapper to pass required props to FilterDropdown
  const renderFilterDropdown = (props) => (
    <FilterDropdown
      {...props}
      filters={filters}
      openDropdown={openDropdown}
      setOpenDropdown={setOpenDropdown}
      handleCheckbox={handleCheckbox}
    />
  );

  // Wrapper to pass required props to GestationalDropdown
  const renderGestationalDropdown = () => (
    <GestationalDropdown
      filters={filters}
      gestationalOptions={filterOptions.gestationalOptions}
      setGestationalWeeks={setGestationalWeeks}
    />
  );

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
              FilterDropdown={renderFilterDropdown}
              GestationalDropdown={renderGestationalDropdown}
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
                    onRemove={removeFilter}
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

import { useTranslation } from "react-i18next";
import Select from "react-select";
import useAppStore from "../store/useAppStore";
import useFilterOptions from "../hooks/useFilterOptions";
import { FILTER_TYPES } from "../config/filterConfig";
import SubwayBullet, { BusBullet } from "./SubwayBullet";
import transitData from "../data/transitLines.json";

/**
 * Renders a single filter for desktop view based on configuration.
 * Handles dropdowns, toggles, and transit filters.
 */
export default function DesktopFilterRenderer({
  config,
  FilterDropdown,
  GestationalDropdown,
}) {
  const { t } = useTranslation();
  const { filters, setFilter } = useAppStore();
  const filterOptions = useFilterOptions();

  const options = config.optionsKey ? filterOptions[config.optionsKey] : [];

  // Multi-select dropdown
  if (
    config.type === FILTER_TYPES.MULTI_SELECT ||
    config.type === FILTER_TYPES.CHILD_FILTER
  ) {
    return (
      <FilterDropdown
        name={config.id}
        title={t(config.titleKey)}
        options={options}
        category={config.category}
        isChildFilter={config.type === FILTER_TYPES.CHILD_FILTER}
      />
    );
  }

  // Gestational (special case)
  if (config.type === "gestational") {
    return <GestationalDropdown />;
  }

  // Toggle button
  if (config.type === FILTER_TYPES.TOGGLE) {
    const isActive = filters[config.category];

    return (
      <button
        onClick={() => setFilter(config.category, !isActive)}
        className={`filter-pill py-2 px-4 rounded-md text-sm font-medium cursor-pointer ${
          isActive
            ? "bg-primary text-white border-2 border-primary"
            : "bg-white text-text-primary border-2 border-border"
        }`}
      >
        {t(config.titleKey)}
      </button>
    );
  }

  // Transit (subway/bus)
  if (config.type === FILTER_TYPES.TRANSIT) {
    const dataSource =
      config.dataSource === "transitData.subwayLines"
        ? transitData.subwayLines
        : transitData.busRoutes;
    const hasSelection = filters[config.category].size > 0;

    return (
      <div className="min-w-[180px]">
        <Select
          isMulti
          aria-label={t(config.titleKey)}
          placeholder={t(config.placeholderKey || config.titleKey)}
          value={Array.from(filters[config.category]).map((item) => ({
            value: item,
            label: item,
          }))}
          onChange={(selected) => {
            setFilter(
              config.category,
              new Set(selected?.map((s) => s.value) || []),
            );
          }}
          options={dataSource.map((item) => ({
            value: item,
            label: item,
          }))}
          formatOptionLabel={({ value }) =>
            config.formatLabel === "subway" ? (
              <div className="flex items-center gap-2">
                <SubwayBullet line={value} />
                <span>{value} train</span>
              </div>
            ) : (
              <BusBullet route={value} />
            )
          }
          styles={{
            control: (base, state) => ({
              ...base,
              minHeight: "38px",
              backgroundColor: hasSelection ? "#0D8078" : "white",
              borderColor: hasSelection ? "#0D8078" : "#dee2e6",
              borderWidth: "2px",
              borderRadius: "6px",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              boxShadow: state.isFocused
                ? "0 0 0 2px rgba(13, 128, 120, 0.5)"
                : "none",
              "&:hover": {
                borderColor: hasSelection ? "#047568" : "#4ECDC4",
              },
            }),
            valueContainer: (base) => ({
              ...base,
              padding: "2px 8px",
            }),
            placeholder: (base) => ({
              ...base,
              color: "#212529",
              fontWeight: 500,
            }),
            input: (base) => ({
              ...base,
              color: hasSelection ? "white" : "#212529",
            }),
            singleValue: (base) => ({
              ...base,
              color: hasSelection ? "white" : "#212529",
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: hasSelection
                ? "rgba(255,255,255,0.25)"
                : "rgba(13, 128, 120, 0.15)",
              borderRadius: "4px",
            }),
            multiValueLabel: (base) => ({
              ...base,
              fontSize: "0.875rem",
              color: hasSelection ? "white" : "#212529",
              padding: "2px 6px",
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: hasSelection ? "white" : "#6c757d",
              borderRadius: "0 4px 4px 0",
              "&:hover": {
                backgroundColor: hasSelection
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(13, 128, 120, 0.25)",
                color: hasSelection ? "white" : "#212529",
              },
            }),
            dropdownIndicator: (base) => ({
              ...base,
              color: hasSelection ? "white" : "#6c757d",
              padding: "6px",
              "&:hover": { color: hasSelection ? "white" : "#212529" },
            }),
            clearIndicator: (base) => ({
              ...base,
              color: hasSelection ? "white" : "#6c757d",
              padding: "6px",
              "&:hover": { color: hasSelection ? "white" : "#212529" },
            }),
            indicatorSeparator: () => ({ display: "none" }),
            menu: (base) => ({
              ...base,
              zIndex: 1000,
              borderRadius: "6px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              border: "1px solid #dee2e6",
            }),
            menuList: (base) => ({
              ...base,
              padding: "4px",
            }),
            option: (base, state) => ({
              ...base,
              fontSize: "0.875rem",
              borderRadius: "4px",
              margin: "2px 0",
              backgroundColor: state.isSelected
                ? "#0D8078"
                : state.isFocused
                  ? "#f8f9fa"
                  : "white",
              color: state.isSelected ? "white" : "#212529",
              cursor: "pointer",
              "&:active": { backgroundColor: "#4ECDC4" },
            }),
          }}
        />
      </div>
    );
  }

  return null;
}

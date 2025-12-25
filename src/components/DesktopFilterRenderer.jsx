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
          unstyled
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
          classNames={{
            control: () =>
              `flex items-center min-h-[38px] px-2 rounded-md border-2 cursor-pointer text-sm font-medium transition-all ${
                hasSelection
                  ? "bg-primary border-primary text-white"
                  : "bg-white border-border text-text-primary hover:border-primary-light"
              }`,
            valueContainer: () => "gap-1 py-0.5",
            placeholder: () => "text-text-primary font-medium",
            input: () => (hasSelection ? "text-white" : "text-text-primary"),
            multiValue: () =>
              `rounded px-1 ${hasSelection ? "bg-white/25" : "bg-primary/15"}`,
            multiValueLabel: () =>
              `text-sm px-1 ${hasSelection ? "text-white" : "text-text-primary"}`,
            multiValueRemove: () =>
              `rounded-r px-1 hover:bg-white/30 ${hasSelection ? "text-white" : "text-text-secondary"}`,
            dropdownIndicator: () =>
              `p-1.5 ${hasSelection ? "text-white" : "text-text-secondary"}`,
            clearIndicator: () =>
              `p-1.5 ${hasSelection ? "text-white" : "text-text-secondary"}`,
            indicatorSeparator: () => "hidden",
            menu: () =>
              "mt-1 bg-white border border-border rounded-md shadow-lg z-[1000]",
            menuList: () => "p-1",
            option: ({ isSelected, isFocused }) =>
              `text-sm rounded px-3 py-2 cursor-pointer ${
                isSelected
                  ? "bg-primary text-white"
                  : isFocused
                    ? "bg-surface"
                    : "bg-white text-text-primary"
              }`,
          }}
        />
      </div>
    );
  }

  return null;
}

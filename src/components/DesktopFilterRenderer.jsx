import { useTranslation } from "react-i18next";
import Select from "react-select";
import useAppStore from "../store/useAppStore";
import useFilterOptions from "../hooks/useFilterOptions";
import { FILTER_TYPES } from "../config/filterConfig";
import theme from "../theme";
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
    const colorKey = config.desktopStyle?.color || "primary";
    const bgColor = isActive ? theme.colors[colorKey] : "white";
    const borderColor = isActive ? theme.colors[colorKey] : theme.colors.border;

    return (
      <button
        onClick={() => setFilter(config.category, !isActive)}
        className={`filter-pill${isActive ? " active" : ""}`}
        style={{
          padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
          backgroundColor: bgColor,
          color: isActive ? "white" : theme.colors.textPrimary,
          border: `2px solid ${borderColor}`,
          borderRadius: theme.borderRadius.md,
          fontSize: theme.fonts.size.sm,
          fontWeight: theme.fonts.weight.medium,
          cursor: "pointer",
        }}
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

    return (
      <div style={{ minWidth: "180px" }}>
        <Select
          isMulti
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <SubwayBullet line={value} />
                <span>{value} train</span>
              </div>
            ) : (
              <BusBullet route={value} />
            )
          }
          styles={{
            control: (base) => ({
              ...base,
              borderColor:
                filters[config.category].size > 0
                  ? theme.colors.primary
                  : theme.colors.border,
              borderWidth: "2px",
              "&:hover": { borderColor: theme.colors.primaryLight },
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: `${theme.colors.primary}20`,
            }),
            menu: (base) => ({
              ...base,
              zIndex: 1000,
            }),
          }}
        />
      </div>
    );
  }

  return null;
}

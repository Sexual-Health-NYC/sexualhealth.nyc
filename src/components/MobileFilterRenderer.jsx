import { useTranslation } from "react-i18next";
import Select from "react-select";
import useAppStore from "../store/useAppStore";
import useFilterOptions from "../hooks/useFilterOptions";
import { FILTER_TYPES } from "../config/filterConfig";
import theme from "../theme";
import SubwayBullet, { BusBullet } from "./SubwayBullet";
import transitData from "../data/transitLines.json";

/**
 * Renders a single filter for mobile view based on configuration.
 * Uses FilterSection and Checkbox components.
 */
export default function MobileFilterRenderer({
  config,
  FilterSection,
  Checkbox,
}) {
  const { t } = useTranslation();
  const { filters, setFilter, setGestationalWeeks } = useAppStore();
  const filterOptions = useFilterOptions();

  const options = config.optionsKey ? filterOptions[config.optionsKey] : [];

  const handleCheckbox = (category, value) => {
    const newFilters = { ...filters };
    if (newFilters[category].has(value)) {
      newFilters[category].delete(value);

      if (category === "services" && value === "abortion") {
        setGestationalWeeks(null);
      }
    } else {
      newFilters[category].add(value);
    }
    setFilter(category, new Set(newFilters[category]));
  };

  // Multi-select checkboxes
  if (
    config.type === FILTER_TYPES.MULTI_SELECT ||
    config.type === FILTER_TYPES.CHILD_FILTER
  ) {
    return (
      <FilterSection title={t(config.titleKey)}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={filters[config.category].has(option.value)}
            onChange={() => handleCheckbox(config.category, option.value)}
          />
        ))}
      </FilterSection>
    );
  }

  // Gestational (special case)
  if (config.type === "gestational") {
    return (
      <FilterSection title={t("services:abortion")}>
        <div style={{ marginBottom: theme.spacing[2] }}>
          <label
            style={{
              fontSize: theme.fonts.size.sm,
              fontWeight: theme.fonts.weight.medium,
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing[1],
              display: "block",
            }}
          >
            {t(config.titleKey)}
          </label>
          <select
            value={filters.gestationalWeeks ?? ""}
            onChange={(e) =>
              setGestationalWeeks(
                e.target.value === "" ? null : Number(e.target.value),
              )
            }
            style={{
              width: "100%",
              padding: theme.spacing[2],
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border}`,
              fontSize: theme.fonts.size.sm,
              backgroundColor: "white",
            }}
          >
            {options.map((option) => (
              <option key={option.value ?? "any"} value={option.value ?? ""}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </FilterSection>
    );
  }

  // Toggle checkbox
  if (config.type === FILTER_TYPES.TOGGLE) {
    return (
      <Checkbox
        label={t(config.titleKey)}
        checked={filters[config.category]}
        onChange={() => setFilter(config.category, !filters[config.category])}
      />
    );
  }

  // Transit (subway/bus)
  if (config.type === FILTER_TYPES.TRANSIT) {
    const dataSource =
      config.dataSource === "transitData.subwayLines"
        ? transitData.subwayLines
        : transitData.busRoutes;

    return (
      <FilterSection title={t(config.titleKey)}>
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
          }}
        />
      </FilterSection>
    );
  }

  return null;
}

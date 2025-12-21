import { useTranslation } from "react-i18next";
import Select from "react-select";
import useAppStore from "../store/useAppStore";
import useFilterOptions from "../hooks/useFilterOptions";
import theme from "../theme";
import SubwayBullet from "./SubwayBullet";
import transitData from "../data/transitLines.json";

export default function FilterControls({ mode = "mobile" }) {
  const { t } = useTranslation(["actions", "messages", "sections", "filters"]);
  const { filters, setFilter, setGestationalWeeks } = useAppStore();
  const {
    serviceOptions,
    genderAffirmingOptions,
    prepOptions,
    insuranceOptions,
    boroughOptions,
    gestationalOptions,
  } = useFilterOptions();

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

  return (
    <>
      <FilterSection title={t("messages:search")}>
        <input
          type="search"
          placeholder={t("messages:searchByName")}
          value={filters.searchQuery}
          onChange={(e) => setFilter("searchQuery", e.target.value)}
          aria-label="Search clinics by name"
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          style={{
            width: "100%",
            padding: theme.spacing[2],
            border: `2px solid ${filters.searchQuery.trim() ? theme.colors.primary : theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
            fontSize: theme.fonts.size.sm,
            fontFamily: theme.fonts.family,
          }}
        />
      </FilterSection>

      <FilterSection title={t("sections:services")}>
        {serviceOptions.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={filters.services.has(option.value)}
            onChange={() => handleCheckbox("services", option.value)}
          />
        ))}
      </FilterSection>

      {filters.services.has("abortion") && (
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
              {t("gestational:weeksPregnant")}
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
              {gestationalOptions.map((option) => (
                <option key={option.value ?? "any"} value={option.value ?? ""}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </FilterSection>
      )}

      {filters.services.has("gender_affirming") && (
        <FilterSection title={t("filters:genderAffirmingCare")}>
          {genderAffirmingOptions.map((option) => (
            <Checkbox
              key={option.value}
              label={option.label}
              checked={filters.genderAffirming?.has(option.value) || false}
              onChange={() => handleCheckbox("genderAffirming", option.value)}
            />
          ))}
        </FilterSection>
      )}

      {filters.services.has("prep") && (
        <FilterSection title={t("filters:prepServices")}>
          {prepOptions.map((option) => (
            <Checkbox
              key={option.value}
              label={option.label}
              checked={filters.prep?.has(option.value) || false}
              onChange={() => handleCheckbox("prep", option.value)}
            />
          ))}
        </FilterSection>
      )}

      <FilterSection title={t("sections:insuranceAndCost")}>
        {insuranceOptions.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={filters.insurance.has(option.value)}
            onChange={() => handleCheckbox("insurance", option.value)}
          />
        ))}
      </FilterSection>

      <FilterSection title={t("sections:walkIns")}>
        <Checkbox
          label={t("messages:walkInsAccepted")}
          checked={filters.access.has("walk_in")}
          onChange={() => handleCheckbox("access", "walk_in")}
        />
      </FilterSection>

      <FilterSection title={t("sections:borough")}>
        {boroughOptions.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={filters.boroughs.has(option.value)}
            onChange={() => handleCheckbox("boroughs", option.value)}
          />
        ))}
      </FilterSection>

      <FilterSection title={t("messages:hours")}>
        <Checkbox
          label={t("messages:openNow")}
          checked={filters.openNow}
          onChange={() => setFilter("openNow", !filters.openNow)}
        />
        <Checkbox
          label={t("messages:openAfter5pm")}
          checked={filters.openAfter5pm}
          onChange={() => setFilter("openAfter5pm", !filters.openAfter5pm)}
        />
      </FilterSection>

      <FilterSection title={t("messages:subway")}>
        <Select
          isMulti
          placeholder={t("messages:selectSubway")}
          value={Array.from(filters.subwayLines).map((line) => ({
            value: line,
            label: line,
          }))}
          onChange={(selected) => {
            setFilter(
              "subwayLines",
              new Set(selected?.map((s) => s.value) || []),
            );
          }}
          options={transitData.subwayLines.map((line) => ({
            value: line,
            label: line,
          }))}
          formatOptionLabel={({ value }) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <SubwayBullet line={value} />
              <span>{value} train</span>
            </div>
          )}
          styles={{
            control: (base) => ({
              ...base,
              borderColor:
                filters.subwayLines.size > 0
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

      <FilterSection title={t("messages:bus")}>
        <Select
          isMulti
          placeholder={t("messages:selectBus")}
          value={Array.from(filters.busRoutes).map((route) => ({
            value: route,
            label: route,
          }))}
          onChange={(selected) => {
            setFilter(
              "busRoutes",
              new Set(selected?.map((s) => s.value) || []),
            );
          }}
          options={transitData.busRoutes.map((route) => ({
            value: route,
            label: route,
          }))}
          styles={{
            control: (base) => ({
              ...base,
              borderColor:
                filters.busRoutes.size > 0
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
    </>
  );
}

function FilterSection({ title, children }) {
  return (
    <fieldset
      style={{
        marginBottom: theme.spacing[3],
        padding: theme.spacing[3],
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        border: "none",
      }}
    >
      <legend
        style={{
          fontSize: theme.fonts.size.sm,
          fontWeight: theme.fonts.weight.semibold,
          marginBottom: theme.spacing[2],
          color: theme.colors.primary,
        }}
      >
        {title}
      </legend>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing[1],
        }}
      >
        {children}
      </div>
    </fieldset>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
        borderRadius: theme.borderRadius.sm,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          marginRight: theme.spacing[2],
          width: "16px",
          height: "16px",
          cursor: "pointer",
          accentColor: theme.colors.primary,
        }}
      />
      <span
        style={{
          fontSize: theme.fonts.size.sm,
          fontWeight: checked
            ? theme.fonts.weight.medium
            : theme.fonts.weight.normal,
        }}
      >
        {label}
      </span>
    </label>
  );
}

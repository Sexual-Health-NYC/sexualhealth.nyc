import { useTranslation } from "react-i18next";
import useAppStore from "../store/useAppStore";
import theme from "../theme";
import SearchAutocomplete from "./SearchAutocomplete";
import useVisibleFilters from "../hooks/useVisibleFilters";
import MobileFilterRenderer from "./MobileFilterRenderer";

export default function FilterControls() {
  const { t } = useTranslation(["actions", "messages", "sections", "filters"]);
  const { filters } = useAppStore();
  const visibleFilters = useVisibleFilters();

  return (
    <>
      {/* Search filter - always first */}
      <FilterSection title={t("messages:search")}>
        <SearchAutocomplete
          placeholder={t("messages:searchByName")}
          style={{
            input: {
              style: {
                width: "100%",
                padding: theme.spacing[2],
                border: `2px solid ${filters.searchQuery.trim() ? theme.colors.primary : theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.fonts.size.sm,
                fontFamily: theme.fonts.family,
              },
            },
            dropdown: {
              maxHeight: "200px",
            },
          }}
        />
      </FilterSection>

      {/* Render all filters from config */}
      {visibleFilters.map((config) => (
        <MobileFilterRenderer
          key={config.id}
          config={config}
          FilterSection={FilterSection}
          Checkbox={Checkbox}
        />
      ))}
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
          marginInlineEnd: theme.spacing[2],
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

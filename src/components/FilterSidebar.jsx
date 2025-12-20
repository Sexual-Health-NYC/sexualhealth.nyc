import { useState } from "react";
import useAppStore from "../store/useAppStore";
import theme from "../theme";

export default function FilterSidebar() {
  const { filters, setFilter, clearFilters } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleCheckbox = (category, value) => {
    const newFilters = { ...filters };
    if (newFilters[category].has(value)) {
      newFilters[category].delete(value);
    } else {
      newFilters[category].add(value);
    }
    setFilter(category, new Set(newFilters[category]));
  };

  // Desktop: always visible sidebar
  // Mobile: drawer that can be toggled
  const sidebarStyle = {
    width: isMobile ? "280px" : "320px",
    height: "100%",
    backgroundColor: "#faf9fb",
    borderRight: `2px solid ${theme.colors.primaryLight}20`,
    overflowY: "auto",
    padding: theme.spacing[6],
    ...(isMobile && {
      position: "fixed",
      left: isOpen ? 0 : "-280px",
      top: 0,
      zIndex: 30,
      transition: `left ${theme.transitions.base}`,
      boxShadow: isOpen ? theme.shadows.lg : "none",
    }),
  };

  return (
    <>
      {/* Mobile filter toggle button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          style={{
            position: "fixed",
            top: theme.spacing[4],
            left: theme.spacing[4],
            zIndex: 40,
            padding: theme.spacing[3],
            backgroundColor: theme.colors.primary,
            color: "white",
            border: "none",
            borderRadius: theme.borderRadius.sm,
            fontSize: theme.fonts.size.sm,
            fontWeight: theme.fonts.weight.medium,
            cursor: "pointer",
            boxShadow: theme.shadows.md,
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = theme.focus.outline;
            e.currentTarget.style.outlineOffset = theme.focus.outlineOffset;
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = "none";
          }}
        >
          {isOpen ? "Close Filters" : "Filters"}
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 25,
          }}
        />
      )}

      <aside
        style={sidebarStyle}
        role="complementary"
        aria-label="Filter clinics"
      >
        <div
          style={{
            fontSize: theme.fonts.size["2xl"],
            fontWeight: theme.fonts.weight.bold,
            marginBottom: theme.spacing[6],
            color: theme.colors.primary,
            borderBottom: `3px solid ${theme.colors.primary}`,
            paddingBottom: theme.spacing[3],
          }}
          role="heading"
          aria-level="1"
        >
          sexualhealth.nyc
        </div>

        <h2
          style={{
            fontSize: theme.fonts.size.xl,
            fontWeight: theme.fonts.weight.semibold,
            marginBottom: theme.spacing[6],
            marginTop: theme.spacing[6],
            color: theme.colors.textPrimary,
          }}
        >
          Filters
        </h2>

        {/* Services */}
        <FilterSection title="Services">
          <Checkbox
            label="STI Testing"
            checked={filters.services.has("sti_testing")}
            onChange={() => handleCheckbox("services", "sti_testing")}
          />
          <Checkbox
            label="HIV Testing"
            checked={filters.services.has("hiv_testing")}
            onChange={() => handleCheckbox("services", "hiv_testing")}
          />
          <Checkbox
            label="PrEP"
            checked={filters.services.has("prep")}
            onChange={() => handleCheckbox("services", "prep")}
          />
          <Checkbox
            label="PEP"
            checked={filters.services.has("pep")}
            onChange={() => handleCheckbox("services", "pep")}
          />
          <Checkbox
            label="Contraception"
            checked={filters.services.has("contraception")}
            onChange={() => handleCheckbox("services", "contraception")}
          />
          <Checkbox
            label="Abortion"
            checked={filters.services.has("abortion")}
            onChange={() => handleCheckbox("services", "abortion")}
          />
        </FilterSection>

        {/* Insurance */}
        <FilterSection title="Insurance & Cost">
          <Checkbox
            label="Accepts Medicaid"
            checked={filters.insurance.has("accepts_medicaid")}
            onChange={() => handleCheckbox("insurance", "accepts_medicaid")}
          />
          <Checkbox
            label="Accepts Medicare"
            checked={filters.insurance.has("accepts_medicare")}
            onChange={() => handleCheckbox("insurance", "accepts_medicare")}
          />
          <Checkbox
            label="No Insurance Required"
            checked={filters.insurance.has("no_insurance_ok")}
            onChange={() => handleCheckbox("insurance", "no_insurance_ok")}
          />
          <Checkbox
            label="Sliding Scale"
            checked={filters.insurance.has("sliding_scale")}
            onChange={() => handleCheckbox("insurance", "sliding_scale")}
          />
        </FilterSection>

        {/* Access */}
        <FilterSection title="Availability">
          <Checkbox
            label="Walk-ins Accepted"
            checked={filters.access.has("walk_in")}
            onChange={() => handleCheckbox("access", "walk_in")}
          />
        </FilterSection>

        {/* Borough */}
        <FilterSection title="Borough">
          <Checkbox
            label="Manhattan"
            checked={filters.boroughs.has("Manhattan")}
            onChange={() => handleCheckbox("boroughs", "Manhattan")}
          />
          <Checkbox
            label="Brooklyn"
            checked={filters.boroughs.has("Brooklyn")}
            onChange={() => handleCheckbox("boroughs", "Brooklyn")}
          />
          <Checkbox
            label="Queens"
            checked={filters.boroughs.has("Queens")}
            onChange={() => handleCheckbox("boroughs", "Queens")}
          />
          <Checkbox
            label="Bronx"
            checked={filters.boroughs.has("Bronx")}
            onChange={() => handleCheckbox("boroughs", "Bronx")}
          />
          <Checkbox
            label="Staten Island"
            checked={filters.boroughs.has("Staten Island")}
            onChange={() => handleCheckbox("boroughs", "Staten Island")}
          />
        </FilterSection>

        <button
          onClick={clearFilters}
          style={{
            width: "100%",
            padding: theme.spacing[3],
            backgroundColor: "white",
            border: `2px solid ${theme.colors.primary}`,
            borderRadius: theme.borderRadius.md,
            fontSize: theme.fonts.size.base,
            fontWeight: theme.fonts.weight.semibold,
            color: theme.colors.primary,
            cursor: "pointer",
            marginTop: theme.spacing[4],
            transition: `all ${theme.transitions.fast}`,
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = theme.focus.outline;
            e.currentTarget.style.outlineOffset = theme.focus.outlineOffset;
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = "none";
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.primary;
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.color = theme.colors.primary;
          }}
        >
          Clear All Filters
        </button>
      </aside>
    </>
  );
}

function FilterSection({ title, children }) {
  return (
    <fieldset
      style={{
        marginBottom: theme.spacing[6],
        padding: theme.spacing[4],
        backgroundColor: "white",
        borderRadius: theme.borderRadius.md,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <legend
        style={{
          fontSize: theme.fonts.size.lg,
          fontWeight: theme.fonts.weight.semibold,
          marginBottom: theme.spacing[3],
          color: theme.colors.primary,
          padding: `0 ${theme.spacing[2]}`,
        }}
      >
        {title}
      </legend>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing[3],
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
        fontSize: theme.fonts.size.sm,
        padding: theme.spacing[2],
        borderRadius: theme.borderRadius.sm,
        transition: `background-color ${theme.transitions.fast}`,
        backgroundColor: checked
          ? `${theme.colors.primaryLight}15`
          : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!checked) {
          e.currentTarget.style.backgroundColor = theme.colors.surface;
        }
      }}
      onMouseLeave={(e) => {
        if (!checked) {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          marginRight: theme.spacing[2],
          width: "18px",
          height: "18px",
          cursor: "pointer",
          accentColor: theme.colors.primary,
        }}
      />
      <span
        style={{
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

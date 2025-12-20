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
    backgroundColor: theme.colors.background,
    borderRight: `1px solid ${theme.colors.border}`,
    overflowY: "auto",
    padding: theme.spacing[4],
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
        <h2
          style={{
            fontSize: theme.fonts.size["2xl"],
            fontWeight: theme.fonts.weight.semibold,
            marginBottom: theme.spacing[6],
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
            checked={filters.insurance.has("medicaid")}
            onChange={() => handleCheckbox("insurance", "medicaid")}
          />
          <Checkbox
            label="Accepts Medicare"
            checked={filters.insurance.has("medicare")}
            onChange={() => handleCheckbox("insurance", "medicare")}
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
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.sm,
            fontSize: theme.fonts.size.sm,
            fontWeight: theme.fonts.weight.medium,
            color: theme.colors.textPrimary,
            cursor: "pointer",
            marginTop: theme.spacing[4],
          }}
        >
          Clear Filters
        </button>
      </aside>
    </>
  );
}

function FilterSection({ title, children }) {
  return (
    <div style={{ marginBottom: theme.spacing[6] }}>
      <h3
        style={{
          fontSize: theme.fonts.size.base,
          fontWeight: theme.fonts.weight.semibold,
          marginBottom: theme.spacing[3],
          color: theme.colors.textPrimary,
        }}
      >
        {title}
      </h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing[2],
        }}
      >
        {children}
      </div>
    </div>
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
        }}
      />
      {label}
    </label>
  );
}

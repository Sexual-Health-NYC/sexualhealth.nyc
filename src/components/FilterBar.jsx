import { useState, useRef, useEffect } from "react";
import useAppStore from "../store/useAppStore";
import theme from "../theme";

export default function FilterBar() {
  const { filters, setFilter, clearFilters } = useAppStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = {
    services: useRef(null),
    insurance: useRef(null),
    boroughs: useRef(null),
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && dropdownRefs[openDropdown].current) {
        if (!dropdownRefs[openDropdown].current.contains(event.target)) {
          setOpenDropdown(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  const handleCheckbox = (category, value) => {
    const newFilters = { ...filters };
    if (newFilters[category].has(value)) {
      newFilters[category].delete(value);
    } else {
      newFilters[category].add(value);
    }
    setFilter(category, new Set(newFilters[category]));
  };

  const getActiveFilterCount = () => {
    return (
      filters.services.size +
      filters.insurance.size +
      filters.access.size +
      filters.boroughs.size
    );
  };

  const removeFilter = (category, value) => {
    const newFilters = { ...filters };
    newFilters[category].delete(value);
    setFilter(category, new Set(newFilters[category]));
  };

  const serviceOptions = [
    { value: "sti_testing", label: "STI Testing" },
    { value: "hiv_testing", label: "HIV Testing" },
    { value: "prep", label: "PrEP" },
    { value: "pep", label: "PEP" },
    { value: "contraception", label: "Contraception" },
    { value: "abortion", label: "Abortion" },
  ];

  const insuranceOptions = [
    { value: "accepts_medicaid", label: "Accepts Medicaid" },
    { value: "accepts_medicare", label: "Accepts Medicare" },
    { value: "no_insurance_ok", label: "No Insurance Required" },
    { value: "sliding_scale", label: "Sliding Scale" },
  ];

  const boroughOptions = [
    { value: "Manhattan", label: "Manhattan" },
    { value: "Brooklyn", label: "Brooklyn" },
    { value: "Queens", label: "Queens" },
    { value: "Bronx", label: "Bronx" },
    { value: "Staten Island", label: "Staten Island" },
  ];

  const FilterDropdown = ({ name, title, options, category }) => {
    const isOpen = openDropdown === name;
    const activeCount = filters[category].size;

    return (
      <div
        ref={dropdownRefs[name]}
        style={{ position: "relative", display: "inline-block" }}
      >
        <button
          onClick={() => setOpenDropdown(isOpen ? null : name)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={`${title} filter${activeCount > 0 ? `, ${activeCount} selected` : ""}`}
          style={{
            padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
            backgroundColor: activeCount > 0 ? theme.colors.primary : "white",
            color: activeCount > 0 ? "white" : theme.colors.textPrimary,
            border: `2px solid ${activeCount > 0 ? theme.colors.primary : theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
            fontSize: theme.fonts.size.sm,
            fontWeight: theme.fonts.weight.medium,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: theme.spacing[2],
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = theme.focus.outline;
            e.currentTarget.style.outlineOffset = theme.focus.outlineOffset;
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = "none";
          }}
        >
          {title}
          {activeCount > 0 && (
            <span
              style={{
                backgroundColor: "white",
                color: theme.colors.primary,
                borderRadius: theme.borderRadius.full,
                padding: `0 ${theme.spacing[2]}`,
                fontSize: theme.fonts.size.xs,
                fontWeight: theme.fonts.weight.bold,
                minWidth: "20px",
                textAlign: "center",
              }}
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
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              backgroundColor: "white",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              boxShadow: theme.shadows.lg,
              padding: theme.spacing[2],
              minWidth: "220px",
              zIndex: 100,
            }}
          >
            {options.map((option) => (
              <label
                key={option.value}
                role="menuitemcheckbox"
                aria-checked={filters[category].has(option.value)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: theme.spacing[2],
                  cursor: "pointer",
                  borderRadius: theme.borderRadius.sm,
                  transition: `background-color ${theme.transitions.fast}`,
                  backgroundColor: filters[category].has(option.value)
                    ? `${theme.colors.primaryLight}15`
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!filters[category].has(option.value)) {
                    e.currentTarget.style.backgroundColor =
                      theme.colors.surface;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!filters[category].has(option.value)) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <input
                  type="checkbox"
                  checked={filters[category].has(option.value)}
                  onChange={() => handleCheckbox(category, option.value)}
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
                    fontSize: theme.fonts.size.sm,
                    fontWeight: filters[category].has(option.value)
                      ? theme.fonts.weight.medium
                      : theme.fonts.weight.normal,
                  }}
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

  const ActiveFilterPill = ({ category, value, label }) => (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: theme.spacing[2],
        padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
        backgroundColor: theme.colors.primaryLight,
        color: theme.colors.primary,
        borderRadius: theme.borderRadius.full,
        fontSize: theme.fonts.size.sm,
        fontWeight: theme.fonts.weight.medium,
      }}
    >
      {label}
      <button
        onClick={() => removeFilter(category, value)}
        aria-label={`Remove ${label} filter`}
        style={{
          background: "none",
          border: "none",
          color: theme.colors.primary,
          cursor: "pointer",
          fontSize: theme.fonts.size.base,
          padding: 0,
          display: "flex",
          alignItems: "center",
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = theme.focus.outline;
          e.currentTarget.style.outlineOffset = theme.focus.outlineOffset;
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = "none";
        }}
      >
        ×
      </button>
    </span>
  );

  // Desktop view
  if (!isMobile) {
    return (
      <div
        role="region"
        aria-label="Filter clinics"
        style={{
          borderBottom: `1px solid ${theme.colors.border}`,
          backgroundColor: "white",
          padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
        }}
      >
        {/* Top row: Logo and filter dropdowns */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing[4],
            marginBottom: theme.spacing[3],
          }}
        >
          <img
            src="/logo-horizontal.png"
            srcSet="/logo-horizontal.png 1x, /logo-horizontal@2x.png 2x, /logo-horizontal@3x.png 3x"
            alt="sexualhealth.nyc"
            style={{
              height: "40px",
              width: "auto",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: theme.spacing[3],
              flex: 1,
            }}
          >
            <FilterDropdown
              name="services"
              title="Services"
              options={serviceOptions}
              category="services"
            />
            <FilterDropdown
              name="insurance"
              title="Insurance & Cost"
              options={insuranceOptions}
              category="insurance"
            />
            <FilterDropdown
              name="boroughs"
              title="Borough"
              options={boroughOptions}
              category="boroughs"
            />
          </div>

          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearFilters}
              style={{
                padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                backgroundColor: "white",
                color: theme.colors.textSecondary,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.fonts.size.sm,
                fontWeight: theme.fonts.weight.medium,
                cursor: "pointer",
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = theme.focus.outline;
                e.currentTarget.style.outlineOffset = theme.focus.outlineOffset;
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = "none";
              }}
            >
              Clear All
            </button>
          )}
        </div>

        {/* Bottom row: Active filter pills */}
        {getActiveFilterCount() > 0 && (
          <div
            role="status"
            aria-live="polite"
            aria-label={`${getActiveFilterCount()} filters active`}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: theme.spacing[2],
            }}
          >
            {Array.from(filters.services).map((value) => (
              <ActiveFilterPill
                key={value}
                category="services"
                value={value}
                label={serviceOptions.find((o) => o.value === value)?.label}
              />
            ))}
            {Array.from(filters.insurance).map((value) => (
              <ActiveFilterPill
                key={value}
                category="insurance"
                value={value}
                label={insuranceOptions.find((o) => o.value === value)?.label}
              />
            ))}
            {filters.access.has("walk_in") && (
              <ActiveFilterPill
                category="access"
                value="walk_in"
                label="Walk-ins"
              />
            )}
            {Array.from(filters.boroughs).map((value) => (
              <ActiveFilterPill
                key={value}
                category="boroughs"
                value={value}
                label={value}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Mobile view
  return (
    <>
      {/* Mobile filter button */}
      <div
        style={{
          borderBottom: `1px solid ${theme.colors.border}`,
          backgroundColor: "white",
          padding: theme.spacing[3],
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing[3],
          }}
        >
          <img
            src="/logo-horizontal.png"
            srcSet="/logo-horizontal.png 1x, /logo-horizontal@2x.png 2x"
            alt="sexualhealth.nyc"
            style={{
              height: "30px",
              width: "auto",
            }}
          />
          <button
            onClick={() => setIsModalOpen(true)}
            aria-expanded={isModalOpen}
            aria-label={`Filters${getActiveFilterCount() > 0 ? `, ${getActiveFilterCount()} active` : ""}`}
            style={{
              flex: 1,
              padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
              backgroundColor: theme.colors.primary,
              color: "white",
              border: "none",
              borderRadius: theme.borderRadius.md,
              fontSize: theme.fonts.size.sm,
              fontWeight: theme.fonts.weight.medium,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: theme.spacing[2],
            }}
          >
            Filters
            {getActiveFilterCount() > 0 && (
              <span
                style={{
                  backgroundColor: "white",
                  color: theme.colors.primary,
                  borderRadius: theme.borderRadius.full,
                  padding: `2px ${theme.spacing[2]}`,
                  fontSize: theme.fonts.size.xs,
                  fontWeight: theme.fonts.weight.bold,
                  minWidth: "20px",
                }}
              >
                {getActiveFilterCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile filter modal (bottom sheet) */}
      {isModalOpen && (
        <>
          <div
            onClick={() => setIsModalOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            }}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filter options"
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "white",
              borderTopLeftRadius: theme.borderRadius.lg,
              borderTopRightRadius: theme.borderRadius.lg,
              maxHeight: "80vh",
              overflowY: "auto",
              zIndex: 1001,
              padding: theme.spacing[4],
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: theme.spacing[4],
              }}
            >
              <h2
                style={{
                  fontSize: theme.fonts.size.xl,
                  fontWeight: theme.fonts.weight.bold,
                  margin: 0,
                }}
              >
                Filters
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close filters"
                style={{
                  background: "none",
                  border: "none",
                  fontSize: theme.fonts.size["2xl"],
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>

            {/* Mobile filter sections */}
            <FilterSection title="Services">
              {serviceOptions.map((option) => (
                <Checkbox
                  key={option.value}
                  label={option.label}
                  checked={filters.services.has(option.value)}
                  onChange={() => handleCheckbox("services", option.value)}
                />
              ))}
            </FilterSection>

            <FilterSection title="Insurance & Cost">
              {insuranceOptions.map((option) => (
                <Checkbox
                  key={option.value}
                  label={option.label}
                  checked={filters.insurance.has(option.value)}
                  onChange={() => handleCheckbox("insurance", option.value)}
                />
              ))}
            </FilterSection>

            <FilterSection title="Availability">
              <Checkbox
                label="Walk-ins Accepted"
                checked={filters.access.has("walk_in")}
                onChange={() => handleCheckbox("access", "walk_in")}
              />
            </FilterSection>

            <FilterSection title="Borough">
              {boroughOptions.map((option) => (
                <Checkbox
                  key={option.value}
                  label={option.label}
                  checked={filters.boroughs.has(option.value)}
                  onChange={() => handleCheckbox("boroughs", option.value)}
                />
              ))}
            </FilterSection>

            <div
              style={{
                display: "flex",
                gap: theme.spacing[3],
                marginTop: theme.spacing[4],
              }}
            >
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={() => {
                    clearFilters();
                    setIsModalOpen(false);
                  }}
                  style={{
                    flex: 1,
                    padding: theme.spacing[3],
                    backgroundColor: "white",
                    color: theme.colors.textSecondary,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.fonts.size.base,
                    fontWeight: theme.fonts.weight.medium,
                    cursor: "pointer",
                  }}
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  flex: 1,
                  padding: theme.spacing[3],
                  backgroundColor: theme.colors.primary,
                  color: "white",
                  border: "none",
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.fonts.size.base,
                  fontWeight: theme.fonts.weight.medium,
                  cursor: "pointer",
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function FilterSection({ title, children }) {
  return (
    <fieldset
      style={{
        marginBottom: theme.spacing[4],
        padding: theme.spacing[3],
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        border: "none",
      }}
    >
      <legend
        style={{
          fontSize: theme.fonts.size.base,
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
          gap: theme.spacing[2],
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
        padding: theme.spacing[2],
        borderRadius: theme.borderRadius.sm,
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

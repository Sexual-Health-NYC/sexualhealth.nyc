import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import useAppStore from "../store/useAppStore";
import useFilterOptions from "../hooks/useFilterOptions";
import theme from "../theme";
import SubwayBullet from "./SubwayBullet";
import transitData from "../data/transitLines.json";
import FilterControls from "./FilterControls";

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
    clinics,
  } = useAppStore();
  const {
    serviceOptions,
    genderAffirmingOptions,
    prepOptions,
    insuranceOptions,
    boroughOptions,
    gestationalOptions,
  } = useFilterOptions();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const dropdownRefs = {
    services: useRef(null),
    genderAffirming: useRef(null),
    prep: useRef(null),
    insurance: useRef(null),
    boroughs: useRef(null),
    gestational: useRef(null),
  };

  // Get matching clinic suggestions
  const suggestions = filters.searchQuery.trim()
    ? clinics
        .filter((clinic) =>
          clinic.name
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase().trim()),
        )
        .slice(0, 10)
    : [];

  // Helper function to highlight matching text
  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase().trim();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) return text;

    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);

    return (
      <>
        {before}
        <strong style={{ fontWeight: theme.fonts.weight.bold }}>{match}</strong>
        {after}
      </>
    );
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

      if (
        showAutocomplete &&
        autocompleteRef.current &&
        searchInputRef.current &&
        !autocompleteRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowAutocomplete(false);
        setSelectedSuggestionIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown, showAutocomplete]);

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

  const getActiveFilterCount = () => {
    return (
      filters.services.size +
      (filters.genderAffirming?.size || 0) +
      (filters.prep?.size || 0) +
      filters.insurance.size +
      filters.access.size +
      filters.boroughs.size +
      (filters.gestationalWeeks !== null ? 1 : 0) +
      (filters.openNow ? 1 : 0) +
      (filters.openAfter5pm ? 1 : 0) +
      filters.subwayLines.size +
      filters.busRoutes.size +
      (filters.searchQuery.trim() ? 1 : 0)
    );
  };

  const removeFilter = (category, value) => {
    const newFilters = { ...filters };
    newFilters[category].delete(value);
    setFilter(category, new Set(newFilters[category]));
  };

  const FilterDropdown = ({ name, title, options, category }) => {
    const isOpen = openDropdown === name;
    const activeCount = filters[category].size;

    return (
      <div
        ref={dropdownRefs[name]}
        style={{
          position: "relative",
          display: "inline-block",
          transition: "transform 0.2s ease-out",
        }}
      >
        <button
          onClick={() => setOpenDropdown(isOpen ? null : name)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={`${title} filter${activeCount > 0 ? `, ${activeCount} selected` : ""}`}
          className={`filter-pill${activeCount > 0 ? " active" : ""}`}
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
              insetInlineStart: 0,
              backgroundColor: "white",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              boxShadow: theme.shadows.lg,
              padding: theme.spacing[2],
              minWidth: "220px",
              zIndex: 1000,
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
                    marginInlineEnd: theme.spacing[2],
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

  const GestationalDropdown = () => {
    const isOpen = openDropdown === "gestational";
    const hasFilter = filters.gestationalWeeks !== null;
    const currentLabel =
      gestationalOptions.find((o) => o.value === filters.gestationalWeeks)
        ?.label || t("gestational:weeksPregnant");

    return (
      <div
        ref={dropdownRefs.gestational}
        style={{
          position: "relative",
          display: "inline-block",
          transition: "transform 0.2s ease-out",
        }}
      >
        <button
          onClick={() => setOpenDropdown(isOpen ? null : "gestational")}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={`Gestational age filter${hasFilter ? `, ${currentLabel}` : ""}`}
          className={`filter-pill${hasFilter ? " active" : ""}`}
          style={{
            padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
            backgroundColor: hasFilter ? theme.colors.accent : "white",
            color: hasFilter ? "white" : theme.colors.textPrimary,
            border: `2px solid ${hasFilter ? theme.colors.accent : theme.colors.border}`,
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
          {hasFilter ? currentLabel : t("gestational:weeksPregnant")}
          <span aria-hidden="true">{isOpen ? "▲" : "▼"}</span>
        </button>

        {isOpen && (
          <div
            role="menu"
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              insetInlineStart: 0,
              backgroundColor: "white",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              boxShadow: theme.shadows.lg,
              padding: theme.spacing[2],
              minWidth: "200px",
              zIndex: 1000,
            }}
          >
            {gestationalOptions.map((option) => (
              <label
                key={option.value ?? "any"}
                role="menuitemradio"
                aria-checked={filters.gestationalWeeks === option.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: theme.spacing[2],
                  cursor: "pointer",
                  borderRadius: theme.borderRadius.sm,
                  transition: `background-color ${theme.transitions.fast}`,
                  backgroundColor:
                    filters.gestationalWeeks === option.value
                      ? `${theme.colors.accent}15`
                      : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (filters.gestationalWeeks !== option.value) {
                    e.currentTarget.style.backgroundColor =
                      theme.colors.surface;
                  }
                }}
                onMouseLeave={(e) => {
                  if (filters.gestationalWeeks !== option.value) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <input
                  type="radio"
                  name="gestational"
                  checked={filters.gestationalWeeks === option.value}
                  onChange={() => {
                    setGestationalWeeks(option.value);
                    setOpenDropdown(null);
                  }}
                  style={{
                    marginInlineEnd: theme.spacing[2],
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                    accentColor: theme.colors.accent,
                  }}
                />
                <span
                  style={{
                    fontSize: theme.fonts.size.sm,
                    fontWeight:
                      filters.gestationalWeeks === option.value
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

  const ActiveFilterPill = ({ category, value, label }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <span
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: theme.spacing[2],
          padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
          backgroundColor: isHovered ? "#e9d5ff" : "#f3e8ff",
          color: theme.colors.primaryDark,
          border: `1px solid ${isHovered ? theme.colors.primary : theme.colors.primaryLight}`,
          borderRadius: theme.borderRadius.full,
          fontSize: theme.fonts.size.sm,
          fontWeight: theme.fonts.weight.medium,
          transition: `all ${theme.transitions.fast}`,
          cursor: "default",
        }}
      >
        {label}
        <button
          onClick={() => removeFilter(category, value)}
          aria-label={`Remove ${label} filter`}
          style={{
            background: "none",
            border: "none",
            color: theme.colors.primaryDark,
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
  };

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
        {/* Top row: Logo, Search, Clear All, and Language */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing[3],
            marginBottom: theme.spacing[3],
          }}
        >
          <a href="/" style={{ display: "flex", flexShrink: 0 }}>
            <img
              src="/logo-horizontal.png"
              srcSet="/logo-horizontal.png 1x, /logo-horizontal@2x.png 2x, /logo-horizontal@3x.png 3x"
              alt="sexualhealth.nyc"
              width={187}
              height={40}
              fetchPriority="high"
              style={{
                height: "40px",
                width: "auto",
              }}
            />
          </a>

          <div style={{ flex: 1, maxWidth: "400px", position: "relative" }}>
            <input
              ref={searchInputRef}
              type="search"
              placeholder={t("messages:searchByName")}
              value={filters.searchQuery}
              onChange={(e) => {
                setFilter("searchQuery", e.target.value);
                setShowAutocomplete(true);
                setSelectedSuggestionIndex(-1);
              }}
              onKeyDown={(e) => {
                if (!showAutocomplete || suggestions.length === 0) return;

                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSelectedSuggestionIndex((prev) =>
                    prev < suggestions.length - 1 ? prev + 1 : prev,
                  );
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSelectedSuggestionIndex((prev) =>
                    prev > 0 ? prev - 1 : -1,
                  );
                } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
                  e.preventDefault();
                  setFilter(
                    "searchQuery",
                    suggestions[selectedSuggestionIndex].name,
                  );
                  setShowAutocomplete(false);
                  setSelectedSuggestionIndex(-1);
                } else if (e.key === "Escape") {
                  setShowAutocomplete(false);
                  setSelectedSuggestionIndex(-1);
                }
              }}
              aria-label="Search clinics by name"
              aria-autocomplete="list"
              aria-controls="search-autocomplete"
              aria-expanded={showAutocomplete && suggestions.length > 0}
              spellCheck="false"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              style={{
                width: "100%",
                padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                border: `2px solid ${filters.searchQuery.trim() ? theme.colors.primary : theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.fonts.size.sm,
                fontFamily: theme.fonts.family,
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = theme.focus.outline;
                e.currentTarget.style.outlineOffset = theme.focus.outlineOffset;
                e.currentTarget.style.borderColor = theme.colors.primary;
                if (filters.searchQuery.trim()) {
                  setShowAutocomplete(true);
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = "none";
                e.currentTarget.style.borderColor = filters.searchQuery.trim()
                  ? theme.colors.primary
                  : theme.colors.border;
              }}
            />

            {showAutocomplete && suggestions.length > 0 && (
              <div
                ref={autocompleteRef}
                id="search-autocomplete"
                role="listbox"
                style={{
                  position: "absolute",
                  top: "100%",
                  insetInlineStart: 0,
                  insetInlineEnd: 0,
                  marginTop: "4px",
                  backgroundColor: "white",
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.md,
                  boxShadow: theme.shadows.lg,
                  maxHeight: "300px",
                  overflowY: "auto",
                  zIndex: 1001,
                }}
              >
                {suggestions.map((clinic, index) => (
                  <div
                    key={clinic.id}
                    role="option"
                    aria-selected={index === selectedSuggestionIndex}
                    onClick={() => {
                      setFilter("searchQuery", clinic.name);
                      setShowAutocomplete(false);
                      setSelectedSuggestionIndex(-1);
                    }}
                    onMouseEnter={() => setSelectedSuggestionIndex(index)}
                    style={{
                      padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                      cursor: "pointer",
                      backgroundColor:
                        index === selectedSuggestionIndex
                          ? theme.colors.surface
                          : "white",
                      borderBottom:
                        index < suggestions.length - 1
                          ? `1px solid ${theme.colors.border}`
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        fontSize: theme.fonts.size.sm,
                        fontWeight: theme.fonts.weight.medium,
                        color: theme.colors.textPrimary,
                      }}
                    >
                      {highlightMatch(clinic.name, filters.searchQuery)}
                    </div>
                    {clinic.borough && (
                      <div
                        style={{
                          fontSize: theme.fonts.size.xs,
                          color: theme.colors.textSecondary,
                          marginTop: "2px",
                        }}
                      >
                        {clinic.borough}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearFilters}
              className="btn-interactive"
              style={{
                padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                backgroundColor: "white",
                color: theme.colors.textSecondary,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.fonts.size.sm,
                fontWeight: theme.fonts.weight.medium,
                cursor: "pointer",
                marginInlineStart: "auto",
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = theme.focus.outline;
                e.currentTarget.style.outlineOffset = theme.focus.outlineOffset;
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = "none";
              }}
            >
              {t("actions:clearAll")}
            </button>
          )}
        </div>

        {/* Filter dropdowns row */}
        <div
          style={{
            display: "flex",
            gap: theme.spacing[3],
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: getActiveFilterCount() > 0 ? theme.spacing[3] : 0,
          }}
        >
          <FilterDropdown
            name="services"
            title={t("sections:services")}
            options={serviceOptions}
            category="services"
          />
          {filters.services.has("gender_affirming") && (
            <FilterDropdown
              name="genderAffirming"
              title={t("filters:genderAffirmingCare")}
              options={genderAffirmingOptions}
              category="genderAffirming"
            />
          )}
          {filters.services.has("prep") && (
            <FilterDropdown
              name="prep"
              title={t("filters:prepServices")}
              options={prepOptions}
              category="prep"
            />
          )}
          {filters.services.has("abortion") && <GestationalDropdown />}
          <FilterDropdown
            name="insurance"
            title={t("sections:insuranceAndCost")}
            options={insuranceOptions}
            category="insurance"
          />
          <FilterDropdown
            name="boroughs"
            title={t("sections:borough")}
            options={boroughOptions}
            category="boroughs"
          />

          {/* Time filters */}
          <button
            onClick={() => setFilter("openNow", !filters.openNow)}
            className={`filter-pill${filters.openNow ? " active" : ""}`}
            style={{
              padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
              backgroundColor: filters.openNow ? theme.colors.open : "white",
              color: filters.openNow ? "white" : theme.colors.textPrimary,
              border: `2px solid ${filters.openNow ? theme.colors.open : theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.fonts.size.sm,
              fontWeight: theme.fonts.weight.medium,
              cursor: "pointer",
            }}
          >
            {t("messages:openNow")}
          </button>
          <button
            onClick={() => setFilter("openAfter5pm", !filters.openAfter5pm)}
            className={`filter-pill${filters.openAfter5pm ? " active" : ""}`}
            style={{
              padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
              backgroundColor: filters.openAfter5pm
                ? theme.colors.primary
                : "white",
              color: filters.openAfter5pm ? "white" : theme.colors.textPrimary,
              border: `2px solid ${filters.openAfter5pm ? theme.colors.primary : theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.fonts.size.sm,
              fontWeight: theme.fonts.weight.medium,
              cursor: "pointer",
            }}
          >
            {t("messages:openAfter5pm")}
          </button>

          {/* Subway filter */}
          <div style={{ minWidth: "180px" }}>
            <Select
              isMulti
              placeholder={t("messages:subway")}
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
                menu: (base) => ({
                  ...base,
                  zIndex: 1000,
                }),
              }}
            />
          </div>

          {/* Bus filter */}
          <div style={{ minWidth: "180px" }}>
            <Select
              isMulti
              placeholder={t("messages:bus")}
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
                menu: (base) => ({
                  ...base,
                  zIndex: 1000,
                }),
              }}
            />
          </div>
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
            {Array.from(filters.genderAffirming || []).map((value) => (
              <ActiveFilterPill
                key={`ga-${value}`}
                category="genderAffirming"
                value={value}
                label={
                  genderAffirmingOptions.find((o) => o.value === value)?.label
                }
              />
            ))}
            {Array.from(filters.prep || []).map((value) => (
              <ActiveFilterPill
                key={`prep-${value}`}
                category="prep"
                value={value}
                label={prepOptions.find((o) => o.value === value)?.label}
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
                label={t("messages:walkIns")}
              />
            )}
            {Array.from(filters.boroughs).map((value) => (
              <ActiveFilterPill
                key={value}
                category="boroughs"
                value={value}
                label={boroughOptions.find((o) => o.value === value)?.label}
              />
            ))}
            {filters.gestationalWeeks !== null && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: theme.spacing[2],
                  padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
                  backgroundColor: "#ffe9e9",
                  color: theme.colors.accent,
                  border: `1px solid ${theme.colors.accent}`,
                  borderRadius: theme.borderRadius.full,
                  fontSize: theme.fonts.size.sm,
                  fontWeight: theme.fonts.weight.medium,
                }}
              >
                {gestationalOptions.find(
                  (o) => o.value === filters.gestationalWeeks,
                )?.label || ""}
                <button
                  onClick={() => setGestationalWeeks(null)}
                  aria-label="Remove gestational filter"
                  style={{
                    background: "none",
                    border: "none",
                    color: theme.colors.accent,
                    cursor: "pointer",
                    fontSize: theme.fonts.size.base,
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  ×
                </button>
              </span>
            )}
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
          <a href="/" style={{ display: "flex" }}>
            <img
              src="/logo-horizontal.png"
              srcSet="/logo-horizontal.png 1x, /logo-horizontal@2x.png 2x"
              alt="sexualhealth.nyc"
              width={140}
              height={30}
              fetchPriority="high"
              style={{
                height: "30px",
                width: "auto",
              }}
            />
          </a>
          <button
            onClick={() => setIsModalOpen(true)}
            aria-expanded={isModalOpen}
            aria-label={`${t("actions:filters")}${getActiveFilterCount() > 0 ? `, ${getActiveFilterCount()} active` : ""}`}
            className="btn-interactive"
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
            {t("actions:filters")}
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
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              zIndex: 1000,
              pointerEvents: "none",
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
              maxHeight: "60vh",
              zIndex: 1001,
              display: "flex",
              flexDirection: "column",
              pointerEvents: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: theme.spacing[4],
                paddingBottom: theme.spacing[3],
                borderBottom: `1px solid ${theme.colors.border}`,
                flexShrink: 0,
              }}
            >
              <h2
                style={{
                  fontSize: theme.fonts.size.xl,
                  fontWeight: theme.fonts.weight.bold,
                  margin: 0,
                }}
              >
                {t("actions:filters")}
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

            <div
              style={{
                overflowY: "auto",
                flex: 1,
                padding: theme.spacing[4],
                paddingTop: theme.spacing[3],
              }}
            >
              <FilterControls mode="mobile" />
            </div>

            <div
              style={{
                display: "flex",
                gap: theme.spacing[3],
                padding: theme.spacing[4],
                paddingTop: theme.spacing[3],
                borderTop: `1px solid ${theme.colors.border}`,
                flexShrink: 0,
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
                  {t("actions:clearAll")}
                </button>
              )}
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn-interactive"
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
                {t("actions:apply")}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Map from "./components/Map";
import FilterBar from "./components/FilterBar";
import ClinicDetailPanel from "./components/ClinicDetailPanel";
import ClinicBottomSheet from "./components/ClinicBottomSheet";
import ClinicListView from "./components/ClinicListView";
import Footer from "./components/Footer";
import useAppStore from "./store/useAppStore";
import theme from "./theme";
import { getOpenStatus, isOpenAfter } from "./utils/hours";

export default function App() {
  const { t, i18n } = useTranslation(["messages", "actions"]);

  // Set document direction on mount and language change
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir(i18n.language);
  }, [i18n.language]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewMode, setViewMode] = useState("map"); // "map" or "list"
  const { clinics, filters, selectedClinic, selectClinic } = useAppStore();

  // Filter clinics based on active filters (shared between map and list views)
  const filteredClinics = useMemo(() => {
    return clinics.filter((clinic) => {
      // Search query: filter by clinic name
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const clinicName = clinic.name.toLowerCase();
        if (!clinicName.includes(query)) return false;
      }

      // Services: must have ALL selected services (AND logic)
      if (filters.services.size > 0) {
        const hasAllServices = Array.from(filters.services).every(
          (service) => clinic[`has_${service}`] === true,
        );
        if (!hasAllServices) return false;
      }

      // Gender Affirming filters
      if (filters.genderAffirming.size > 0) {
        const hasAllGAC = Array.from(filters.genderAffirming).every(
          (gacType) => clinic[`gender_affirming_${gacType}`] === true,
        );
        if (!hasAllGAC) return false;
      }

      // PrEP filters
      if (filters.prep.size > 0) {
        const hasAllPrep = Array.from(filters.prep).every(
          (prepType) => clinic[`prep_${prepType}`] === true,
        );
        if (!hasAllPrep) return false;
      }

      // Access Type filters (e.g., Virtual/Telehealth)
      if (filters.accessType.size > 0) {
        const hasAllAccessTypes = Array.from(filters.accessType).every(
          (accessType) => clinic[accessType] === true,
        );
        if (!hasAllAccessTypes) return false;
      }

      // Insurance: must have ANY selected insurance option (OR logic)
      if (filters.insurance.size > 0) {
        const hasAnyInsurance = Array.from(filters.insurance).some(
          (insuranceType) => clinic[insuranceType] === true,
        );
        if (!hasAnyInsurance) return false;
      }

      // Access
      if (filters.access.size > 0) {
        const hasAccess = Array.from(filters.access).some(
          (access) => clinic[access] === true,
        );
        if (!hasAccess) return false;
      }

      // Borough: must match if filter active
      if (filters.boroughs.size > 0) {
        if (!filters.boroughs.has(clinic.borough)) return false;
      }

      // Gestational age: filter abortion clinics by weeks
      if (filters.gestationalWeeks !== null) {
        // 99 means "beyond 24 weeks" - check checkbox OR procedure weeks > 24
        if (filters.gestationalWeeks === 99) {
          const hasBeyond24 =
            clinic.offers_late_term || clinic.abortion_procedure_max_weeks > 24;
          if (!hasBeyond24) return false;
        } else {
          // Check if clinic can serve this gestational age
          const medMax = clinic.abortion_medication_max_weeks;
          const procMax = clinic.abortion_procedure_max_weeks;
          // Clinic must have at least one method that covers the weeks
          const canServe =
            (medMax && medMax >= filters.gestationalWeeks) ||
            (procMax && procMax >= filters.gestationalWeeks);
          if (!canServe) return false;
        }
      }

      // Open now filter
      if (filters.openNow) {
        const status = getOpenStatus(clinic.hours);
        if (!status || !status.isOpen) return false;
      }

      // Open after 5pm filter
      if (filters.openAfter5pm) {
        if (!isOpenAfter(clinic.hours, 17)) return false;
      }

      // Subway lines filter (OR logic - clinic near ANY selected line)
      if (filters.subwayLines.size > 0 && clinic.transit) {
        const clinicLines = clinic.transit
          .split(",")
          .map((t) => {
            const match = t.trim().match(/^([A-Z0-9\/]+)\s+at/i);
            return match ? match[1].toUpperCase().split("/") : [];
          })
          .flat();
        const hasMatchingLine = Array.from(filters.subwayLines).some((line) =>
          clinicLines.includes(line),
        );
        if (!hasMatchingLine) return false;
      } else if (filters.subwayLines.size > 0) {
        return false; // No transit data but filter is active
      }

      // Bus routes filter (OR logic)
      if (filters.busRoutes.size > 0 && clinic.bus) {
        const clinicBuses = clinic.bus
          .split(",")
          .map((b) =>
            b.trim().split(" at ")[0].split("...")[0].trim().toUpperCase(),
          );
        const hasMatchingBus = Array.from(filters.busRoutes).some((route) =>
          clinicBuses.includes(route),
        );
        if (!hasMatchingBus) return false;
      } else if (filters.busRoutes.size > 0) {
        return false; // No bus data but filter is active
      }

      return true;
    });
  }, [clinics, filters]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Global Escape key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && selectedClinic) {
        e.preventDefault();
        e.stopPropagation();
        selectClinic(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    window.addEventListener("keydown", handleEscape, true);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("keydown", handleEscape, true);
    };
  }, [selectedClinic, selectClinic]);

  return (
    <div
      className="animate-fade-in"
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
        onFocus={(e) => {
          e.currentTarget.style.position = "absolute";
          e.currentTarget.style.width = "auto";
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.padding = theme.spacing[2];
          e.currentTarget.style.margin = "0";
          e.currentTarget.style.overflow = "visible";
          e.currentTarget.style.clip = "auto";
          e.currentTarget.style.whiteSpace = "normal";
          e.currentTarget.style.insetInlineStart = theme.spacing[2];
          e.currentTarget.style.top = theme.spacing[2];
          e.currentTarget.style.zIndex = "100";
          e.currentTarget.style.backgroundColor = theme.colors.primary;
          e.currentTarget.style.color = "white";
          e.currentTarget.style.textDecoration = "none";
        }}
        onBlur={(e) => {
          e.currentTarget.style.position = "absolute";
          e.currentTarget.style.width = "1px";
          e.currentTarget.style.height = "1px";
          e.currentTarget.style.padding = "0";
          e.currentTarget.style.margin = "-1px";
          e.currentTarget.style.overflow = "hidden";
          e.currentTarget.style.clip = "rect(0, 0, 0, 0)";
          e.currentTarget.style.whiteSpace = "nowrap";
        }}
      >
        {t("messages:skipToMain")}
      </a>

      {/* Visually hidden page title for screen readers */}
      <h1
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {t("messages:siteTitle")}
      </h1>

      <FilterBar />
      {/* Live region for screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {filteredClinics
          ? t("messages:clinicsFound", { count: filteredClinics.length })
          : ""}
      </div>

      <main
        id="main-content"
        aria-label="Main content"
        style={{ flex: 1, position: "relative" }}
      >
        {/* View toggle */}
        <div
          style={{
            position: "absolute",
            top: theme.spacing[4],
            left: theme.spacing[4],
            zIndex: 10,
            display: "flex",
            gap: theme.spacing[2],
          }}
        >
          <button
            onClick={() => setViewMode("map")}
            aria-pressed={viewMode === "map"}
            className="btn-interactive"
            style={{
              padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
              backgroundColor:
                viewMode === "map"
                  ? theme.colors.primary
                  : theme.colors.surface,
              color: viewMode === "map" ? "white" : theme.colors.textPrimary,
              border:
                viewMode === "map"
                  ? "none"
                  : `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.sm,
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
            {t("actions:map")}
          </button>
          <button
            onClick={() => setViewMode("list")}
            aria-pressed={viewMode === "list"}
            className="btn-interactive"
            style={{
              padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
              backgroundColor:
                viewMode === "list"
                  ? theme.colors.primary
                  : theme.colors.surface,
              color: viewMode === "list" ? "white" : theme.colors.textPrimary,
              border:
                viewMode === "list"
                  ? "none"
                  : `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.sm,
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
            {t("actions:list")}
          </button>
        </div>

        {/* Content */}
        {viewMode === "map" ? (
          <>
            <Map filteredClinics={filteredClinics} />
            {isMobile ? <ClinicBottomSheet /> : <ClinicDetailPanel />}
          </>
        ) : (
          <ClinicListView
            clinics={filteredClinics}
            onShowMap={() => setViewMode("map")}
          />
        )}
      </main>
      <Footer isMobile={isMobile} isMapMode={viewMode === "map"} />
    </div>
  );
}

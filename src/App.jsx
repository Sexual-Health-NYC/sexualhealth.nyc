import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Map from "./components/Map";
import FilterBar from "./components/FilterBar";
import ClinicDetailPanel from "./components/ClinicDetailPanel";
import ClinicBottomSheet from "./components/ClinicBottomSheet";
import ClinicListView from "./components/ClinicListView";
import useAppStore from "./store/useAppStore";
import theme from "./theme";

export default function App() {
  const { t } = useTranslation(["messages", "actions"]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewMode, setViewMode] = useState("map"); // "map" or "list"
  const { clinics, filters } = useAppStore();

  // Filter clinics based on active filters (shared between map and list views)
  const filteredClinics = useMemo(() => {
    return clinics.filter((clinic) => {
      // Services: must have ALL selected services (AND logic)
      if (filters.services.size > 0) {
        const hasAllServices = Array.from(filters.services).every(
          (service) => clinic[`has_${service}`] === true,
        );
        if (!hasAllServices) return false;
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
        // 99 means "late-term (20+ weeks)" - look for offers_late_term
        if (filters.gestationalWeeks === 99) {
          if (!clinic.offers_late_term) return false;
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

  return (
    <div
      className="animate-fade-in"
      style={{
        width: "100vw",
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
          left: "-9999px",
          zIndex: 100,
          padding: theme.spacing[2],
          backgroundColor: theme.colors.primary,
          color: "white",
          textDecoration: "none",
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = theme.spacing[2];
          e.currentTarget.style.top = theme.spacing[2];
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = "-9999px";
        }}
      >
        {t("messages:skipToMain")}
      </a>

      {/* Visually hidden page title for screen readers */}
      <h1
        style={{
          position: "absolute",
          left: "-10000px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        Sexual Health NYC - Find Clinics for STI Testing, HIV Testing, PrEP,
        PEP, Contraception, and Abortion Services
      </h1>

      <FilterBar />
      {/* Live region for screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          left: "-10000px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
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
          <ClinicListView clinics={filteredClinics} />
        )}
      </main>
    </div>
  );
}

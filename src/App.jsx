import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Map from "./components/Map";
import FilterBar from "./components/FilterBar";
import ClinicDetailPanel from "./components/ClinicDetailPanel";
import ClinicBottomSheet from "./components/ClinicBottomSheet";
import ClinicListView from "./components/ClinicListView";
import Footer from "./components/Footer";
import useAppStore from "./store/useAppStore";
import useIsMobile from "./hooks/useIsMobile";
import useEscapeKey from "./hooks/useEscapeKey";
import useFilteredClinics from "./hooks/useFilteredClinics";
import theme from "./theme";

export default function App() {
  const { t, i18n } = useTranslation(["messages", "actions"]);
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState("map");
  const { clinics, filters, selectedClinic, selectClinic } = useAppStore();

  const filteredClinics = useFilteredClinics(clinics, filters);

  // Set document direction on mount and language change
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir(i18n.language);
  }, [i18n, i18n.language]);

  // Global Escape key handler to close selected clinic
  const handleEscape = useCallback(() => {
    if (selectedClinic) {
      selectClinic(null);
    }
  }, [selectedClinic, selectClinic]);

  useEscapeKey(handleEscape, !!selectedClinic);

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
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-primary focus:text-white"
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
            <Map
              filteredClinics={filteredClinics}
              onShowList={() => setViewMode("list")}
            />
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

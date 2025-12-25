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
    <div className="animate-fade-in w-full h-screen flex flex-col">
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-primary focus:text-white focus:no-underline focus:top-2 focus:left-2"
      >
        {t("messages:skipToMain")}
      </a>

      {/* Visually hidden page title for screen readers */}
      <h1 className="sr-only">{t("messages:siteTitle")}</h1>

      <FilterBar />

      {/* Live region for screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {filteredClinics
          ? t("messages:clinicsFound", { count: filteredClinics.length })
          : ""}
      </div>

      <main
        id="main-content"
        aria-label="Main content"
        className="flex-1 relative"
      >
        {/* View toggle */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            onClick={() => setViewMode("map")}
            aria-pressed={viewMode === "map"}
            className={`btn-interactive px-3 py-2 rounded-sm text-sm font-medium cursor-pointer focus-ring ${
              viewMode === "map"
                ? "bg-primary text-white border-none"
                : "bg-surface text-text-primary border border-border"
            }`}
          >
            {t("actions:map")}
          </button>
          <button
            onClick={() => setViewMode("list")}
            aria-pressed={viewMode === "list"}
            className={`btn-interactive px-3 py-2 rounded-sm text-sm font-medium cursor-pointer focus-ring ${
              viewMode === "list"
                ? "bg-primary text-white border-none"
                : "bg-surface text-text-primary border border-border"
            }`}
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

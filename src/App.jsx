import { useState, useEffect } from "react";
import Map from "./components/Map";
import FilterSidebar from "./components/FilterSidebar";
import ClinicDetailPanel from "./components/ClinicDetailPanel";
import ClinicBottomSheet from "./components/ClinicBottomSheet";
import ClinicListView from "./components/ClinicListView";
import useAppStore from "./store/useAppStore";
import theme from "./theme";

export default function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewMode, setViewMode] = useState("map"); // "map" or "list"
  const { filteredClinics } = useAppStore();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex" }}>
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
        Skip to main content
      </a>

      <FilterSidebar />
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
            left: isMobile ? theme.spacing[20] : theme.spacing[4],
            zIndex: 10,
            display: "flex",
            gap: theme.spacing[2],
          }}
        >
          <button
            onClick={() => setViewMode("map")}
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
          >
            Map
          </button>
          <button
            onClick={() => setViewMode("list")}
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
          >
            List
          </button>
        </div>

        {/* Content */}
        {viewMode === "map" ? (
          <>
            <Map />
            {isMobile ? <ClinicBottomSheet /> : <ClinicDetailPanel />}
          </>
        ) : (
          <ClinicListView clinics={filteredClinics || []} />
        )}
      </main>
    </div>
  );
}

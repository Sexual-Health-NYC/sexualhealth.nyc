import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import MapGL, { NavigationControl } from "react-map-gl/mapbox";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import useAppStore from "../store/useAppStore";
import useIsMobile from "../hooks/useIsMobile";
import theme from "../theme";
import ClinicMarkers from "./ClinicMarkers";

// Enable RTL text support
if (mapboxgl.getRTLTextPluginStatus() === "unavailable") {
  mapboxgl.setRTLTextPlugin(
    "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
    null,
    true, // Lazy load
  );
}

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic2V4dWFsLWhlYWx0aC1ueWMiLCJhIjoiY21qZHF2ZTAyMDQ3aTNjb3MxbDFscWowZiJ9.BXuUrUio_grUlyoxU6WFBQ";

export default function Map({ filteredClinics, onShowList }) {
  const { t } = useTranslation(["messages"]);
  const {
    mapViewport,
    setMapViewport,
    setClinics,
    setVirtualClinics,
    virtualClinics,
    filters,
    selectedClinic,
    selectClinic,
    setMapRef,
  } = useAppStore();
  const mapRef = useRef();
  const isMobile = useIsMobile();
  const previousFilteredClinicsRef = useRef(filteredClinics);

  // Store map ref globally for cluster zoom animations
  // This is set via onLoad callback in MapGL component below

  // Set map padding based on device to account for UI overlays
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const updatePadding = () => {
      // Measure all possible UI overlays and use the largest
      let bottomPadding = 0;
      let rightPadding = 0;

      if (isMobile) {
        // Check for bottom sheet (clinic detail) or filter modal
        const bottomSheet = document.querySelector("[data-bottom-sheet]");
        const filterModal = document.querySelector("[data-filter-modal]");

        if (bottomSheet) {
          bottomPadding = Math.max(bottomPadding, bottomSheet.offsetHeight);
        }
        if (filterModal) {
          bottomPadding = Math.max(bottomPadding, filterModal.offsetHeight);
        }
      } else {
        // Desktop: measure sidebar width
        const sidebar = document.querySelector("[data-detail-panel]");
        if (sidebar) {
          rightPadding = sidebar.offsetWidth;
        }
      }

      const padding = isMobile
        ? { top: 0, bottom: bottomPadding, left: 0, right: 0 }
        : { top: 0, bottom: 0, left: 0, right: rightPadding };

      map.easeTo({ padding, duration: 300 });
    };

    // Delay to allow DOM elements to render
    const timeoutId = setTimeout(updatePadding, 100);

    return () => clearTimeout(timeoutId);
  }, [isMobile, selectedClinic]);

  useEffect(() => {
    // Load clinics data
    fetch("/clinics.geojson")
      .then((response) => response.json())
      .then((data) => {
        setClinics(
          data.features.map((feature) => ({
            id: feature.properties.id || feature.properties.name,
            ...feature.properties,
            latitude: feature.geometry.coordinates[1],
            longitude: feature.geometry.coordinates[0],
          })),
        );
      })
      .catch((error) => {
        console.error("Error loading clinics:", error);
      });

    // Load virtual clinics data
    fetch("/virtual-clinics.json")
      .then((response) => response.json())
      .then((data) => {
        setVirtualClinics(data.clinics || []);
      })
      .catch((error) => {
        console.error("Error loading virtual clinics:", error);
      });
  }, [setClinics, setVirtualClinics]);

  // Pan map when a clinic is selected to ensure marker is visible
  useEffect(() => {
    if (selectedClinic && mapRef.current) {
      const map = mapRef.current;

      // Define padding based on device and where the sidebar/bottom sheet appears
      const padding = isMobile
        ? {
            top: 50,
            bottom: window.innerHeight * 0.5 + 50,
            left: 50,
            right: 50,
          } // Bottom sheet on mobile (50vh + margin)
        : { top: 50, bottom: 50, left: 50, right: 450 }; // Sidebar on desktop (right side)

      // Pan to the selected clinic with smooth animation
      map.easeTo({
        center: [selectedClinic.longitude, selectedClinic.latitude],
        padding,
        duration: 500,
      });
    }
  }, [selectedClinic, isMobile]);

  // Count matching virtual clinics for banner
  const matchingVirtualClinics = virtualClinics.filter((clinic) => {
    if (!filters.services || filters.services.size === 0) return false;
    return Array.from(filters.services).some((service) => {
      if (service === "abortion") return clinic.has_abortion;
      if (service === "gender_affirming") return clinic.has_gender_affirming;
      if (service === "prep") return clinic.has_prep;
      if (service === "contraception") return clinic.has_contraception;
      if (service === "sti_testing") return clinic.has_sti_testing;
      return false;
    });
  });

  // Recenter map when filters change to fit visible clinics
  // Only auto-fit when the actual filter results change, not when selecting/deselecting clinics
  useEffect(() => {
    const filtersChanged =
      filteredClinics !== previousFilteredClinicsRef.current;

    if (filteredClinics.length > 0 && mapRef.current && filtersChanged) {
      // Calculate bounds of filtered clinics
      const lngs = filteredClinics.map((c) => c.longitude);
      const lats = filteredClinics.map((c) => c.latitude);

      const bounds = [
        [Math.min(...lngs), Math.min(...lats)], // Southwest
        [Math.max(...lngs), Math.max(...lats)], // Northeast
      ];

      // Fit map to bounds with padding that accounts for potential UI overlays
      const padding = isMobile
        ? { top: 80, bottom: 80, left: 50, right: 50 }
        : { top: 80, bottom: 80, left: 80, right: 480 };

      mapRef.current.fitBounds(bounds, {
        padding,
        duration: 1000,
        maxZoom: 14,
      });

      previousFilteredClinicsRef.current = filteredClinics;
    }
  }, [filteredClinics, isMobile]);

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%" }}
      role="application"
      aria-label="Interactive map of sexual health clinics in NYC. Use tab to navigate markers, or switch to list view for a text-based alternative."
    >
      <MapGL
        ref={mapRef}
        {...mapViewport}
        onMove={(evt) => setMapViewport(evt.viewState)}
        onLoad={() => setMapRef(mapRef)}
        onClick={() => {
          if (selectedClinic) {
            selectClinic(null);
          }
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
        keyboard={false}
      >
        <NavigationControl position="top-right" />
        <ClinicMarkers clinics={filteredClinics} />
      </MapGL>

      {/* Virtual/telehealth banner */}
      {matchingVirtualClinics.length > 0 && onShowList && !selectedClinic && (
        <button
          onClick={onShowList}
          style={{
            position: "fixed",
            bottom: isMobile ? "90px" : "20px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: theme.spacing[2],
            padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
            backgroundColor: "white",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.full,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            cursor: "pointer",
            fontSize: theme.fonts.size.sm,
            fontWeight: theme.fonts.weight.medium,
            color: theme.colors.textPrimary,
            whiteSpace: "nowrap",
            transition: `bottom ${theme.transitions.normal}`,
            zIndex: 25,
          }}
        >
          <span>💻</span>
          {t("messages:telehealthBanner", {
            count: matchingVirtualClinics.length,
            defaultValue: "{{count}} telehealth options — view in List",
          })}
        </button>
      )}
    </div>
  );
}

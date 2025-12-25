import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import MapGL, { NavigationControl } from "react-map-gl/mapbox";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import useAppStore from "../store/useAppStore";
import useIsMobile from "../hooks/useIsMobile";
import ClinicMarkers from "./ClinicMarkers";
import { filterVirtualClinicsByServices } from "../utils/virtualClinics";
import {
  MAP_PADDING,
  MAP_SELECTED_PADDING,
  MAP_ANIMATION,
} from "../constants/layout";

// Enable RTL text support
if (mapboxgl.getRTLTextPluginStatus() === "unavailable") {
  mapboxgl.setRTLTextPlugin(
    "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
    null,
    true,
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

  // Set map padding based on device to account for UI overlays
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const updatePadding = () => {
      let bottomPadding = 0;
      let rightPadding = 0;

      if (isMobile) {
        const bottomSheet = document.querySelector("[data-bottom-sheet]");
        const filterModal = document.querySelector("[data-filter-modal]");

        if (bottomSheet) {
          bottomPadding = Math.max(bottomPadding, bottomSheet.offsetHeight);
        }
        if (filterModal) {
          bottomPadding = Math.max(bottomPadding, filterModal.offsetHeight);
        }
      } else {
        const sidebar = document.querySelector("[data-detail-panel]");
        if (sidebar) {
          rightPadding = sidebar.offsetWidth;
        }
      }

      const padding = isMobile
        ? { top: 0, bottom: bottomPadding, left: 0, right: 0 }
        : { top: 0, bottom: 0, left: 0, right: rightPadding };

      map.easeTo({ padding, duration: MAP_ANIMATION.updatePadding });
    };

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

  // Pan map when a clinic is selected
  useEffect(() => {
    if (selectedClinic && mapRef.current) {
      const map = mapRef.current;
      const padding = isMobile
        ? {
            ...MAP_SELECTED_PADDING.mobile,
            bottom: window.innerHeight * 0.5 + MAP_SELECTED_PADDING.mobile.top,
          }
        : MAP_SELECTED_PADDING.desktop;

      map.easeTo({
        center: [selectedClinic.longitude, selectedClinic.latitude],
        padding,
        duration: MAP_ANIMATION.easeToCenter,
      });
    }
  }, [selectedClinic, isMobile]);

  // Count matching virtual clinics for banner
  const matchingVirtualClinics = filterVirtualClinicsByServices(
    virtualClinics,
    filters.services,
  );

  // Recenter map when filters change
  useEffect(() => {
    const filtersChanged =
      filteredClinics !== previousFilteredClinicsRef.current;

    if (filteredClinics.length > 0 && mapRef.current && filtersChanged) {
      const lngs = filteredClinics.map((c) => c.longitude);
      const lats = filteredClinics.map((c) => c.latitude);

      const bounds = [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ];

      const padding = isMobile ? MAP_PADDING.mobile : MAP_PADDING.desktop;

      mapRef.current.fitBounds(bounds, {
        padding,
        duration: MAP_ANIMATION.fitBounds,
        maxZoom: 14,
      });

      previousFilteredClinicsRef.current = filteredClinics;
    }
  }, [filteredClinics, isMobile]);

  return (
    <div
      className="relative w-full h-full"
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
      {matchingVirtualClinics.length > 0 && onShowList && (
        <button
          onClick={onShowList}
          data-telehealth-banner
          className={`fixed left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-full shadow-md cursor-pointer text-sm font-medium text-text-primary whitespace-nowrap transition-all hover:shadow-lg ${
            isMobile
              ? selectedClinic
                ? "bottom-[calc(50vh+16px)] z-[1002]" // Above bottom sheet (50vh height + gap)
                : "bottom-[90px] z-25"
              : selectedClinic
                ? "bottom-5 z-25"
                : "bottom-5 z-25"
          }`}
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

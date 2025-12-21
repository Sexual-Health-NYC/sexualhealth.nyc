import { useEffect, useRef, useState } from "react";
import MapGL, { NavigationControl } from "react-map-gl/mapbox";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import useAppStore from "../store/useAppStore";
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

export default function Map({ filteredClinics }) {
  const {
    mapViewport,
    setMapViewport,
    setClinics,
    selectedClinic,
    selectClinic,
    setMapRef,
  } = useAppStore();
  const mapRef = useRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const previousFilteredClinicsRef = useRef(filteredClinics);

  // Track window resize for mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Store map ref globally for cluster zoom animations
  useEffect(() => {
    if (mapRef.current) {
      setMapRef(mapRef);
    }
  }, [mapRef.current, setMapRef]);

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
  }, [setClinics]);

  // Pan map when a clinic is selected to ensure marker is visible
  useEffect(() => {
    if (selectedClinic && mapRef.current) {
      const map = mapRef.current;

      // Define padding based on device and where the sidebar/bottom sheet appears
      const padding = isMobile
        ? { top: 50, bottom: 350, left: 50, right: 50 } // Bottom sheet on mobile
        : { top: 50, bottom: 50, left: 50, right: 450 }; // Sidebar on desktop (right side)

      // Pan to the selected clinic with smooth animation
      map.easeTo({
        center: [selectedClinic.longitude, selectedClinic.latitude],
        padding,
        duration: 500,
      });
    }
  }, [selectedClinic, isMobile]);

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

      // Fit map to bounds with padding
      mapRef.current.fitBounds(bounds, {
        padding: { top: 100, bottom: 100, left: 100, right: 100 },
        duration: 1000,
        maxZoom: 14,
      });

      previousFilteredClinicsRef.current = filteredClinics;
    }
  }, [filteredClinics]);

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
    </div>
  );
}

import { useEffect, useMemo } from "react";
import MapGL, { NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import useAppStore from "../store/useAppStore";
import ClinicMarkers from "./ClinicMarkers";
import NearMeButton from "./NearMeButton";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoicG9sb25pa292IiwiYSI6ImNtNHl0ZWRrMjA0eDYybHNkMDdsMWl0dTUifQ.rD_LtOdVrKmEUH0tMIQTiA";

export default function Map() {
  const { mapViewport, setMapViewport, setClinics, clinics, filters } =
    useAppStore();

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

  // Filter clinics based on active filters
  const filteredClinics = useMemo(() => {
    return clinics.filter((clinic) => {
      // Services: must have ALL selected services (AND logic)
      if (filters.services.size > 0) {
        const hasAllServices = Array.from(filters.services).every(
          (service) => clinic[`has_${service}`] === true,
        );
        if (!hasAllServices) return false;
      }

      // Insurance: must have ANY selected insurance (OR logic)
      if (filters.insurance.size > 0) {
        const hasAnyInsurance = Array.from(filters.insurance).some(
          (insurance) => clinic[insurance] === true,
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

      return true;
    });
  }, [clinics, filters]);

  // Update store with filtered clinics for ClinicMarkers
  useEffect(() => {
    useAppStore.setState({ filteredClinics });
  }, [filteredClinics]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <MapGL
        {...mapViewport}
        onMove={(evt) => setMapViewport(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />
        <ClinicMarkers clinics={filteredClinics} />
      </MapGL>
      <NearMeButton />
    </div>
  );
}

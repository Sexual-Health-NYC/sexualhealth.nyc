import { useMemo } from "react";
import { Marker } from "react-map-gl/mapbox";
import useSupercluster from "use-supercluster";
import useAppStore from "../store/useAppStore";
import theme from "../theme";

export default function ClinicMarkers({ clinics }) {
  const { selectedClinic, selectClinic, mapViewport } = useAppStore();

  // Convert clinics to GeoJSON points
  const points = useMemo(
    () =>
      clinics.map((clinic) => ({
        type: "Feature",
        properties: {
          cluster: false,
          clinic,
        },
        geometry: {
          type: "Point",
          coordinates: [clinic.longitude, clinic.latitude],
        },
      })),
    [clinics],
  );

  // Get map bounds
  const bounds = useMemo(() => {
    // Approximate bounds from viewport
    return [
      mapViewport.longitude - 1,
      mapViewport.latitude - 1,
      mapViewport.longitude + 1,
      mapViewport.latitude + 1,
    ];
  }, [mapViewport]);

  const { clusters } = useSupercluster({
    points,
    bounds,
    zoom: mapViewport.zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  return (
    <>
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const {
          cluster: isCluster,
          point_count: pointCount,
          clinic,
        } = cluster.properties;

        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              longitude={longitude}
              latitude={latitude}
            >
              <div
                style={{
                  width: `${30 + (pointCount / points.length) * 40}px`,
                  height: `${30 + (pointCount / points.length) * 40}px`,
                  borderRadius: theme.borderRadius.full,
                  backgroundColor: theme.colors.primary,
                  border: `3px solid ${theme.colors.markerBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: theme.fonts.weight.bold,
                  fontSize: theme.fonts.size.sm,
                  cursor: "pointer",
                  boxShadow: theme.shadows.lg,
                }}
              >
                {pointCount}
              </div>
            </Marker>
          );
        }

        return (
          <Marker
            key={clinic.id}
            longitude={longitude}
            latitude={latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              selectClinic(clinic);
            }}
          >
            <div
              style={{
                width: selectedClinic?.id === clinic.id ? "48px" : "32px",
                height: selectedClinic?.id === clinic.id ? "48px" : "32px",
                backgroundColor:
                  selectedClinic?.id === clinic.id
                    ? theme.colors.markerSelected
                    : theme.colors.markerDefault,
                border: `3px solid ${theme.colors.markerBorder}`,
                borderRadius: theme.borderRadius.full,
                cursor: "pointer",
                transition: `all ${theme.transitions.base}`,
                boxShadow: theme.shadows.md,
              }}
              title={clinic.name}
            />
          </Marker>
        );
      })}
    </>
  );
}

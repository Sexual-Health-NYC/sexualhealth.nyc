import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Marker } from "react-map-gl/mapbox";
import useSupercluster from "use-supercluster";
import useAppStore from "../store/useAppStore";
import theme from "../theme";

export default function ClinicMarkers({ clinics }) {
  const { t } = useTranslation(["messages", "actions"]);
  const { selectedClinic, selectClinic, mapViewport, setMapViewport, mapRef } =
    useAppStore();

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

  const { clusters, supercluster } = useSupercluster({
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
              <button
                role="button"
                tabIndex={0}
                title={`${pointCount} clinics - ${t("actions:zoomIn")}`}
                aria-label={t("messages:cluster", { count: pointCount })}
                onClick={() => {
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    20,
                  );

                  // Use flyTo for smooth animation
                  if (mapRef?.current) {
                    mapRef.current.flyTo({
                      center: [longitude, latitude],
                      zoom: expansionZoom,
                      duration: 500,
                    });
                  } else {
                    // Fallback to direct viewport update
                    setMapViewport({
                      ...mapViewport,
                      longitude,
                      latitude,
                      zoom: expansionZoom,
                    });
                  }
                }}
                className="animate-scale-in"
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
                  transition: `transform ${theme.motion.duration.fast} ${theme.motion.easing.bounce}`,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = theme.focus.outline;
                  e.currentTarget.style.outlineOffset =
                    theme.focus.outlineOffset;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = "none";
                }}
              >
                {pointCount}
              </button>
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
            <button
              role="button"
              tabIndex={0}
              title={`${clinic.name} - ${t("actions:clickForInfo")}`}
              aria-label={t("messages:viewDetails", { name: clinic.name })}
              aria-pressed={selectedClinic?.id === clinic.id}
              className={
                selectedClinic?.id === clinic.id ? "marker-bounce" : ""
              }
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
                transition: `all ${theme.motion.duration.normal} ${theme.motion.easing.bounce}`,
                boxShadow:
                  selectedClinic?.id === clinic.id
                    ? theme.shadows.lg
                    : theme.shadows.md,
                padding: 0,
              }}
              onMouseEnter={(e) => {
                if (selectedClinic?.id !== clinic.id) {
                  e.currentTarget.style.transform = "scale(1.15)";
                  e.currentTarget.style.backgroundColor =
                    theme.colors.primaryLight;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedClinic?.id !== clinic.id) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.backgroundColor =
                    theme.colors.markerDefault;
                }
              }}
              onClick={() => selectClinic(clinic)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  selectClinic(clinic);
                }
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = theme.focus.outline;
                e.currentTarget.style.outlineOffset = theme.focus.outlineOffset;
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = "none";
              }}
            />
          </Marker>
        );
      })}
    </>
  );
}

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Marker } from "react-map-gl/mapbox";
import useSupercluster from "use-supercluster";
import useAppStore from "../store/useAppStore";

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
    options: { radius: 30, maxZoom: 20, minPoints: 3 },
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
          const size = 30 + (pointCount / points.length) * 40;
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
                className="animate-scale-in flex items-center justify-center rounded-full bg-primary border-[3px] border-white text-white font-bold text-sm cursor-pointer shadow-lg transition-transform hover:scale-110 focus-ring"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                }}
              >
                {pointCount}
              </button>
            </Marker>
          );
        }

        const isSelected = selectedClinic?.id === clinic.id;
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
              aria-pressed={isSelected}
              className={`rounded-full border-2 border-white cursor-pointer p-0 transition-all focus-ring ${
                isSelected
                  ? "w-9 h-9 bg-accent shadow-lg marker-bounce"
                  : "w-6 h-6 bg-primary shadow-md hover:scale-[1.15] hover:bg-primary-light"
              }`}
              onClick={() => selectClinic(clinic)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  selectClinic(clinic);
                }
              }}
            />
          </Marker>
        );
      })}
    </>
  );
}

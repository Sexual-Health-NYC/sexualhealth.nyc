import { useState } from "react";
import { useTranslation } from "react-i18next";
import useAppStore from "../store/useAppStore";

const DEFAULT_VIEWPORT = {
  longitude: -73.9712,
  latitude: 40.7831,
  zoom: 11,
};

export default function NearMeButton() {
  const { t } = useTranslation(["actions"]);
  const { setMapViewport } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReset = () => {
    setMapViewport(DEFAULT_VIEWPORT);
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      setError(t("actions:geolocationNotSupported"));
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapViewport({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
          zoom: 13,
        });
        setLoading(false);
      },
      (err) => {
        setError(t("actions:unableToGetLocation"));
        setLoading(false);
        console.error("Geolocation error:", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  };

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <button
        onClick={handleNearMe}
        disabled={loading}
        className="py-3 px-4 bg-primary text-white border-none rounded-sm text-sm font-medium cursor-pointer shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed focus-ring"
      >
        <span className="text-lg" aria-hidden="true">
          📍
        </span>
        {loading ? t("actions:finding") : t("actions:nearMe")}
      </button>
      <button
        onClick={handleReset}
        className="py-2 px-3 bg-surface text-text-primary border border-border rounded-sm text-sm font-medium cursor-pointer shadow-md focus-ring"
      >
        {t("actions:resetView")}
      </button>
      {error && (
        <div className="mt-2 p-2 bg-service-pep-text text-white rounded-sm text-xs text-center max-w-[200px]">
          {error}
        </div>
      )}
    </div>
  );
}

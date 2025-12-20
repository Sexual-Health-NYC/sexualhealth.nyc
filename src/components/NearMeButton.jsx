import { useState } from "react";
import useAppStore from "../store/useAppStore";
import theme from "../theme";

const DEFAULT_VIEWPORT = {
  longitude: -73.9712,
  latitude: 40.7831,
  zoom: 11,
};

export default function NearMeButton() {
  const { setMapViewport } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReset = () => {
    setMapViewport(DEFAULT_VIEWPORT);
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
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
        setError("Unable to get your location");
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
    <div
      style={{
        position: "absolute",
        top: theme.spacing[4],
        right: theme.spacing[4],
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing[2],
      }}
    >
      <button
        onClick={handleNearMe}
        disabled={loading}
        style={{
          padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
          backgroundColor: theme.colors.primary,
          color: "white",
          border: "none",
          borderRadius: theme.borderRadius.sm,
          fontSize: theme.fonts.size.sm,
          fontWeight: theme.fonts.weight.medium,
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: theme.shadows.md,
          opacity: loading ? 0.7 : 1,
          display: "flex",
          alignItems: "center",
          gap: theme.spacing[2],
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = theme.focus.outline;
          e.currentTarget.style.outlineOffset = theme.focus.outlineOffset;
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = "none";
        }}
      >
        <span style={{ fontSize: theme.fonts.size.lg }} aria-hidden="true">
          📍
        </span>
        {loading ? "Finding..." : "Near Me"}
      </button>
      <button
        onClick={handleReset}
        style={{
          padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
          backgroundColor: theme.colors.surface,
          color: theme.colors.textPrimary,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.sm,
          fontSize: theme.fonts.size.sm,
          fontWeight: theme.fonts.weight.medium,
          cursor: "pointer",
          boxShadow: theme.shadows.md,
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = theme.focus.outline;
          e.currentTarget.style.outlineOffset = theme.focus.outlineOffset;
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = "none";
        }}
      >
        Reset View
      </button>
      {error && (
        <div
          style={{
            marginTop: theme.spacing[2],
            padding: theme.spacing[2],
            backgroundColor: theme.colors.pep,
            color: "white",
            borderRadius: theme.borderRadius.sm,
            fontSize: theme.fonts.size.xs,
            textAlign: "center",
            maxWidth: "200px",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

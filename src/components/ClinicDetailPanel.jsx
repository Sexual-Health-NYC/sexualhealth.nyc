import { useEffect } from "react";
import useAppStore from "../store/useAppStore";
import theme from "../theme";
import ClinicDetails from "./clinic/ClinicDetails";

export default function ClinicDetailPanel() {
  const { selectedClinic, selectClinic } = useAppStore();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && selectedClinic) {
        e.preventDefault();
        e.stopPropagation();
        selectClinic(null);
      }
    };

    window.addEventListener("keydown", handleEscape, true);
    return () => window.removeEventListener("keydown", handleEscape, true);
  }, [selectedClinic, selectClinic]);

  if (!selectedClinic) return null;

  return (
    <div
      data-detail-panel
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "400px",
        height: "100%",
        backgroundColor: theme.colors.background,
        boxShadow: theme.shadows.lg,
        overflowY: "auto",
        zIndex: 10,
        animation: `slideInRight ${theme.motion.duration.slow} ${theme.motion.easing.gentle}`,
      }}
    >
      <ClinicDetails
        clinic={selectedClinic}
        onClose={() => selectClinic(null)}
      />
    </div>
  );
}

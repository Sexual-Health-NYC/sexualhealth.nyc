import { useRef, useEffect } from "react";
import useAppStore from "../store/useAppStore";
import theme from "../theme";
import ClinicDetails from "./clinic/ClinicDetails";

export default function ClinicBottomSheet() {
  const { selectedClinic, selectClinic } = useAppStore();
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

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

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    // Only allow dragging down
    if (diff > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const handleTouchEnd = () => {
    const diff = currentY.current - startY.current;

    if (sheetRef.current) {
      // If dragged down more than 100px, close the sheet
      if (diff > 100) {
        selectClinic(null);
      }
      // Reset position
      sheetRef.current.style.transform = "translateY(0)";
    }
  };

  return (
    <div
      ref={sheetRef}
      data-bottom-sheet
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: theme.borderRadius.lg,
        borderTopRightRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows.lg,
        maxHeight: "50vh",
        overflowY: "auto",
        zIndex: 20,
        transition: `transform ${theme.transitions.base}`,
        animation: `slideInUp ${theme.motion.duration.slow} ${theme.motion.easing.gentle}`,
      }}
    >
      {/* Drag handle */}
      <div
        style={{
          width: "40px",
          height: "4px",
          backgroundColor: theme.colors.border,
          borderRadius: theme.borderRadius.full,
          margin: `${theme.spacing[2]} auto`,
        }}
      />

      <ClinicDetails
        clinic={selectedClinic}
        onClose={() => selectClinic(null)}
      />
    </div>
  );
}

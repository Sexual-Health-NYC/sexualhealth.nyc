import { useRef, useCallback } from "react";
import useAppStore from "../store/useAppStore";
import useEscapeKey from "../hooks/useEscapeKey";
import ClinicDetails from "./clinic/ClinicDetails";

export default function ClinicBottomSheet() {
  const { selectedClinic, selectClinic } = useAppStore();
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleClose = useCallback(() => {
    selectClinic(null);
  }, [selectClinic]);

  useEscapeKey(handleClose, !!selectedClinic);

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
        handleClose();
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
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg shadow-lg max-h-[50vh] overflow-y-auto z-20 transition-transform duration-200 animate-slide-in-up"
      style={{ animation: "slideInUp 350ms cubic-bezier(0.4, 0, 0.2, 1)" }}
    >
      {/* Drag handle */}
      <div className="w-10 h-1 bg-border rounded-full mx-auto my-2" />

      <ClinicDetails clinic={selectedClinic} onClose={handleClose} />
    </div>
  );
}

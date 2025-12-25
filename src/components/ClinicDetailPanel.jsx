import { useCallback } from "react";
import useAppStore from "../store/useAppStore";
import useEscapeKey from "../hooks/useEscapeKey";
import ClinicDetails from "./clinic/ClinicDetails";

export default function ClinicDetailPanel() {
  const { selectedClinic, selectClinic } = useAppStore();

  const handleClose = useCallback(() => {
    selectClinic(null);
  }, [selectClinic]);

  useEscapeKey(handleClose, !!selectedClinic);

  if (!selectedClinic) return null;

  return (
    <div
      data-detail-panel
      onClick={(e) => e.stopPropagation()}
      className="absolute top-0 right-0 w-[400px] h-full bg-white shadow-lg overflow-y-auto z-10 animate-slide-in-right"
    >
      <ClinicDetails clinic={selectedClinic} onClose={handleClose} />
    </div>
  );
}

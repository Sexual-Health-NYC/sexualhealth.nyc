import { useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import useAppStore from "../store/useAppStore";
import ClinicDetails from "./clinic/ClinicDetails";

export default function ClinicBottomSheet() {
  const { selectedClinic, selectClinic } = useAppStore();
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleClose = () => selectClinic(null);

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
    <Dialog.Root
      open={!!selectedClinic}
      onOpenChange={(open) => !open && handleClose()}
    >
      <Dialog.Portal>
        {/* No overlay - we want to see the map behind */}
        <Dialog.Content
          ref={sheetRef}
          data-bottom-sheet
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg shadow-lg max-h-[50vh] overflow-y-auto z-20 transition-transform duration-200 data-[state=open]:animate-slide-in-up"
        >
          {/* Drag handle */}
          <div className="w-10 h-1 bg-border rounded-full mx-auto my-2" />

          <Dialog.Title className="sr-only">
            {selectedClinic?.name || "Clinic Details"}
          </Dialog.Title>
          <Dialog.Description asChild>
            <div>
              {selectedClinic && (
                <ClinicDetails clinic={selectedClinic} onClose={handleClose} />
              )}
            </div>
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

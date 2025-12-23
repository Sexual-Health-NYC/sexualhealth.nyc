import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useAppStore from "../store/useAppStore";
import theme from "../theme";
import CorrectionFormModal from "./CorrectionFormModal";
import ClinicStatusBadge from "./clinic/ClinicStatusBadge";
import ClinicServices from "./clinic/ClinicServices";
import ClinicAddress from "./clinic/ClinicAddress";
import ClinicHours from "./clinic/ClinicHours";
import ClinicContact from "./clinic/ClinicContact";
import ClinicInsurance from "./clinic/ClinicInsurance";
import ClinicVerificationBadge from "./clinic/ClinicVerificationBadge";

export default function ClinicBottomSheet() {
  const { t } = useTranslation(["actions", "forms"]);
  const { selectedClinic, selectClinic } = useAppStore();
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);
  const correctionFormRef = useRef(null);

  useEffect(() => {
    setShowCorrectionForm(false);
  }, [selectedClinic]);

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

      <div style={{ padding: theme.spacing[4] }}>
        {/* Header: Name + Status + Close */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: theme.spacing[3],
          }}
        >
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: theme.fonts.size.xl,
                fontWeight: theme.fonts.weight.semibold,
                color: theme.colors.textPrimary,
                margin: 0,
                lineHeight: 1.3,
                marginBottom: theme.spacing[2],
              }}
            >
              {selectedClinic.name}
            </h2>
            <ClinicStatusBadge clinic={selectedClinic} />
            <ClinicVerificationBadge clinic={selectedClinic} />
          </div>
          <button
            onClick={() => selectClinic(null)}
            style={{
              background: "none",
              border: "none",
              fontSize: theme.fonts.size.xl,
              color: theme.colors.textSecondary,
              cursor: "pointer",
              padding: 0,
              marginInlineStart: theme.spacing[2],
            }}
            aria-label={t("actions:close")}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: theme.spacing[3] }}>
          <ClinicServices clinic={selectedClinic} />
        </div>

        <div style={{ marginBottom: theme.spacing[3] }}>
          <ClinicAddress clinic={selectedClinic} />
        </div>

        <ClinicContact clinic={selectedClinic} />

        <ClinicHours clinic={selectedClinic} />

        <ClinicInsurance clinic={selectedClinic} />

        {/* Report Correction */}
        <div
          style={{
            paddingTop: theme.spacing[3],
            borderTop: `1px solid ${theme.colors.border}`,
          }}
        >
          <button
            onClick={() => {
              const willShow = !showCorrectionForm;
              setShowCorrectionForm(willShow);
              if (willShow) {
                setTimeout(() => {
                  correctionFormRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                  });
                }, 100);
              }
            }}
            style={{
              background: "none",
              border: "none",
              color: theme.colors.textSecondary,
              fontSize: theme.fonts.size.sm,
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline",
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = theme.focus.outline;
              e.currentTarget.style.outlineOffset = theme.focus.outlineOffset;
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
            }}
            aria-expanded={showCorrectionForm}
          >
            {showCorrectionForm
              ? t("forms:cancel")
              : t("actions:reportCorrection")}
          </button>

          <div ref={correctionFormRef}>
            <CorrectionFormModal
              clinicName={selectedClinic.name}
              onClose={() => setShowCorrectionForm(false)}
              isExpanded={showCorrectionForm}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

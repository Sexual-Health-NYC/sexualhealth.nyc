import { useState, useEffect } from "react";
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

export default function ClinicDetailPanel() {
  const { t } = useTranslation(["actions"]);
  const { selectedClinic, selectClinic } = useAppStore();
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);

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

  return (
    <div
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
              marginLeft: theme.spacing[2],
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

        <ClinicHours clinic={selectedClinic} />

        <ClinicInsurance clinic={selectedClinic} />

        <ClinicContact clinic={selectedClinic} />

        {/* Report Correction */}
        <div
          style={{
            marginTop: theme.spacing[4],
            paddingTop: theme.spacing[4],
            borderTop: `1px solid ${theme.colors.border}`,
          }}
        >
          <button
            onClick={() => setShowCorrectionForm(true)}
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
          >
            {t("actions:reportCorrection")}
          </button>
        </div>
      </div>

      {/* Correction Form Modal */}
      {showCorrectionForm && (
        <CorrectionFormModal
          clinicName={selectedClinic.name}
          onClose={() => setShowCorrectionForm(false)}
        />
      )}
    </div>
  );
}
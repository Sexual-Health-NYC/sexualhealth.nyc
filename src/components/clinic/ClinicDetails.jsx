import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import theme from "../../theme";
import CorrectionFormModal from "../CorrectionFormModal";
import ClinicStatusBadge from "./ClinicStatusBadge";
import ClinicServices from "./ClinicServices";
import ClinicAddress from "./ClinicAddress";
import ClinicHours from "./ClinicHours";
import ClinicContact from "./ClinicContact";
import ClinicInsurance from "./ClinicInsurance";
import ClinicVerificationBadge from "./ClinicVerificationBadge";

export default function ClinicDetails({ clinic, onClose }) {
  const { t } = useTranslation(["actions", "forms", "messages"]);
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);
  const correctionFormRef = useRef(null);

  return (
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
            {clinic.name}
          </h2>
          {/* Organization and clinic type */}
          {(clinic.organization || clinic.clinic_type) && (
            <p
              style={{
                margin: 0,
                marginBottom: theme.spacing[2],
                fontSize: theme.fonts.size.sm,
                color: theme.colors.textSecondary,
              }}
            >
              {clinic.organization}
              {clinic.organization && clinic.clinic_type && " · "}
              {clinic.clinic_type}
            </p>
          )}
          <ClinicStatusBadge clinic={clinic} />
          <ClinicVerificationBadge clinic={clinic} />
        </div>
        <button
          onClick={onClose}
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

      {/* Quick facts badges */}
      <QuickFactsBadges clinic={clinic} t={t} />

      <div style={{ marginBottom: theme.spacing[3] }}>
        <ClinicServices clinic={clinic} />
      </div>

      <div style={{ marginBottom: theme.spacing[3] }}>
        <ClinicAddress clinic={clinic} />
      </div>

      <ClinicContact clinic={clinic} />

      <ClinicHours clinic={clinic} />

      <ClinicInsurance clinic={clinic} />

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
            clinicName={clinic.name}
            onClose={() => setShowCorrectionForm(false)}
            isExpanded={showCorrectionForm}
          />
        </div>
      </div>
    </div>
  );
}

function QuickFactsBadges({ clinic, t }) {
  const badges = [];

  if (clinic.youth_friendly) {
    badges.push({
      label: t("messages:youthFriendly"),
      color: theme.colors.info,
      bg: `${theme.colors.info}15`,
    });
  }

  if (clinic.has_vaccines) {
    badges.push({
      label: t("messages:vaccinesAvailable"),
      color: theme.colors.open,
      bg: `${theme.colors.open}15`,
    });
  }

  if (badges.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: theme.spacing[2],
        marginBottom: theme.spacing[3],
      }}
    >
      {badges.map((badge) => (
        <span
          key={badge.label}
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
            backgroundColor: badge.bg,
            color: badge.color,
            borderRadius: theme.borderRadius.full,
            fontSize: theme.fonts.size.xs,
            fontWeight: theme.fonts.weight.medium,
          }}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}

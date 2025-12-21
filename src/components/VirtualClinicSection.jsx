import { useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "../theme";

export default function VirtualClinicSection({ clinics }) {
  const { t } = useTranslation(["sections", "actions"]);
  const [expanded, setExpanded] = useState(true);

  if (!clinics || clinics.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        marginBottom: theme.spacing[6],
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border}`,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: theme.spacing[4],
          backgroundColor: `${theme.colors.primary}08`,
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing[2],
          }}
        >
          <span style={{ fontSize: "1.25rem" }}>💻</span>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: theme.fonts.size.lg,
                fontWeight: theme.fonts.weight.semibold,
                color: theme.colors.textPrimary,
              }}
            >
              {t("sections:telehealthOptions", "Telehealth Options")}
            </h2>
            <p
              style={{
                margin: 0,
                marginTop: theme.spacing[1],
                fontSize: theme.fonts.size.sm,
                color: theme.colors.textSecondary,
              }}
            >
              {t(
                "sections:telehealthDescription",
                "Get abortion pills mailed to you — no in-person visit required",
              )}
            </p>
          </div>
        </div>
        <span
          style={{
            fontSize: "1.25rem",
            color: theme.colors.primary,
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: `transform ${theme.motion.duration.fast}`,
          }}
        >
          ▾
        </span>
      </button>

      {/* Content */}
      {expanded && (
        <div style={{ padding: theme.spacing[4], paddingTop: 0 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: theme.spacing[3],
              marginTop: theme.spacing[4],
            }}
          >
            {clinics.map((clinic) => (
              <VirtualClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function VirtualClinicCard({ clinic }) {
  const { t } = useTranslation(["actions"]);

  const safeWebsite = clinic.website?.startsWith("http")
    ? clinic.website
    : `https://${clinic.website}`;

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing[4],
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <h3
        style={{
          margin: 0,
          marginBottom: theme.spacing[2],
          fontSize: theme.fonts.size.base,
          fontWeight: theme.fonts.weight.semibold,
          color: theme.colors.textPrimary,
        }}
      >
        {clinic.name}
      </h3>

      {/* Features */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: theme.spacing[1],
          marginBottom: theme.spacing[3],
        }}
      >
        {clinic.medication_abortion && (
          <span
            style={{
              fontSize: theme.fonts.size.xs,
              padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
              backgroundColor: theme.colors.abortionBg,
              color: theme.colors.abortionText,
              borderRadius: theme.borderRadius.sm,
            }}
          >
            Abortion Pills
          </span>
        )}
        {clinic.abortion_medication_max_weeks && (
          <span
            style={{
              fontSize: theme.fonts.size.xs,
              padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
              backgroundColor: theme.colors.surfaceAlt,
              color: theme.colors.textSecondary,
              borderRadius: theme.borderRadius.sm,
            }}
          >
            Up to {clinic.abortion_medication_max_weeks} weeks
          </span>
        )}
        {clinic.sliding_scale && (
          <span
            style={{
              fontSize: theme.fonts.size.xs,
              padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
              backgroundColor: theme.colors.insuranceBg,
              color: theme.colors.insuranceText,
              borderRadius: theme.borderRadius.sm,
            }}
          >
            Sliding scale
          </span>
        )}
        {clinic.has_contraception && (
          <span
            style={{
              fontSize: theme.fonts.size.xs,
              padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
              backgroundColor: theme.colors.contraceptionBg,
              color: theme.colors.contraceptionText,
              borderRadius: theme.borderRadius.sm,
            }}
          >
            Contraception
          </span>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: theme.spacing[2], flexWrap: "wrap" }}>
        {clinic.website && (
          <a
            href={safeWebsite}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: theme.spacing[1],
              padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
              backgroundColor: theme.colors.primary,
              color: "white",
              borderRadius: theme.borderRadius.md,
              fontSize: theme.fonts.size.sm,
              fontWeight: theme.fonts.weight.medium,
              textDecoration: "none",
              transition: `background-color ${theme.motion.duration.fast}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
            }}
          >
            {t("actions:visitWebsite", "Visit Website")}
            <span style={{ fontSize: "0.75rem" }}>↗</span>
          </a>
        )}
        {clinic.phone && (
          <a
            href={`tel:${clinic.phone.replace(/[^\d+]/g, "")}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: theme.spacing[1],
              padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
              backgroundColor: theme.colors.surface,
              color: theme.colors.textPrimary,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.fonts.size.sm,
              fontWeight: theme.fonts.weight.medium,
              textDecoration: "none",
            }}
          >
            {clinic.phone}
          </a>
        )}
      </div>
    </div>
  );
}

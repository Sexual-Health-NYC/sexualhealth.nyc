import { useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "../theme";

// Generate description based on which services are being filtered
function getDescription(activeServices, t) {
  const services = Array.from(activeServices || []);

  if (services.includes("gender_affirming")) {
    return t(
      "sections:telehealthDescriptionGAC",
      "Access gender-affirming hormone therapy from home — informed consent, no gatekeeping",
    );
  }
  if (services.includes("abortion")) {
    return t(
      "sections:telehealthDescription",
      "Get abortion pills mailed to you — no in-person visit required",
    );
  }
  if (services.includes("prep")) {
    return t(
      "sections:telehealthDescriptionPrEP",
      "Start or continue PrEP from home with telehealth providers",
    );
  }
  // Default
  return t(
    "sections:telehealthDescriptionDefault",
    "Access care from home — no in-person visit required",
  );
}

export default function VirtualClinicSection({ clinics, activeServices }) {
  const { t } = useTranslation(["sections", "actions", "services"]);
  const [expanded, setExpanded] = useState(true);

  if (!clinics || clinics.length === 0) {
    return null;
  }

  const description = getDescription(activeServices, t);

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
              {description}
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
        {/* Gender Affirming Care badges */}
        {clinic.has_gender_affirming && (
          <span
            style={{
              fontSize: theme.fonts.size.xs,
              padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
              backgroundColor: theme.colors.gacBg || "#e8f5e9",
              color: theme.colors.gacText || "#2e7d32",
              borderRadius: theme.borderRadius.sm,
            }}
          >
            {t("services:genderAffirmingCare", "Gender-Affirming Care")}
          </span>
        )}
        {clinic.gender_affirming_hormones && (
          <span
            style={{
              fontSize: theme.fonts.size.xs,
              padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
              backgroundColor: theme.colors.gacBg || "#e8f5e9",
              color: theme.colors.gacText || "#2e7d32",
              borderRadius: theme.borderRadius.sm,
            }}
          >
            {t("services:hormoneTherapy", "Hormone Therapy")}
          </span>
        )}
        {clinic.gender_affirming_informed_consent && (
          <span
            style={{
              fontSize: theme.fonts.size.xs,
              padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
              backgroundColor: "#fff3e0",
              color: "#e65100",
              borderRadius: theme.borderRadius.sm,
            }}
          >
            {t("services:informedConsent", "Informed Consent")}
          </span>
        )}
        {/* Abortion badges */}
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
            {t("services:abortionPills", "Abortion Pills")}
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
            {t("services:upToWeeks", "Up to {{weeks}} weeks", {
              weeks: clinic.abortion_medication_max_weeks,
            })}
          </span>
        )}
        {/* PrEP badge */}
        {clinic.has_prep && (
          <span
            style={{
              fontSize: theme.fonts.size.xs,
              padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
              backgroundColor: theme.colors.prepBg || "#e3f2fd",
              color: theme.colors.prepText || "#1565c0",
              borderRadius: theme.borderRadius.sm,
            }}
          >
            {t("services:prep", "PrEP")}
          </span>
        )}
        {/* Insurance/cost badges */}
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
            {t("services:slidingScale", "Sliding scale")}
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
            {t("services:contraception", "Contraception")}
          </span>
        )}
        {/* LGBTQ+ focused badge */}
        {clinic.lgbtq_focused && (
          <span
            style={{
              fontSize: theme.fonts.size.xs,
              padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
              backgroundColor: "#f3e5f5",
              color: "#7b1fa2",
              borderRadius: theme.borderRadius.sm,
            }}
          >
            {t("services:lgbtqFocused", "LGBTQ+ Focused")}
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

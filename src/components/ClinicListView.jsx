import { useState } from "react";
import { useTranslation } from "react-i18next";
import useAppStore from "../store/useAppStore";
import theme from "../theme";
import CorrectionFormModal from "./CorrectionFormModal";
import ClinicStatusBadge from "./clinic/ClinicStatusBadge";
import ClinicServices from "./clinic/ClinicServices";
import ClinicAddress from "./clinic/ClinicAddress";
import ClinicHours from "./clinic/ClinicHours";
import ClinicContact from "./clinic/ClinicContact";
import ClinicQuickFacts from "./clinic/ClinicQuickFacts";
import VirtualClinicSection from "./VirtualClinicSection";

export default function ClinicListView({ clinics, onShowMap }) {
  const { t } = useTranslation(["messages", "actions"]);
  const { selectClinic, setMapViewport, virtualClinics, filters } =
    useAppStore();
  const [expandedId, setExpandedId] = useState(null);

  // Show virtual clinics when abortion is in the filter
  const showVirtualClinics = filters.services.has("abortion");

  if (
    clinics.length === 0 &&
    !(showVirtualClinics && virtualClinics.length > 0)
  ) {
    return (
      <div
        style={{
          padding: theme.spacing[8],
          textAlign: "center",
          color: theme.colors.textSecondary,
          fontSize: theme.fonts.size.lg,
        }}
      >
        <p style={{ margin: 0 }}>{t("messages:noMatches")}</p>
        <p style={{ margin: theme.spacing[2], fontSize: theme.fonts.size.sm }}>
          {t("messages:tryAdjustingFilters")}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: theme.spacing[4],
        paddingTop: "60px",
        backgroundColor: theme.colors.surface,
      }}
    >
      {/* Virtual/Telehealth clinics section - shown when abortion is filtered */}
      {showVirtualClinics && virtualClinics.length > 0 && (
        <VirtualClinicSection clinics={virtualClinics} />
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: theme.spacing[4],
          alignItems: "start",
        }}
      >
        {clinics.map((clinic) => (
          <ClinicCard
            key={clinic.id}
            clinic={clinic}
            expanded={expandedId === clinic.id}
            onToggle={() =>
              setExpandedId(expandedId === clinic.id ? null : clinic.id)
            }
            onShowOnMap={() => {
              selectClinic(clinic);
              setMapViewport({
                longitude: clinic.longitude,
                latitude: clinic.latitude,
                zoom: 15,
              });
              onShowMap();
            }}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}

function ClinicCard({ clinic, expanded, onToggle, onShowOnMap, t }) {
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      aria-expanded={expanded}
      aria-label={t("messages:viewDetails", { name: clinic.name })}
      style={{
        backgroundColor: "white",
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing[4],
        cursor: "pointer",
        boxShadow: expanded
          ? "0 8px 24px rgba(123, 44, 191, 0.18)"
          : "0 2px 8px rgba(123, 44, 191, 0.08)",
        transition: `all ${theme.motion.duration.normal} ${theme.motion.easing.gentle}`,
        border: `2px solid ${expanded ? theme.colors.primary : theme.colors.border}`,
      }}
      onMouseEnter={(e) => {
        if (!expanded) {
          e.currentTarget.style.boxShadow =
            "0 8px 20px rgba(123, 44, 191, 0.15)";
          e.currentTarget.style.borderColor = theme.colors.primaryLight;
        }
      }}
      onMouseLeave={(e) => {
        if (!expanded) {
          e.currentTarget.style.boxShadow =
            "0 2px 8px rgba(123, 44, 191, 0.08)";
          e.currentTarget.style.borderColor = theme.colors.border;
        }
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: theme.spacing[2],
        }}
      >
        <h3
          style={{
            fontSize: theme.fonts.size.lg,
            fontWeight: theme.fonts.weight.semibold,
            color: theme.colors.textPrimary,
            margin: 0,
            flex: 1,
          }}
        >
          {clinic.name}
        </h3>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "28px",
            height: "28px",
            fontSize: "20px",
            color: theme.colors.primary,
            backgroundColor: `${theme.colors.primary}15`,
            borderRadius: theme.borderRadius.full,
            marginInlineStart: theme.spacing[2],
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: `transform ${theme.motion.duration.fast}`,
            flexShrink: 0,
          }}
        >
          ▾
        </span>
      </div>

      <div style={{ marginBottom: theme.spacing[2] }}>
        <ClinicStatusBadge clinic={clinic} />
      </div>

      <div style={{ marginBottom: theme.spacing[2] }}>
        <ClinicServices clinic={clinic} />
      </div>

      {!expanded && (
        <p
          style={{
            margin: 0,
            color: theme.colors.textSecondary,
            fontSize: theme.fonts.size.sm,
          }}
        >
          {clinic.borough}
        </p>
      )}

      {expanded && (
        <div
          style={{
            marginTop: theme.spacing[3],
            paddingTop: theme.spacing[3],
            borderTop: `1px solid ${theme.colors.border}`,
          }}
          onClick={(e) => e.stopPropagation()} // Stop click from toggling card
        >
          <div style={{ marginBottom: theme.spacing[3] }}>
            <ClinicAddress clinic={clinic} />
          </div>

          <div style={{ marginBottom: theme.spacing[3] }}>
            <ClinicQuickFacts clinic={clinic} />
          </div>

          <ClinicHours clinic={clinic} />

          <ClinicContact clinic={clinic} />

          {/* Report Correction */}
          <div
            style={{
              paddingBottom: theme.spacing[3],
              marginBottom: theme.spacing[3],
              borderBottom: `1px solid ${theme.colors.border}`,
            }}
          >
            <button
              onClick={() => setShowCorrectionForm(!showCorrectionForm)}
              style={{
                background: "none",
                border: "none",
                color: theme.colors.textSecondary,
                fontSize: theme.fonts.size.xs,
                cursor: "pointer",
                padding: 0,
                textDecoration: "underline",
              }}
            >
              {showCorrectionForm ? "Cancel" : t("actions:reportCorrection")}
            </button>
            <CorrectionFormModal
              clinicName={clinic.name}
              onClose={() => setShowCorrectionForm(false)}
              isExpanded={showCorrectionForm}
            />
          </div>

          <button
            onClick={onShowOnMap}
            style={{
              width: "100%",
              padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
              backgroundColor: theme.colors.primary,
              color: "white",
              border: "none",
              borderRadius: theme.borderRadius.md,
              fontSize: theme.fonts.size.sm,
              fontWeight: theme.fonts.weight.medium,
              cursor: "pointer",
              transition: `background-color ${theme.motion.duration.fast}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
            }}
          >
            {t("actions:showOnMap")}
          </button>
        </div>
      )}
    </div>
  );
}

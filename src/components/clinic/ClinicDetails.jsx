import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import CorrectionFormModal from "../CorrectionFormModal";
import ClinicStatusBadge from "./ClinicStatusBadge";
import ClinicServices from "./ClinicServices";
import ClinicAddress from "./ClinicAddress";
import ClinicHours from "./ClinicHours";
import ClinicContact from "./ClinicContact";
import ClinicInsurance from "./ClinicInsurance";
import ClinicVerificationBadge from "./ClinicVerificationBadge";

function QuickFactsBadges({ clinic, t }) {
  const badges = [];

  if (clinic.youth_friendly) {
    badges.push({
      label: t("messages:youthFriendly"),
      className: "bg-verified/15 text-verified",
    });
  }

  if (clinic.has_vaccines) {
    badges.push({
      label: t("messages:vaccinesAvailable"),
      className: "bg-open/15 text-open",
    });
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {badges.map((badge) => (
        <span
          key={badge.label}
          className={`inline-flex items-center py-1 px-3 rounded-full text-xs font-medium ${badge.className}`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}

export default function ClinicDetails({ clinic, onClose }) {
  const { t } = useTranslation(["actions", "forms", "messages"]);
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);
  const correctionFormRef = useRef(null);

  return (
    <div className="p-4">
      {/* Header: Name + Status + Close */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-text-primary m-0 leading-tight mb-2">
            {clinic.name}
          </h2>
          {/* Organization and clinic type */}
          {(clinic.organization || clinic.clinic_type) && (
            <p className="m-0 mb-2 text-sm text-text-secondary">
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
          className="bg-transparent border-none text-xl text-text-secondary cursor-pointer p-0 ms-2"
          aria-label={t("actions:close")}
        >
          ×
        </button>
      </div>

      {/* Quick facts badges */}
      <QuickFactsBadges clinic={clinic} t={t} />

      <div className="mb-3">
        <ClinicServices clinic={clinic} />
      </div>

      <div className="mb-3">
        <ClinicAddress clinic={clinic} />
      </div>

      <ClinicContact clinic={clinic} />

      <ClinicHours clinic={clinic} />

      <ClinicInsurance clinic={clinic} />

      {/* Report Correction */}
      <div className="pt-3 border-t border-border">
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
          className="bg-transparent border-none text-text-secondary text-sm cursor-pointer p-0 underline focus-ring"
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

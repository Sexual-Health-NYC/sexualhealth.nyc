import { useState } from "react";
import CorrectionFormModal from "./CorrectionFormModal";
import ClinicStatusBadge from "./clinic/ClinicStatusBadge";
import ClinicServices from "./clinic/ClinicServices";
import ClinicAddress from "./clinic/ClinicAddress";
import ClinicHours from "./clinic/ClinicHours";
import ClinicContact from "./clinic/ClinicContact";
import ClinicQuickFacts from "./clinic/ClinicQuickFacts";

export default function ClinicCard({
  clinic,
  expanded,
  onToggle,
  onShowOnMap,
  t,
}) {
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
      className={`bg-white rounded-lg p-4 cursor-pointer transition-all card-hover ${
        expanded
          ? "shadow-lg border-2 border-primary"
          : "shadow-sm border-2 border-border hover:border-primary-light"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-text-primary m-0 flex-1">
          {clinic.name}
        </h3>
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center w-8 h-8 text-2xl font-bold text-white bg-primary rounded-full ms-2 shrink-0 leading-none"
        >
          {expanded ? "−" : "+"}
        </span>
      </div>

      <div className="mb-2">
        <ClinicStatusBadge clinic={clinic} />
      </div>

      <div className="mb-2">
        <ClinicServices clinic={clinic} />
      </div>

      {!expanded && (
        <p className="m-0 text-text-secondary text-sm">{clinic.borough}</p>
      )}

      {expanded && (
        <div
          className="mt-3 pt-3 border-t border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-3">
            <ClinicAddress clinic={clinic} />
          </div>

          <div className="mb-3">
            <ClinicQuickFacts clinic={clinic} />
          </div>

          <ClinicHours clinic={clinic} />

          <ClinicContact clinic={clinic} />

          {/* Report Correction */}
          <div className="pb-3 mb-3 border-b border-border">
            <button
              onClick={() => setShowCorrectionForm(!showCorrectionForm)}
              className="bg-transparent border-none text-text-secondary text-xs cursor-pointer p-0 underline"
            >
              {showCorrectionForm
                ? t("actions:cancelCorrection")
                : t("actions:reportCorrection")}
            </button>
            <CorrectionFormModal
              clinicName={clinic.name}
              onClose={() => setShowCorrectionForm(false)}
              isExpanded={showCorrectionForm}
            />
          </div>

          <button
            onClick={onShowOnMap}
            className="w-full py-2 px-4 bg-primary text-white border-none rounded-md text-sm font-medium cursor-pointer transition-colors hover:bg-primary-dark"
          >
            {t("actions:showOnMap")}
          </button>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useTranslation } from "react-i18next";
import useAppStore from "../store/useAppStore";
import CorrectionFormModal from "./CorrectionFormModal";
import ClinicStatusBadge from "./clinic/ClinicStatusBadge";
import ClinicServices from "./clinic/ClinicServices";
import ClinicAddress from "./clinic/ClinicAddress";
import ClinicHours from "./clinic/ClinicHours";
import ClinicContact from "./clinic/ClinicContact";
import ClinicQuickFacts from "./clinic/ClinicQuickFacts";
import VirtualClinicSection from "./VirtualClinicSection";

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

export default function ClinicListView({ clinics, onShowMap }) {
  const { t } = useTranslation(["messages", "actions"]);
  const { selectClinic, setMapViewport, virtualClinics, filters } =
    useAppStore();
  const [expandedId, setExpandedId] = useState(null);

  // Filter virtual clinics based on selected service filters
  // Show virtual clinics section if any filtered service has virtual providers
  const filteredVirtualClinics = virtualClinics.filter((clinic) => {
    // If no service filters, don't show virtual section
    if (filters.services.size === 0) return false;

    // Check if virtual clinic offers any of the selected services
    return Array.from(filters.services).some((service) => {
      if (service === "abortion") return clinic.has_abortion;
      if (service === "gender_affirming") return clinic.has_gender_affirming;
      if (service === "prep") return clinic.has_prep;
      if (service === "contraception") return clinic.has_contraception;
      if (service === "sti_testing") return clinic.has_sti_testing;
      return false;
    });
  });

  const showVirtualClinics = filteredVirtualClinics.length > 0;

  if (
    clinics.length === 0 &&
    !(showVirtualClinics && filteredVirtualClinics.length > 0)
  ) {
    return (
      <div className="p-8 text-center text-text-secondary text-lg">
        <p className="m-0">{t("messages:noMatches")}</p>
        <p className="my-2 text-sm">{t("messages:tryAdjustingFilters")}</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 pt-[60px] bg-surface">
      {/* Virtual/Telehealth clinics section - shown when any matching service is filtered */}
      {showVirtualClinics && (
        <VirtualClinicSection
          clinics={filteredVirtualClinics}
          activeServices={filters.services}
        />
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 items-start">
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

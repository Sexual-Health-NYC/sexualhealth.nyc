import { useState } from "react";
import { useTranslation } from "react-i18next";
import useAppStore from "../store/useAppStore";
import ClinicCard from "./ClinicCard";
import VirtualClinicSection from "./VirtualClinicSection";
import { filterVirtualClinicsByServices } from "../utils/virtualClinics";

export default function ClinicListView({ clinics, onShowMap }) {
  const { t } = useTranslation(["messages", "actions"]);
  const { selectClinic, setMapViewport, virtualClinics, filters } =
    useAppStore();
  const [expandedId, setExpandedId] = useState(null);

  // Filter virtual clinics based on selected service filters
  const filteredVirtualClinics = filterVirtualClinicsByServices(
    virtualClinics,
    filters.services,
  );

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

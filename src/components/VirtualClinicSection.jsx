import { useState } from "react";
import { useTranslation } from "react-i18next";
import VirtualClinicCard from "./VirtualClinicCard";

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
    <div className="mb-6 bg-surface rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 bg-primary/5 border-none cursor-pointer text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">💻</span>
          <div>
            <h2 className="m-0 text-lg font-semibold text-text-primary">
              {t("sections:telehealthOptions", "Telehealth Options")}
            </h2>
            <p className="m-0 mt-1 text-sm text-text-secondary">
              {description}
            </p>
          </div>
        </div>
        <span
          className={`text-xl text-primary transition-transform ${
            expanded ? "rotate-180" : "rotate-0"
          }`}
        >
          ▾
        </span>
      </button>

      {/* Content */}
      {expanded && (
        <div className="p-4 pt-0">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 mt-4">
            {clinics.map((clinic) => (
              <VirtualClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

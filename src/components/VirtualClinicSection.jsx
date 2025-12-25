import { useState } from "react";
import { useTranslation } from "react-i18next";

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

function VirtualClinicCard({ clinic }) {
  const { t } = useTranslation(["actions", "services"]);

  const safeWebsite = clinic.website?.startsWith("http")
    ? clinic.website
    : `https://${clinic.website}`;

  return (
    <div className="bg-white rounded-md p-4 border border-border">
      <h3 className="m-0 mb-2 text-base font-semibold text-text-primary">
        {clinic.name}
      </h3>

      {/* Features */}
      <div className="flex flex-wrap gap-1 mb-3">
        {/* Gender Affirming Care badges */}
        {clinic.has_gender_affirming && (
          <span className="text-xs py-1 px-2 bg-green-100 text-green-800 rounded-sm">
            {t("services:genderAffirmingCare", "Gender-Affirming Care")}
          </span>
        )}
        {clinic.gender_affirming_hormones && (
          <span className="text-xs py-1 px-2 bg-green-100 text-green-800 rounded-sm">
            {t("services:hormoneTherapy", "Hormone Therapy")}
          </span>
        )}
        {clinic.gender_affirming_informed_consent && (
          <span className="text-xs py-1 px-2 bg-orange-100 text-orange-800 rounded-sm">
            {t("services:informedConsent", "Informed Consent")}
          </span>
        )}
        {/* Abortion badges */}
        {clinic.medication_abortion && (
          <span className="text-xs py-1 px-2 bg-service-abortion-bg text-service-abortion-text rounded-sm">
            {t("services:abortionPills", "Abortion Pills")}
          </span>
        )}
        {clinic.abortion_medication_max_weeks && (
          <span className="text-xs py-1 px-2 bg-surface text-text-secondary rounded-sm">
            {t("services:upToWeeks", "Up to {{weeks}} weeks", {
              weeks: clinic.abortion_medication_max_weeks,
            })}
          </span>
        )}
        {/* PrEP badge */}
        {clinic.has_prep && (
          <span className="text-xs py-1 px-2 bg-service-prep-bg text-service-prep-text rounded-sm">
            {t("services:prep", "PrEP")}
          </span>
        )}
        {/* Insurance/cost badges */}
        {clinic.sliding_scale && (
          <span className="text-xs py-1 px-2 bg-blue-100 text-blue-800 rounded-sm">
            {t("services:slidingScale", "Sliding scale")}
          </span>
        )}
        {clinic.has_contraception && (
          <span className="text-xs py-1 px-2 bg-service-contraception-bg text-service-contraception-text rounded-sm">
            {t("services:contraception", "Contraception")}
          </span>
        )}
        {/* LGBTQ+ focused badge */}
        {clinic.lgbtq_focused && (
          <span className="text-xs py-1 px-2 bg-purple-100 text-purple-800 rounded-sm">
            {t("services:lgbtqFocused", "LGBTQ+ Focused")}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        {clinic.website && (
          <a
            href={safeWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 py-2 px-3 bg-primary hover:bg-primary-dark text-white rounded-md text-sm font-medium no-underline transition-colors"
          >
            {t("actions:visitWebsite", "Visit Website")}
            <span className="text-xs">↗</span>
          </a>
        )}
        {clinic.phone && (
          <a
            href={`tel:${clinic.phone.replace(/[^\d+]/g, "")}`}
            className="inline-flex items-center gap-1 py-2 px-3 bg-surface text-text-primary border border-border rounded-md text-sm font-medium no-underline"
          >
            {clinic.phone}
          </a>
        )}
      </div>
    </div>
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

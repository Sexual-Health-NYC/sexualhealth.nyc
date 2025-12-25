import { useTranslation } from "react-i18next";

export default function VirtualClinicCard({ clinic }) {
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

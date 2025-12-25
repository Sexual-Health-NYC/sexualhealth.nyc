import { useTranslation } from "react-i18next";

export default function ClinicContact({ clinic }) {
  const { t } = useTranslation(["sections", "actions"]);

  if (!clinic.phone && !clinic.website) return null;

  return (
    <div className="mb-3">
      {clinic.phone && !clinic.phone.includes("@") && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">
            <span className="text-text-secondary">{t("sections:phone")}: </span>
            <a
              href={`tel:${clinic.phone}`}
              className="text-primary no-underline"
            >
              {clinic.phone}
            </a>
          </span>
          <a
            href={`tel:${clinic.phone}`}
            className="ms-auto py-1 px-3 bg-service-prep-text text-white no-underline rounded-sm text-xs font-medium"
          >
            {t("actions:callNow")}
          </a>
        </div>
      )}
      {clinic.website && (
        <div className="text-base">
          <span className="text-text-secondary">{t("sections:website")}: </span>
          <a
            href={
              clinic.website.startsWith("http")
                ? clinic.website
                : `https://${clinic.website}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary break-all"
          >
            {clinic.website
              .replace(/^https?:\/\//, "")
              .replace(/\/$/, "")
              .substring(0, 35)}
            {clinic.website.replace(/^https?:\/\//, "").length > 35
              ? "..."
              : ""}
          </a>
        </div>
      )}
    </div>
  );
}

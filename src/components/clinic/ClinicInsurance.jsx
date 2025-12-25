import { useTranslation } from "react-i18next";

function InfoItem({ text, highlight }) {
  return (
    <div
      className={`py-1 px-2 rounded-sm text-sm text-text-primary ${
        highlight ? "bg-surface" : "bg-transparent"
      }`}
    >
      ✓ {text}
    </div>
  );
}

export default function ClinicInsurance({ clinic }) {
  const { t } = useTranslation(["sections", "insurance", "messages"]);

  return (
    <div className="mb-6">
      <h3 className="text-base font-semibold text-text-primary mb-3">
        {t("sections:insuranceAndCost")}
      </h3>

      {!clinic.accepts_medicaid &&
      !clinic.accepts_medicare &&
      !clinic.no_insurance_ok &&
      !clinic.sliding_scale ? (
        <p className="m-0 text-text-secondary text-sm italic">
          {t("messages:unknownContactClinic")}
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {clinic.accepts_medicaid && (
            <InfoItem text={t("insurance:acceptsMedicaid")} />
          )}
          {clinic.accepts_medicare && (
            <InfoItem text={t("insurance:acceptsMedicare")} />
          )}
          {clinic.no_insurance_ok && (
            <InfoItem text={t("insurance:noInsuranceOk")} highlight />
          )}
          {clinic.sliding_scale && (
            <InfoItem text={t("insurance:slidingScale")} />
          )}
        </div>
      )}
    </div>
  );
}

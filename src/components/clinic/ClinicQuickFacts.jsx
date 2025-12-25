import { useTranslation } from "react-i18next";

export default function ClinicQuickFacts({ clinic }) {
  const { t } = useTranslation(["messages", "insurance", "filters"]);

  const quickFacts = [];
  if (clinic.walk_in) quickFacts.push(t("messages:walkIns"));
  if (clinic.no_insurance_ok) quickFacts.push(t("insurance:noInsuranceOk"));

  if (clinic.accepts_medicaid) {
    quickFacts.push(t("insurance:acceptsMedicaid"));
  }
  if (clinic.prep_ap_registered) {
    quickFacts.push(t("filters:prepAP"));
  }

  if (quickFacts.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-sm text-text-secondary">
      {quickFacts.map((fact) => (
        <span key={fact}>✓ {fact}</span>
      ))}
    </div>
  );
}

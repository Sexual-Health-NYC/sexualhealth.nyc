import { useTranslation } from "react-i18next";
import theme from "../../theme";

export default function ClinicQuickFacts({ clinic }) {
  const { t } = useTranslation(["messages", "insurance"]);

  const quickFacts = [];
  if (clinic.walk_in) quickFacts.push(t("messages:walkIns"));
  if (clinic.no_insurance_ok)
    quickFacts.push(t("insurance:noInsuranceOk"));
  
  if (clinic.accepts_medicaid) {
      quickFacts.push(t("insurance:acceptsMedicaid"));
  }
  if (clinic.prep_ap_registered) {
    quickFacts.push(t("filters:prepAP")); // Use filter namespace key
  }

  if (quickFacts.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: `${theme.spacing[1]} ${theme.spacing[3]}`,
        marginTop: theme.spacing[2],
        fontSize: theme.fonts.size.sm,
        color: theme.colors.textSecondary, // Slightly muted for list view
      }}
    >
      {quickFacts.map((fact) => (
        <span key={fact}>✓ {fact}</span>
      ))}
    </div>
  );
}

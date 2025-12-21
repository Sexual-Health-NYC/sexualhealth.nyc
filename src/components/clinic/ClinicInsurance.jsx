import { useTranslation } from "react-i18next";
import theme from "../../theme";

function InfoItem({ text, highlight }) {
  return (
    <div
      style={{
        padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
        backgroundColor: highlight ? theme.colors.surface : "transparent",
        borderRadius: theme.borderRadius.sm,
        fontSize: theme.fonts.size.sm,
        color: theme.colors.textPrimary,
      }}
    >
      ✓ {text}
    </div>
  );
}

export default function ClinicInsurance({ clinic }) {
  const { t } = useTranslation(["sections", "insurance", "messages"]);

  return (
    <div style={{ marginBottom: theme.spacing[6] }}>
      <h3
        style={{
          fontSize: theme.fonts.size.base,
          fontWeight: theme.fonts.weight.semibold,
          color: theme.colors.textPrimary,
          marginBottom: theme.spacing[3],
        }}
      >
        {t("sections:insuranceAndCost")}
      </h3>

      {!clinic.accepts_medicaid &&
      !clinic.accepts_medicare &&
      !clinic.no_insurance_ok &&
      !clinic.sliding_scale ? (
        <p
          style={{
            margin: 0,
            color: theme.colors.textSecondary,
            fontSize: theme.fonts.size.sm,
            fontStyle: "italic",
          }}
        >
          {t("messages:unknownContactClinic")}
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing[1],
          }}
        >
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

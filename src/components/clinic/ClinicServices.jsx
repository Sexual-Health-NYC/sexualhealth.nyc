import { useTranslation } from "react-i18next";
import theme from "../../theme";

export default function ClinicServices({ clinic }) {
  const { t } = useTranslation(["services", "filters"]);

  const services = [];
  if (clinic.has_sti_testing)
    services.push({
      label: t("services:stiTesting"),
      bgColor: theme.colors.stiTestingBg,
      textColor: theme.colors.stiTestingText,
    });
  if (clinic.has_hiv_testing)
    services.push({
      label: t("services:hivTesting"),
      bgColor: theme.colors.hivTestingBg,
      textColor: theme.colors.hivTestingText,
    });
  if (clinic.has_prep)
    services.push({
      label: t("services:prep"),
      bgColor: theme.colors.prepBg,
      textColor: theme.colors.prepText,
    });
  if (clinic.has_pep)
    services.push({
      label: t("services:pep"),
      bgColor: theme.colors.pepBg,
      textColor: theme.colors.pepText,
    });
  if (clinic.has_contraception)
    services.push({
      label: t("services:contraception"),
      bgColor: theme.colors.contraceptionBg,
      textColor: theme.colors.contraceptionText,
    });
  if (clinic.has_abortion)
    services.push({
      label: t("services:abortion"),
      bgColor: theme.colors.abortionBg,
      textColor: theme.colors.abortionText,
    });

  // New Gender-Affirming Care Services
  if (clinic.gender_affirming_youth)
    services.push({
      label: t("filters:genderAffirmingYouth"),
      bgColor: theme.colors.lgbtqBg,
      textColor: theme.colors.lgbtqText,
    });
  if (clinic.gender_affirming_hormones)
    services.push({
      label: t("filters:genderAffirmingHormones"),
      bgColor: theme.colors.lgbtqBg,
      textColor: theme.colors.lgbtqText,
    });
  if (clinic.gender_affirming_surgery)
    services.push({
      label: t("filters:genderAffirmingSurgery"),
      bgColor: theme.colors.lgbtqBg,
      textColor: theme.colors.lgbtqText,
    });

  // PrEP Types
  if (clinic.prep_starter)
    services.push({
      label: t("filters:prepStarter"),
      bgColor: theme.colors.prepBg,
      textColor: theme.colors.prepText,
    });
  if (clinic.prep_prescriber)
    services.push({
      label: t("filters:prepPrescriber"),
      bgColor: theme.colors.prepBg,
      textColor: theme.colors.prepText,
    });
  if (clinic.prep_ap_registered)
    services.push({
      label: t("filters:prepAP"),
      bgColor: theme.colors.prepBg,
      textColor: theme.colors.prepText,
    });

  if (services.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: theme.spacing[1],
      }}
    >
      {services.map(({ label, bgColor, textColor }) => (
        <span
          key={label}
          style={{
            padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
            backgroundColor: bgColor,
            color: textColor,
            borderRadius: theme.borderRadius.sm,
            fontSize: theme.fonts.size.sm,
            fontWeight: theme.fonts.weight.medium,
          }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

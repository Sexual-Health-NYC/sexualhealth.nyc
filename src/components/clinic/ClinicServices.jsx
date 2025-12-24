import { useTranslation } from "react-i18next";
import theme from "../../theme";

export default function ClinicServices({ clinic }) {
  const { t } = useTranslation(["services", "filters"]);

  const serviceConfig = [
    {
      field: "has_sti_testing",
      label: t("services:stiTesting"),
      bgColor: theme.colors.stiTestingBg,
      textColor: theme.colors.stiTestingText,
    },
    {
      field: "has_hiv_testing",
      label: t("services:hivTesting"),
      bgColor: theme.colors.hivTestingBg,
      textColor: theme.colors.hivTestingText,
    },
    {
      field: "has_prep",
      label: t("services:prep"),
      bgColor: theme.colors.prepBg,
      textColor: theme.colors.prepText,
    },
    {
      field: "has_pep",
      label: t("services:pep"),
      bgColor: theme.colors.pepBg,
      textColor: theme.colors.pepText,
    },
    {
      field: "has_contraception",
      label: t("services:contraception"),
      bgColor: theme.colors.contraceptionBg,
      textColor: theme.colors.contraceptionText,
    },
    {
      field: "has_abortion",
      label: t("services:abortion"),
      bgColor: theme.colors.abortionBg,
      textColor: theme.colors.abortionText,
    },
    {
      field: "gender_affirming_youth",
      label: t("filters:genderAffirmingYouth"),
      bgColor: theme.colors.lgbtqBg,
      textColor: theme.colors.lgbtqText,
    },
    {
      field: "gender_affirming_hormones",
      label: t("filters:genderAffirmingHormones"),
      bgColor: theme.colors.lgbtqBg,
      textColor: theme.colors.lgbtqText,
    },
    {
      field: "gender_affirming_informed_consent",
      label: t("filters:informedConsentHRT"),
      bgColor: theme.colors.lgbtqBg,
      textColor: theme.colors.lgbtqText,
    },
    {
      field: "gender_affirming_surgery",
      label: t("filters:genderAffirmingSurgery"),
      bgColor: theme.colors.lgbtqBg,
      textColor: theme.colors.lgbtqText,
    },
    {
      field: "gender_affirming_top_surgery",
      label: t("filters:topSurgery"),
      bgColor: theme.colors.lgbtqBg,
      textColor: theme.colors.lgbtqText,
    },
    {
      field: "gender_affirming_bottom_surgery",
      label: t("filters:bottomSurgery"),
      bgColor: theme.colors.lgbtqBg,
      textColor: theme.colors.lgbtqText,
    },
    {
      field: "gender_affirming_ffs",
      label: t("filters:facialFeminization"),
      bgColor: theme.colors.lgbtqBg,
      textColor: theme.colors.lgbtqText,
    },
    {
      field: "gender_affirming_fms",
      label: t("filters:facialMasculinization"),
      bgColor: theme.colors.lgbtqBg,
      textColor: theme.colors.lgbtqText,
    },
    {
      field: "gender_affirming_voice",
      label: t("filters:voiceTherapy"),
      bgColor: theme.colors.lgbtqBg,
      textColor: theme.colors.lgbtqText,
    },
    {
      field: "gender_affirming_electrolysis",
      label: t("filters:electrolysis"),
      bgColor: theme.colors.lgbtqBg,
      textColor: theme.colors.lgbtqText,
    },
    {
      field: "gender_affirming_laser",
      label: t("filters:laserHairRemoval"),
      bgColor: theme.colors.lgbtqBg,
      textColor: theme.colors.lgbtqText,
    },
    {
      field: "prep_starter",
      label: t("filters:prepStarter"),
      bgColor: theme.colors.prepBg,
      textColor: theme.colors.prepText,
    },
    {
      field: "prep_prescriber",
      label: t("filters:prepPrescriber"),
      bgColor: theme.colors.prepBg,
      textColor: theme.colors.prepText,
    },
    {
      field: "prep_ap_registered",
      label: t("filters:prepAP"),
      bgColor: theme.colors.prepBg,
      textColor: theme.colors.prepText,
    },
  ];

  const services = serviceConfig
    .filter((config) => clinic[config.field])
    .map(({ label, bgColor, textColor }) => ({ label, bgColor, textColor }));

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

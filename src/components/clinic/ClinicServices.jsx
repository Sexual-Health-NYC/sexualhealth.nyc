import { useTranslation } from "react-i18next";

export default function ClinicServices({ clinic }) {
  const { t } = useTranslation(["services", "filters"]);

  const serviceConfig = [
    {
      field: "has_sti_testing",
      label: t("services:stiTesting"),
      className: "bg-service-sti-bg text-service-sti-text",
    },
    {
      field: "has_hiv_testing",
      label: t("services:hivTesting"),
      className: "bg-service-hiv-bg text-service-hiv-text",
    },
    {
      field: "has_prep",
      label: t("services:prep"),
      className: "bg-service-prep-bg text-service-prep-text",
    },
    {
      field: "has_pep",
      label: t("services:pep"),
      className: "bg-service-pep-bg text-service-pep-text",
    },
    {
      field: "has_contraception",
      label: t("services:contraception"),
      className: "bg-service-contraception-bg text-service-contraception-text",
    },
    {
      field: "has_abortion",
      label: t("services:abortion"),
      className: "bg-service-abortion-bg text-service-abortion-text",
    },
    {
      field: "gender_affirming_youth",
      label: t("filters:genderAffirmingYouth"),
      className: "bg-service-lgbtq-bg text-service-lgbtq-text",
    },
    {
      field: "gender_affirming_hormones",
      label: t("filters:genderAffirmingHormones"),
      className: "bg-service-lgbtq-bg text-service-lgbtq-text",
    },
    {
      field: "gender_affirming_informed_consent",
      label: t("filters:informedConsentHRT"),
      className: "bg-service-lgbtq-bg text-service-lgbtq-text",
    },
    {
      field: "gender_affirming_surgery",
      label: t("filters:genderAffirmingSurgery"),
      className: "bg-service-lgbtq-bg text-service-lgbtq-text",
    },
    {
      field: "gender_affirming_top_surgery",
      label: t("filters:topSurgery"),
      className: "bg-service-lgbtq-bg text-service-lgbtq-text",
    },
    {
      field: "gender_affirming_bottom_surgery",
      label: t("filters:bottomSurgery"),
      className: "bg-service-lgbtq-bg text-service-lgbtq-text",
    },
    {
      field: "gender_affirming_ffs",
      label: t("filters:facialFeminization"),
      className: "bg-service-lgbtq-bg text-service-lgbtq-text",
    },
    {
      field: "gender_affirming_fms",
      label: t("filters:facialMasculinization"),
      className: "bg-service-lgbtq-bg text-service-lgbtq-text",
    },
    {
      field: "gender_affirming_voice",
      label: t("filters:voiceTherapy"),
      className: "bg-service-lgbtq-bg text-service-lgbtq-text",
    },
    {
      field: "gender_affirming_electrolysis",
      label: t("filters:electrolysis"),
      className: "bg-service-lgbtq-bg text-service-lgbtq-text",
    },
    {
      field: "gender_affirming_laser",
      label: t("filters:laserHairRemoval"),
      className: "bg-service-lgbtq-bg text-service-lgbtq-text",
    },
    {
      field: "prep_starter",
      label: t("filters:prepStarter"),
      className: "bg-service-prep-bg text-service-prep-text",
    },
    {
      field: "prep_prescriber",
      label: t("filters:prepPrescriber"),
      className: "bg-service-prep-bg text-service-prep-text",
    },
    {
      field: "prep_ap_registered",
      label: t("filters:prepAP"),
      className: "bg-service-prep-bg text-service-prep-text",
    },
  ];

  const services = serviceConfig
    .filter((config) => clinic[config.field])
    .map(({ label, className }) => ({ label, className }));

  if (services.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {services.map(({ label, className }) => (
        <span
          key={label}
          className={`py-1 px-2 rounded-sm text-sm font-medium ${className}`}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

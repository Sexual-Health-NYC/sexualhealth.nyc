import { useTranslation } from "react-i18next";

export default function useFilterOptions() {
  const { t } = useTranslation([
    "services",
    "insurance",
    "locations",
    "gestational",
  ]);

  const serviceOptions = [
    { value: "sti_testing", label: t("services:stiTesting") },
    { value: "hiv_testing", label: t("services:hivTesting") },
    { value: "prep", label: t("services:prep") },
    { value: "pep", label: t("services:pep") },
    { value: "contraception", label: t("services:contraception") },
    { value: "abortion", label: t("services:abortion") },
  ];

  const insuranceOptions = [
    { value: "accepts_medicaid", label: t("insurance:acceptsMedicaid") },
    { value: "accepts_medicare", label: t("insurance:acceptsMedicare") },
    { value: "no_insurance_ok", label: t("insurance:noInsuranceOk") },
    { value: "sliding_scale", label: t("insurance:slidingScale") },
  ];

  const boroughOptions = [
    { value: "Manhattan", label: t("locations:boroughs.Manhattan") },
    { value: "Brooklyn", label: t("locations:boroughs.Brooklyn") },
    { value: "Queens", label: t("locations:boroughs.Queens") },
    { value: "Bronx", label: t("locations:boroughs.Bronx") },
    { value: "Staten Island", label: t("locations:boroughs.Staten Island") },
  ];

  const gestationalOptions = [
    { value: null, label: t("gestational:any") },
    { value: 10, label: t("gestational:upTo10") },
    { value: 12, label: t("gestational:upTo12") },
    { value: 20, label: t("gestational:upTo20") },
    { value: 24, label: t("gestational:upTo24") },
    { value: 99, label: t("gestational:lateTerm") },
  ];

  return {
    serviceOptions,
    insuranceOptions,
    boroughOptions,
    gestationalOptions,
  };
}

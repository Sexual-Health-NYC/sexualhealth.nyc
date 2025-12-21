import { useTranslation } from "react-i18next";
import theme from "../../theme";

export default function ClinicContact({ clinic }) {
  const { t } = useTranslation(["sections", "actions"]);

  if (!clinic.phone && !clinic.website) return null;

  return (
    <div style={{ marginBottom: theme.spacing[3] }}>
      {clinic.phone && !clinic.phone.includes("@") && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing[2],
            marginBottom: theme.spacing[2],
          }}
        >
          <span style={{ fontSize: theme.fonts.size.base }}>
            <span style={{ color: theme.colors.textSecondary }}>
              {t("sections:phone")}:{" "}
            </span>
            <a
              href={`tel:${clinic.phone}`}
              style={{
                color: theme.colors.primary,
                textDecoration: "none",
              }}
            >
              {clinic.phone}
            </a>
          </span>
          <a
            href={`tel:${clinic.phone}`}
            style={{
              marginLeft: "auto",
              padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
              backgroundColor: theme.colors.prep,
              color: "white",
              textDecoration: "none",
              borderRadius: theme.borderRadius.sm,
              fontSize: theme.fonts.size.xs,
              fontWeight: theme.fonts.weight.medium,
            }}
          >
            {t("actions:callNow")}
          </a>
        </div>
      )}
      {clinic.website && (
        <div style={{ fontSize: theme.fonts.size.base }}>
          <span style={{ color: theme.colors.textSecondary }}>
            {t("sections:website")}:{" "}
          </span>
          <a
            href={
              clinic.website.startsWith("http")
                ? clinic.website
                : `https://${clinic.website}`
            }
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: theme.colors.primary,
              wordBreak: "break-all",
            }}
          >
            {clinic.website
              .replace(/^https?:\/\//, "")
              .replace(/\/$/, "")
              .substring(0, 35)}
            {clinic.website.replace(/^https?:\/\//, "").length > 35 ? "..." : ""}
          </a>
        </div>
      )}
    </div>
  );
}

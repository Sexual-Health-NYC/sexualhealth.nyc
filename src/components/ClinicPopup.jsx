import { Popup } from "react-map-gl";
import { useTranslation } from "react-i18next";
import useAppStore from "../store/useAppStore";
import theme from "../theme";
import { getOpenStatus } from "../utils/hours";

export default function ClinicPopup() {
  const { t } = useTranslation(["services", "sections", "messages", "dynamic"]);
  const { selectedClinic, selectClinic } = useAppStore();

  if (!selectedClinic) return null;

  const openStatus = getOpenStatus(
    selectedClinic.hours,
    selectedClinic.hours_text,
  );

  const services = [];
  if (selectedClinic.has_sti_testing) services.push(t("services:stiTesting"));
  if (selectedClinic.has_hiv_testing) services.push(t("services:hivTesting"));
  if (selectedClinic.has_prep) services.push(t("services:prep"));
  if (selectedClinic.has_pep) services.push(t("services:pep"));

  return (
    <Popup
      longitude={selectedClinic.longitude}
      latitude={selectedClinic.latitude}
      anchor="bottom"
      onClose={() => selectClinic(null)}
      closeOnClick={false}
      maxWidth="400px"
    >
      <div style={{ padding: theme.spacing[3], minWidth: "280px" }}>
        <h3
          style={{
            margin: `0 0 ${theme.spacing[2]} 0`,
            fontSize: theme.fonts.size.lg,
            fontWeight: theme.fonts.weight.semibold,
            color: theme.colors.textPrimary,
          }}
        >
          {selectedClinic.name}
        </h3>

        {services.length > 0 && (
          <div style={{ marginBottom: theme.spacing[3] }}>
            {services.map((service) => (
              <span
                key={service}
                style={{
                  display: "inline-block",
                  padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                  marginRight: theme.spacing[1],
                  marginBottom: theme.spacing[1],
                  fontSize: theme.fonts.size.xs,
                  backgroundColor: theme.colors.primary,
                  color: "white",
                  borderRadius: theme.borderRadius.sm,
                }}
              >
                {service}
              </span>
            ))}
          </div>
        )}

        <p
          style={{
            margin: `0 0 ${theme.spacing[2]} 0`,
            fontSize: theme.fonts.size.sm,
            color: theme.colors.textSecondary,
          }}
        >
          {selectedClinic.address}
        </p>

        {selectedClinic.phone && (
          <p
            style={{
              margin: `0 0 ${theme.spacing[2]} 0`,
              fontSize: theme.fonts.size.sm,
            }}
          >
            <strong>Phone:</strong>{" "}
            <a
              href={`tel:${selectedClinic.phone}`}
              style={{ color: theme.colors.prep }}
            >
              {selectedClinic.phone}
            </a>
          </p>
        )}

        {openStatus && (
          <p
            style={{
              margin: `0 0 ${theme.spacing[2]} 0`,
              fontSize: theme.fonts.size.sm,
            }}
          >
            <strong>{t("sections:hours")}:</strong>{" "}
            <span
              style={{
                color: openStatus.isOpen ? "#10b981" : "#64748b",
                fontWeight: theme.fonts.weight.medium,
              }}
            >
              {openStatus.isOpen
                ? openStatus.closesAt
                  ? t("messages:openClosesAt", { time: openStatus.closesAt })
                  : t("messages:openNow")
                : openStatus.status === "opensLater"
                  ? t("messages:opensToday", { time: openStatus.opensAt })
                  : openStatus.nextOpen
                    ? openStatus.nextOpen.time
                      ? t("messages:closedOpensDay", {
                          day: openStatus.nextOpen.day,
                          time: openStatus.nextOpen.time,
                        })
                      : t("messages:closedOpens", {
                          day: openStatus.nextOpen.day,
                        })
                    : t("messages:closed")}
            </span>
          </p>
        )}

        {selectedClinic.website && (
          <a
            href={
              selectedClinic.website.startsWith("http")
                ? selectedClinic.website
                : `https://${selectedClinic.website}`
            }
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: theme.spacing[2],
              padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
              backgroundColor: theme.colors.prep,
              color: "white",
              textDecoration: "none",
              borderRadius: theme.borderRadius.sm,
              fontSize: theme.fonts.size.sm,
              fontWeight: theme.fonts.weight.medium,
            }}
          >
            Visit Website
          </a>
        )}
      </div>
    </Popup>
  );
}

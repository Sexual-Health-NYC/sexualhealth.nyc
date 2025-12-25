import { Popup } from "react-map-gl";
import { useTranslation } from "react-i18next";
import useAppStore from "../store/useAppStore";
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
      <div className="p-3 min-w-[280px]">
        <h3 className="m-0 mb-2 text-lg font-semibold text-text-primary">
          {selectedClinic.name}
        </h3>

        {services.length > 0 && (
          <div className="mb-3">
            {services.map((service) => (
              <span
                key={service}
                className="inline-block py-1 px-2 me-1 mb-1 text-xs bg-primary text-white rounded-sm"
              >
                {service}
              </span>
            ))}
          </div>
        )}

        <p className="m-0 mb-2 text-sm text-text-secondary">
          {selectedClinic.address}
        </p>

        {selectedClinic.phone && (
          <p className="m-0 mb-2 text-sm">
            <strong>Phone:</strong>{" "}
            <a
              href={`tel:${selectedClinic.phone}`}
              className="text-service-prep-text"
            >
              {selectedClinic.phone}
            </a>
          </p>
        )}

        {openStatus && (
          <p className="m-0 mb-2 text-sm">
            <strong>{t("sections:hours")}:</strong>{" "}
            <span
              className={`font-medium ${openStatus.isOpen ? "text-open" : "text-closed"}`}
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
            className="inline-block mt-2 py-2 px-4 bg-service-prep-text text-white no-underline rounded-sm text-sm font-medium"
          >
            Visit Website
          </a>
        )}
      </div>
    </Popup>
  );
}

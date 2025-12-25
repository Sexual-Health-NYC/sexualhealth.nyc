import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ClipboardIcon, CheckIcon, MapIcon } from "../Icons";
import { TransitInfo, BusInfo } from "../SubwayBullet";

export default function ClinicAddress({ clinic }) {
  const { t } = useTranslation(["actions", "sections", "dynamic"]);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

  const encodedAddress = encodeURIComponent(clinic.address);
  const directionsOptions = [
    {
      name: "OpenStreetMap",
      url: `https://www.openstreetmap.org/directions?to=${clinic.latitude},${clinic.longitude}`,
      note: t("actions:privacyFriendly"),
    },
    {
      name: "Google Maps",
      url: `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`,
    },
    {
      name: "Apple Maps",
      url: `https://maps.apple.com/?daddr=${encodedAddress}`,
    },
  ];

  return (
    <div>
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          {(() => {
            // Split address: street on first line, city/state/zip on second
            const parts = clinic.address.split(/, (?=[A-Z])/);
            const street = parts[0];
            const cityStateZip = parts.slice(1).join(", ");
            return (
              <>
                <div className="text-text-primary text-base leading-relaxed">
                  {street}
                </div>
                {cityStateZip && (
                  <div className="text-text-primary text-base leading-relaxed">
                    {cityStateZip}
                  </div>
                )}
              </>
            );
          })()}
        </div>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => {
              let fullAddress = clinic.address;
              if (clinic.borough && !clinic.address.includes(", NY")) {
                const cityName =
                  clinic.borough === "Manhattan" ? "New York" : clinic.borough;
                fullAddress = `${clinic.address}, ${cityName}, NY`;
              }
              navigator.clipboard.writeText(fullAddress);
              setCopiedAddress(true);
              setTimeout(() => setCopiedAddress(false), 2000);
            }}
            title={
              copiedAddress ? t("actions:copied") : t("actions:copyAddress")
            }
            aria-label={t("actions:copyAddressToClipboard")}
            className={`bg-transparent border-none cursor-pointer p-0 text-sm text-start whitespace-nowrap transition-colors flex items-center gap-1 ${
              copiedAddress ? "text-open" : "text-primary"
            }`}
          >
            {copiedAddress ? (
              <>
                <CheckIcon className="w-4 h-4" />
                {t("actions:copied")}
              </>
            ) : (
              <>
                <ClipboardIcon className="w-4 h-4" />
                {t("actions:copyAddress")}
              </>
            )}
          </button>
          <button
            onClick={() => setShowDirections(!showDirections)}
            className="bg-transparent border-none cursor-pointer p-0 text-primary text-sm text-start whitespace-nowrap flex items-center gap-1"
            aria-expanded={showDirections}
            aria-label={t("actions:getDirections")}
          >
            <MapIcon className="w-4 h-4" />
            {t("actions:getDirections")}
            <span
              className={`inline-block text-[10px] transition-transform ${
                showDirections ? "rotate-180" : "rotate-0"
              }`}
            >
              ▼
            </span>
          </button>
        </div>
      </div>

      {showDirections && (
        <div className="mt-2 p-2 bg-surface rounded-md flex flex-col gap-1">
          {directionsOptions.map((option) => (
            <a
              key={option.name}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm no-underline flex items-center gap-2"
            >
              {option.name}
              {option.note && (
                <span className="text-xs text-text-secondary">
                  ({option.note})
                </span>
              )}
            </a>
          ))}
        </div>
      )}

      {/* Transit */}
      {(clinic.transit || clinic.bus) && (
        <div className="mt-2 text-xs text-text-secondary">
          {clinic.transit && (
            <div className="mb-1">
              <TransitInfo transit={clinic.transit} />
            </div>
          )}
          {clinic.bus && <BusInfo bus={clinic.bus} />}
        </div>
      )}
    </div>
  );
}

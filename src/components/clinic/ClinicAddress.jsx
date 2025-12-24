import { useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "../../theme";
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
      <div
        style={{
          display: "flex",
          gap: theme.spacing[2],
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 1 }}>
          {(() => {
            // Split address: street on first line, city/state/zip on second
            const parts = clinic.address.split(/, (?=[A-Z])/);
            const street = parts[0];
            const cityStateZip = parts.slice(1).join(", ");
            return (
              <>
                <div
                  style={{
                    color: theme.colors.textPrimary,
                    fontSize: theme.fonts.size.base,
                    lineHeight: 1.5,
                  }}
                >
                  {street}
                </div>
                {cityStateZip && (
                  <div
                    style={{
                      color: theme.colors.textPrimary,
                      fontSize: theme.fonts.size.base,
                      lineHeight: 1.5,
                    }}
                  >
                    {cityStateZip}
                  </div>
                )}
              </>
            );
          })()}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing[1],
          }}
        >
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
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              color: copiedAddress ? theme.colors.open : theme.colors.primary,
              fontSize: theme.fonts.size.sm,
              textAlign: "start",
              whiteSpace: "nowrap",
              transition: `color ${theme.transitions.fast}`,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {copiedAddress ? (
              <>
                <CheckIcon style={{ width: "16px", height: "16px" }} />
                {t("actions:copied")}
              </>
            ) : (
              <>
                <ClipboardIcon style={{ width: "16px", height: "16px" }} />
                {t("actions:copyAddress")}
              </>
            )}
          </button>
          <button
            onClick={() => setShowDirections(!showDirections)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              color: theme.colors.primary,
              fontSize: theme.fonts.size.sm,
              textAlign: "start",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            aria-expanded={showDirections}
            aria-label={t("actions:getDirections")}
          >
            <MapIcon style={{ width: "16px", height: "16px" }} />
            {t("actions:getDirections")}
            <span
              style={{
                display: "inline-block",
                transform: showDirections ? "rotate(180deg)" : "rotate(0deg)",
                transition: `transform ${theme.transitions.fast}`,
                fontSize: "10px",
              }}
            >
              ▼
            </span>
          </button>
        </div>
      </div>

      {showDirections && (
        <div
          style={{
            marginTop: theme.spacing[2],
            padding: theme.spacing[2],
            backgroundColor: theme.colors.backgroundAlt,
            borderRadius: theme.borderRadius.md,
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing[1],
          }}
        >
          {directionsOptions.map((option) => (
            <a
              key={option.name}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: theme.colors.primary,
                fontSize: theme.fonts.size.sm,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: theme.spacing[2],
              }}
            >
              {option.name}
              {option.note && (
                <span
                  style={{
                    fontSize: theme.fonts.size.xs,
                    color: theme.colors.textSecondary,
                  }}
                >
                  ({option.note})
                </span>
              )}
            </a>
          ))}
        </div>
      )}

      {/* Transit */}
      {(clinic.transit || clinic.bus) && (
        <div
          style={{
            marginTop: theme.spacing[2],
            fontSize: theme.fonts.size.xs,
            color: theme.colors.textSecondary,
          }}
        >
          {clinic.transit && (
            <div style={{ marginBottom: theme.spacing[1] }}>
              <TransitInfo transit={clinic.transit} />
            </div>
          )}
          {clinic.bus && <BusInfo bus={clinic.bus} />}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "../../theme";
import { ClipboardIcon, CheckIcon, MapIcon } from "../Icons";
import { TransitInfo, BusInfo } from "../SubwayBullet";

export default function ClinicAddress({ clinic }) {
  const { t } = useTranslation(["actions", "sections", "dynamic"]);
  const [copiedAddress, setCopiedAddress] = useState(false);

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
          <a
            href={`https://www.openstreetmap.org/directions?from=&to=${clinic.latitude},${clinic.longitude}#map=15/${clinic.latitude}/${clinic.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: theme.colors.primary,
              fontSize: theme.fonts.size.sm,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
            title={t("actions:openInMaps")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <MapIcon style={{ width: "16px", height: "16px" }} />
              {t("actions:getDirections")}
            </div>
          </a>
        </div>
      </div>

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

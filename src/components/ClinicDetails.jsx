import { useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "../theme";
import {
  getOpenStatus,
  formatHoursForDisplay,
  isHoliday,
  getUpcomingHoliday,
} from "../utils/hours";
import CorrectionFormModal from "./CorrectionFormModal";
import { TransitInfo, BusInfo } from "./SubwayBullet";
import { getDirectionsUrl } from "../utils/directions";

export default function ClinicDetails({ clinic }) {
  const { t } = useTranslation([
    "services",
    "sections",
    "actions",
    "messages",
    "insurance",
    "dynamic",
  ]);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);

  const openStatus = getOpenStatus(clinic.hours);
  const holidayToday = isHoliday(new Date());
  const holidayName = holidayToday
    ? getUpcomingHoliday()?.name || "Holiday"
    : null;

  const formattedHours =
    Array.isArray(clinic.hours) && clinic.hours.length > 0
      ? formatHoursForDisplay(clinic.hours)
      : null;

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

  const quickFacts = [];
  if (clinic.walk_in) quickFacts.push(t("messages:walkIns"));
  if (clinic.no_insurance_ok) quickFacts.push(t("insurance:noInsuranceOk"));

  if (clinic.accepts_medicaid) {
    const mcos = clinic.medicaid_mcos;
    const mtype = clinic.medicaid_type;

    if (mcos && mcos.length > 0) {
      quickFacts.push(`Medicaid: ${mcos.join(", ")}`);
    } else if (mtype === "straight") {
      quickFacts.push(t("insurance:medicaidStraight"));
    } else if (mtype === "managed") {
      quickFacts.push(t("insurance:medicaidManaged"));
    } else if (mtype === "both") {
      quickFacts.push(t("insurance:medicaidBoth"));
    } else {
      quickFacts.push(t("insurance:acceptsMedicaid"));
    }
  }

  if (clinic.accepts_medicare) quickFacts.push(t("insurance:acceptsMedicare"));
  if (clinic.sliding_scale) quickFacts.push(t("insurance:slidingScale"));

  return (
    <>
      {/* Status Badge */}
      {openStatus && (
        <div style={{ marginBottom: theme.spacing[2] }}>
          <span
            style={{
              display: "inline-block",
              padding: `2px ${theme.spacing[2]}`,
              backgroundColor: openStatus.isOpen
                ? theme.colors.open
                : theme.colors.closed,
              color: "white",
              borderRadius: theme.borderRadius.sm,
              fontSize: theme.fonts.size.sm,
              fontWeight: theme.fonts.weight.medium,
            }}
          >
            {openStatus.isOpen
              ? openStatus.closesAt
                ? t("messages:openClosesAt", {
                    time: openStatus.closesAt,
                  })
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
          {holidayToday && (
            <span
              style={{
                marginLeft: theme.spacing[2],
                fontSize: theme.fonts.size.sm,
                color: theme.colors.textSecondary,
                fontStyle: "italic",
              }}
            >
              {t("messages:holidayHoursWarning", {
                holiday: holidayName,
              })}
            </span>
          )}
        </div>
      )}

      {/* Service Tags */}
      {services.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: theme.spacing[1],
            marginBottom: theme.spacing[3],
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
      )}

      {/* Address + Actions */}
      <div
        style={{
          marginBottom: theme.spacing[3],
          display: "flex",
          gap: theme.spacing[2],
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              color: theme.colors.textPrimary,
              fontSize: theme.fonts.size.base,
              lineHeight: 1.5,
            }}
          >
            {clinic.address}
          </div>
          <div
            style={{
              color: theme.colors.textPrimary,
              fontSize: theme.fonts.size.base,
              lineHeight: 1.5,
            }}
          >
            {clinic.borough && !clinic.address.includes(", NY")
              ? `${clinic.borough === "Manhattan" ? "New York" : clinic.borough}, NY`
              : ""}
          </div>
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
              textAlign: "left",
              whiteSpace: "nowrap",
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = theme.focus.outline;
              e.currentTarget.style.outlineOffset = theme.focus.outlineOffset;
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
            }}
          >
            📋 {copiedAddress ? t("actions:copied") : "copy"}
          </button>
          <a
            href={getDirectionsUrl(clinic.latitude, clinic.longitude)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: theme.colors.primary,
              fontSize: theme.fonts.size.sm,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
            title={t("actions:openInMaps")}
            onFocus={(e) => {
              e.currentTarget.style.outline = theme.focus.outline;
              e.currentTarget.style.outlineOffset = theme.focus.outlineOffset;
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
            }}
          >
            🗺️ directions
          </a>
        </div>
      </div>

      {/* Transit */}
      {(clinic.transit || clinic.bus) && (
        <div
          style={{
            fontSize: theme.fonts.size.sm,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing[3],
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

      {/* Quick Facts */}
      {quickFacts.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: `${theme.spacing[1]} ${theme.spacing[3]}`,
            marginBottom: theme.spacing[3],
            fontSize: theme.fonts.size.base,
            color: theme.colors.textPrimary,
          }}
        >
          {quickFacts.map((fact) => (
            <span key={fact}>✓ {fact}</span>
          ))}
        </div>
      )}

      {/* Hours */}
      {formattedHours && formattedHours.length > 0 && (
        <div style={{ marginBottom: theme.spacing[3] }}>
          <h3
            style={{
              fontSize: theme.fonts.size.sm,
              fontWeight: theme.fonts.weight.semibold,
              color: theme.colors.textSecondary,
              margin: `0 0 ${theme.spacing[2]} 0`,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {t("sections:hours")}
          </h3>
          {formattedHours.map((dept, i) => (
            <div key={i} style={{ marginBottom: theme.spacing[2] }}>
              {formattedHours.length > 1 && (
                <p
                  style={{
                    margin: `0 0 ${theme.spacing[1]} 0`,
                    fontSize: theme.fonts.size.sm,
                    fontWeight: theme.fonts.weight.medium,
                    color: theme.colors.textSecondary,
                  }}
                >
                  {t(dept.department, { ns: "dynamic" })}
                </p>
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                {dept.schedules.map((sched, j) => (
                  <div
                    key={j}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: theme.fonts.size.base,
                    }}
                  >
                    <span style={{ color: theme.colors.textPrimary }}>
                      {sched.days}
                    </span>
                    <span style={{ color: theme.colors.textSecondary }}>
                      {sched.isAllDay ? t("messages:allDay") : sched.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contact */}
      {(clinic.phone || clinic.website) && (
        <div
          style={{
            marginBottom: theme.spacing[3],
            fontSize: theme.fonts.size.base,
          }}
        >
          {clinic.phone && !clinic.phone.includes("@") && (
            <div style={{ marginBottom: theme.spacing[1] }}>
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
            </div>
          )}
          {clinic.website && (
            <div>
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
                {clinic.website.replace(/^https?:\/\//, "").length > 35
                  ? "..."
                  : ""}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Report Correction */}
      <div
        style={{
          paddingTop: theme.spacing[3],
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <button
          onClick={() => setShowCorrectionForm(!showCorrectionForm)}
          style={{
            background: "none",
            border: "none",
            color: theme.colors.textSecondary,
            fontSize: theme.fonts.size.sm,
            cursor: "pointer",
            padding: 0,
            textDecoration: "underline",
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = theme.focus.outline;
            e.currentTarget.style.outlineOffset = theme.focus.outlineOffset;
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = "none";
          }}
          aria-expanded={showCorrectionForm}
        >
          {showCorrectionForm
            ? "Cancel correction"
            : t("actions:reportCorrection")}
        </button>

        <CorrectionFormModal
          clinicName={clinic.name}
          onClose={() => setShowCorrectionForm(false)}
          isExpanded={showCorrectionForm}
        />
      </div>
    </>
  );
}

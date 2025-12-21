import { useState } from "react";
import { useTranslation } from "react-i18next";
import useAppStore from "../store/useAppStore";
import theme from "../theme";
import {
  getOpenStatus,
  formatHoursForDisplay,
  isHoliday,
  getUpcomingHoliday,
} from "../utils/hours";
import CorrectionFormModal from "./CorrectionFormModal";
import { TransitInfo, BusInfo } from "./SubwayBullet";

export default function ClinicDetailPanel() {
  const { t } = useTranslation([
    "services",
    "sections",
    "actions",
    "messages",
    "insurance",
    "dynamic",
  ]);
  const { selectedClinic, selectClinic } = useAppStore();
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);

  if (!selectedClinic) return null;

  const openStatus = getOpenStatus(selectedClinic.hours);
  const holidayToday = isHoliday(new Date());
  const holidayName = holidayToday
    ? getUpcomingHoliday()?.name || "Holiday"
    : null;

  const formattedHours =
    Array.isArray(selectedClinic.hours) && selectedClinic.hours.length > 0
      ? formatHoursForDisplay(selectedClinic.hours)
      : null;

  const services = [];
  if (selectedClinic.has_sti_testing)
    services.push({
      label: t("services:stiTesting"),
      bgColor: theme.colors.stiTestingBg,
      textColor: theme.colors.stiTestingText,
    });
  if (selectedClinic.has_hiv_testing)
    services.push({
      label: t("services:hivTesting"),
      bgColor: theme.colors.hivTestingBg,
      textColor: theme.colors.hivTestingText,
    });
  if (selectedClinic.has_prep)
    services.push({
      label: t("services:prep"),
      bgColor: theme.colors.prepBg,
      textColor: theme.colors.prepText,
    });
  if (selectedClinic.has_pep)
    services.push({
      label: t("services:pep"),
      bgColor: theme.colors.pepBg,
      textColor: theme.colors.pepText,
    });
  if (selectedClinic.has_contraception)
    services.push({
      label: t("services:contraception"),
      bgColor: theme.colors.contraceptionBg,
      textColor: theme.colors.contraceptionText,
    });
  if (selectedClinic.has_abortion)
    services.push({
      label: t("services:abortion"),
      bgColor: theme.colors.abortionBg,
      textColor: theme.colors.abortionText,
    });

  // Collect quick facts (insurance + walk-ins)
  const quickFacts = [];
  if (selectedClinic.walk_in) quickFacts.push(t("messages:walkIns"));
  if (selectedClinic.no_insurance_ok)
    quickFacts.push(t("insurance:noInsuranceOk"));

  // Medicaid - show granular info if available
  if (selectedClinic.accepts_medicaid) {
    const mcos = selectedClinic.medicaid_mcos;
    const mtype = selectedClinic.medicaid_type;

    if (mcos && mcos.length > 0) {
      // We have specific MCO data
      quickFacts.push(`Medicaid: ${mcos.join(", ")}`);
    } else if (mtype === "straight") {
      quickFacts.push(t("insurance:medicaidStraight"));
    } else if (mtype === "managed") {
      quickFacts.push(t("insurance:medicaidManaged"));
    } else if (mtype === "both") {
      quickFacts.push(t("insurance:medicaidBoth"));
    } else {
      // Just the boolean, no granular data
      quickFacts.push(t("insurance:acceptsMedicaid"));
    }
  }

  if (selectedClinic.accepts_medicare)
    quickFacts.push(t("insurance:acceptsMedicare"));
  if (selectedClinic.sliding_scale)
    quickFacts.push(t("insurance:slidingScale"));

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "400px",
        height: "100%",
        backgroundColor: theme.colors.background,
        boxShadow: theme.shadows.lg,
        overflowY: "auto",
        zIndex: 10,
        animation: `slideInRight ${theme.motion.duration.slow} ${theme.motion.easing.gentle}`,
      }}
    >
      <div style={{ padding: theme.spacing[4] }}>
        {/* Header: Name + Status + Close */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: theme.spacing[3],
          }}
        >
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: theme.fonts.size.xl,
                fontWeight: theme.fonts.weight.semibold,
                color: theme.colors.textPrimary,
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {selectedClinic.name}
            </h2>
            {openStatus && (
              <div style={{ marginTop: theme.spacing[1] }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: `2px ${theme.spacing[2]}`,
                    backgroundColor: openStatus.isOpen
                      ? theme.colors.open
                      : theme.colors.closed,
                    color: "white",
                    borderRadius: theme.borderRadius.sm,
                    fontSize: theme.fonts.size.xs,
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
                      fontSize: theme.fonts.size.xs,
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
          </div>
          <button
            onClick={() => selectClinic(null)}
            style={{
              background: "none",
              border: "none",
              fontSize: theme.fonts.size.xl,
              color: theme.colors.textSecondary,
              cursor: "pointer",
              padding: 0,
              marginLeft: theme.spacing[2],
            }}
            aria-label={t("actions:close")}
          >
            ×
          </button>
        </div>

        {/* Service Tags - no header needed */}
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
                  fontSize: theme.fonts.size.xs,
                  fontWeight: theme.fonts.weight.medium,
                }}
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Address + Actions */}
        <div style={{ marginBottom: theme.spacing[3] }}>
          <p
            style={{
              margin: `0 0 ${theme.spacing[2]} 0`,
              color: theme.colors.textPrimary,
              fontSize: theme.fonts.size.sm,
            }}
          >
            {selectedClinic.address}
            {selectedClinic.borough && (
              <>
                ,{" "}
                {selectedClinic.borough === "Manhattan"
                  ? "New York"
                  : selectedClinic.borough}
                , NY
              </>
            )}
            <button
              onClick={() => {
                const cityName =
                  selectedClinic.borough === "Manhattan"
                    ? "New York"
                    : selectedClinic.borough;
                const fullAddress = `${selectedClinic.address}${selectedClinic.borough ? `, ${cityName}, NY` : ""}`;
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
                marginLeft: theme.spacing[1],
                padding: 0,
                color: copiedAddress ? theme.colors.open : theme.colors.primary,
                fontSize: theme.fonts.size.xs,
                verticalAlign: "middle",
              }}
            >
              {copiedAddress ? "✓ copied" : "copy"}
            </button>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(selectedClinic.address + (selectedClinic.borough ? `, ${selectedClinic.borough}, NY` : ""))}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginLeft: theme.spacing[2],
                color: theme.colors.primary,
                fontSize: theme.fonts.size.xs,
                textDecoration: "none",
                verticalAlign: "middle",
              }}
              title={t("actions:openInMaps")}
            >
              directions
            </a>
          </p>

          {/* Transit - compact */}
          {(selectedClinic.transit || selectedClinic.bus) && (
            <div
              style={{
                fontSize: theme.fonts.size.xs,
                color: theme.colors.textSecondary,
              }}
            >
              {selectedClinic.transit && (
                <div style={{ marginBottom: theme.spacing[1] }}>
                  <TransitInfo transit={selectedClinic.transit} />
                </div>
              )}
              {selectedClinic.bus && <BusInfo bus={selectedClinic.bus} />}
            </div>
          )}
        </div>

        {/* Quick Facts - horizontal compact */}
        {quickFacts.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: `${theme.spacing[1]} ${theme.spacing[3]}`,
              marginBottom: theme.spacing[3],
              fontSize: theme.fonts.size.sm,
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
                      fontSize: theme.fonts.size.xs,
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
                        fontSize: theme.fonts.size.sm,
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

        {/* Contact - inline labels */}
        {(selectedClinic.phone || selectedClinic.website) && (
          <div
            style={{
              marginBottom: theme.spacing[3],
              fontSize: theme.fonts.size.sm,
            }}
          >
            {selectedClinic.phone && !selectedClinic.phone.includes("@") && (
              <div style={{ marginBottom: theme.spacing[1] }}>
                <span style={{ color: theme.colors.textSecondary }}>
                  {t("sections:phone")}:{" "}
                </span>
                <a
                  href={`tel:${selectedClinic.phone}`}
                  style={{
                    color: theme.colors.primary,
                    textDecoration: "none",
                  }}
                >
                  {selectedClinic.phone}
                </a>
              </div>
            )}
            {selectedClinic.website && (
              <div>
                <span style={{ color: theme.colors.textSecondary }}>
                  {t("sections:website")}:{" "}
                </span>
                <a
                  href={
                    selectedClinic.website.startsWith("http")
                      ? selectedClinic.website
                      : `https://${selectedClinic.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: theme.colors.primary,
                    wordBreak: "break-all",
                  }}
                >
                  {selectedClinic.website
                    .replace(/^https?:\/\//, "")
                    .replace(/\/$/, "")
                    .substring(0, 35)}
                  {selectedClinic.website.replace(/^https?:\/\//, "").length >
                  35
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
            onClick={() => setShowCorrectionForm(true)}
            style={{
              background: "none",
              border: "none",
              color: theme.colors.textSecondary,
              fontSize: theme.fonts.size.xs,
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
          >
            {t("actions:reportCorrection")}
          </button>
        </div>
      </div>

      {/* Correction Form Modal */}
      {showCorrectionForm && (
        <CorrectionFormModal
          clinicName={selectedClinic.name}
          onClose={() => setShowCorrectionForm(false)}
        />
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
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

export default function ClinicBottomSheet() {
  const { t } = useTranslation([
    "services",
    "sections",
    "actions",
    "messages",
    "insurance",
  ]);
  const { selectedClinic, selectClinic } = useAppStore();
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);

  if (!selectedClinic) return null;

  const openStatus = getOpenStatus(
    selectedClinic.hours,
    selectedClinic.hours_text,
  );
  const formattedHours = formatHoursForDisplay(selectedClinic.hours);
  const holidayToday = isHoliday();
  const holidayName = getUpcomingHoliday();

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

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    // Only allow dragging down
    if (diff > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const handleTouchEnd = () => {
    const diff = currentY.current - startY.current;

    if (sheetRef.current) {
      // If dragged down more than 100px, close the sheet
      if (diff > 100) {
        selectClinic(null);
      }
      // Reset position
      sheetRef.current.style.transform = "translateY(0)";
    }
  };

  return (
    <div
      ref={sheetRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: theme.borderRadius.lg,
        borderTopRightRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows.lg,
        maxHeight: "85vh",
        overflowY: "auto",
        zIndex: 20,
        transition: `transform ${theme.transitions.base}`,
        animation: `slideInUp ${theme.motion.duration.slow} ${theme.motion.easing.gentle}`,
      }}
    >
      {/* Drag handle */}
      <div
        style={{
          width: "40px",
          height: "4px",
          backgroundColor: theme.colors.border,
          borderRadius: theme.borderRadius.full,
          margin: `${theme.spacing[2]} auto`,
        }}
      />

      <div style={{ padding: theme.spacing[4] }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: theme.spacing[4],
          }}
        >
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: theme.fonts.size.xl,
                fontWeight: theme.fonts.weight.semibold,
                color: theme.colors.textPrimary,
                margin: 0,
                marginBottom: openStatus ? theme.spacing[2] : 0,
              }}
            >
              {selectedClinic.name}
            </h2>
            {openStatus && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: theme.spacing[1],
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                    backgroundColor: openStatus.isOpen ? "#10b981" : "#94a3b8",
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

        {/* Services */}
        {services.length > 0 && (
          <Section title={t("sections:services")}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: theme.spacing[2],
              }}
            >
              {services.map(({ label, bgColor, textColor }) => (
                <span
                  key={label}
                  style={{
                    padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
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
          </Section>
        )}

        {/* Address */}
        <Section title="">
          <div
            style={{
              display: "flex",
              alignItems: "start",
              gap: theme.spacing[2],
              marginBottom: theme.spacing[3],
            }}
          >
            <p
              style={{
                margin: 0,
                flex: 1,
                color: theme.colors.textPrimary,
                fontSize: theme.fonts.size.base,
                lineHeight: "1.5",
              }}
            >
              {selectedClinic.address}
              {selectedClinic.borough && (
                <>
                  <br />
                  {selectedClinic.borough === "Manhattan"
                    ? "New York"
                    : selectedClinic.borough}
                  , NY
                </>
              )}
            </p>
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
                padding: theme.spacing[1],
                color: copiedAddress ? theme.colors.prep : theme.colors.primary,
                fontSize: theme.fonts.size.base,
                fontWeight: theme.fonts.weight.medium,
                transition: `color ${theme.transitions.fast}`,
              }}
            >
              {copiedAddress ? `✓ ${t("actions:copied")}` : "📋"}
            </button>
          </div>
          <a
            href={`geo:${selectedClinic.latitude},${selectedClinic.longitude}?q=${selectedClinic.latitude},${selectedClinic.longitude}`}
            style={{
              display: "block",
              padding: theme.spacing[3],
              backgroundColor: theme.colors.primary,
              color: "white",
              textAlign: "center",
              textDecoration: "none",
              borderRadius: theme.borderRadius.sm,
              fontSize: theme.fonts.size.base,
              fontWeight: theme.fonts.weight.medium,
            }}
          >
            {t("actions:openInMaps")}
          </a>
          {(selectedClinic.transit || selectedClinic.bus) && (
            <div
              style={{
                marginTop: theme.spacing[3],
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing[2],
              }}
            >
              {selectedClinic.transit && (
                <div
                  style={{
                    padding: theme.spacing[2],
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.borderRadius.sm,
                    fontSize: theme.fonts.size.sm,
                  }}
                >
                  <TransitInfo transit={selectedClinic.transit} />
                </div>
              )}
              {selectedClinic.bus && (
                <div
                  style={{
                    padding: theme.spacing[2],
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.borderRadius.sm,
                    fontSize: theme.fonts.size.sm,
                  }}
                >
                  <BusInfo bus={selectedClinic.bus} />
                </div>
              )}
            </div>
          )}
        </Section>

        {/* Hours */}
        {formattedHours.length > 0 && (
          <Section title={t("sections:hours")}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing[3],
              }}
            >
              {formattedHours.map((dept, i) => (
                <div key={i}>
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
                      gap: theme.spacing[1],
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
          </Section>
        )}

        {/* Insurance */}
        <Section title={t("sections:insuranceAndCost")}>
          {!selectedClinic.accepts_medicaid &&
          !selectedClinic.accepts_medicare &&
          !selectedClinic.no_insurance_ok &&
          !selectedClinic.sliding_scale ? (
            <p
              style={{
                margin: 0,
                color: theme.colors.textSecondary,
                fontSize: theme.fonts.size.sm,
                fontStyle: "italic",
              }}
            >
              {t("messages:unknownContactClinic")}
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing[2],
              }}
            >
              {selectedClinic.accepts_medicaid && (
                <InfoItem text={t("insurance:acceptsMedicaid")} />
              )}
              {selectedClinic.accepts_medicare && (
                <InfoItem text={t("insurance:acceptsMedicare")} />
              )}
              {selectedClinic.no_insurance_ok && (
                <InfoItem text={t("insurance:noInsuranceOk")} highlight />
              )}
              {selectedClinic.sliding_scale && (
                <InfoItem text={t("insurance:slidingScale")} />
              )}
            </div>
          )}
        </Section>

        {/* Access */}
        {selectedClinic.walk_in && (
          <Section title={t("sections:walkIns")}>
            <InfoItem text={t("messages:walkInsAccepted")} />
          </Section>
        )}

        {/* Contact Info */}
        {(selectedClinic.phone || selectedClinic.website) && (
          <Section title={t("sections:contact")}>
            {selectedClinic.phone && !selectedClinic.phone.includes("@") && (
              <div style={{ marginBottom: theme.spacing[3] }}>
                <p
                  style={{
                    margin: `0 0 ${theme.spacing[1]} 0`,
                    fontSize: theme.fonts.size.xs,
                    color: theme.colors.textSecondary,
                    fontWeight: theme.fonts.weight.medium,
                  }}
                >
                  {t("sections:phone")}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: theme.fonts.size.base,
                    color: theme.colors.textPrimary,
                    fontWeight: theme.fonts.weight.medium,
                  }}
                >
                  {selectedClinic.phone}
                </p>
                <a
                  href={`tel:${selectedClinic.phone}`}
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
                  {t("actions:callNow")}
                </a>
              </div>
            )}
            {selectedClinic.website && (
              <div>
                <p
                  style={{
                    margin: `0 0 ${theme.spacing[1]} 0`,
                    fontSize: theme.fonts.size.xs,
                    color: theme.colors.textSecondary,
                    fontWeight: theme.fonts.weight.medium,
                  }}
                >
                  {t("sections:website")}
                </p>
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
                    fontSize: theme.fonts.size.sm,
                    wordBreak: "break-all",
                    textDecoration: "underline",
                  }}
                >
                  {selectedClinic.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </Section>
        )}

        {/* Report Correction */}
        <div
          style={{
            marginTop: theme.spacing[4],
            paddingTop: theme.spacing[4],
            borderTop: `1px solid ${theme.colors.border}`,
          }}
        >
          <button
            onClick={() => setShowCorrectionForm(true)}
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

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: theme.spacing[4] }}>
      <h3
        style={{
          fontSize: theme.fonts.size.base,
          fontWeight: theme.fonts.weight.semibold,
          color: theme.colors.textPrimary,
          marginBottom: theme.spacing[2],
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoItem({ text, highlight }) {
  return (
    <div
      style={{
        padding: theme.spacing[2],
        backgroundColor: highlight ? theme.colors.surface : "transparent",
        borderRadius: theme.borderRadius.sm,
        fontSize: theme.fonts.size.sm,
        color: theme.colors.textPrimary,
      }}
    >
      ✓ {text}
    </div>
  );
}

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
import { TransitInfo, BusInfo } from "./SubwayBullet";

export default function ClinicListView({ clinics }) {
  const { t } = useTranslation([
    "messages",
    "services",
    "insurance",
    "sections",
    "actions",
    "dynamic",
  ]);
  const { selectClinic } = useAppStore();
  const [expandedId, setExpandedId] = useState(null);

  if (clinics.length === 0) {
    return (
      <div
        style={{
          padding: theme.spacing[8],
          textAlign: "center",
          color: theme.colors.textSecondary,
          fontSize: theme.fonts.size.lg,
        }}
      >
        <p style={{ margin: 0 }}>{t("messages:noMatches")}</p>
        <p style={{ margin: theme.spacing[2], fontSize: theme.fonts.size.sm }}>
          {t("messages:tryAdjustingFilters")}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: theme.spacing[4],
        paddingTop: "60px",
        backgroundColor: theme.colors.surface,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: theme.spacing[4],
        }}
      >
        {clinics.map((clinic) => (
          <ClinicCard
            key={clinic.id}
            clinic={clinic}
            expanded={expandedId === clinic.id}
            onToggle={() =>
              setExpandedId(expandedId === clinic.id ? null : clinic.id)
            }
            onShowOnMap={() => selectClinic(clinic)}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}

function ClinicCard({ clinic, expanded, onToggle, onShowOnMap, t }) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const openStatus = getOpenStatus(clinic.hours);
  const holidayToday = isHoliday(new Date());
  const holidayName = holidayToday
    ? getUpcomingHoliday()?.name || "Holiday"
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

  // Quick facts
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

  const formattedHours =
    Array.isArray(clinic.hours) && clinic.hours.length > 0
      ? formatHoursForDisplay(clinic.hours)
      : null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      aria-expanded={expanded}
      aria-label={t("messages:viewDetails", { name: clinic.name })}
      style={{
        backgroundColor: "white",
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing[4],
        cursor: "pointer",
        boxShadow: expanded
          ? "0 8px 24px rgba(123, 44, 191, 0.18)"
          : "0 2px 8px rgba(123, 44, 191, 0.08)",
        transition: `all ${theme.motion.duration.normal} ${theme.motion.easing.gentle}`,
        border: `2px solid ${expanded ? theme.colors.primary : theme.colors.border}`,
      }}
      onMouseEnter={(e) => {
        if (!expanded) {
          e.currentTarget.style.boxShadow =
            "0 8px 20px rgba(123, 44, 191, 0.15)";
          e.currentTarget.style.borderColor = theme.colors.primaryLight;
        }
      }}
      onMouseLeave={(e) => {
        if (!expanded) {
          e.currentTarget.style.boxShadow =
            "0 2px 8px rgba(123, 44, 191, 0.08)";
          e.currentTarget.style.borderColor = theme.colors.border;
        }
      }}
    >
      {/* Header - always visible */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: theme.spacing[2],
        }}
      >
        <h3
          style={{
            fontSize: theme.fonts.size.lg,
            fontWeight: theme.fonts.weight.semibold,
            color: theme.colors.textPrimary,
            margin: 0,
            flex: 1,
          }}
        >
          {clinic.name}
        </h3>
        <span
          style={{
            fontSize: theme.fonts.size.lg,
            color: theme.colors.textSecondary,
            marginLeft: theme.spacing[2],
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: `transform ${theme.motion.duration.fast}`,
          }}
        >
          ▾
        </span>
      </div>

      {/* Open status */}
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
              fontSize: theme.fonts.size.xs,
              fontWeight: theme.fonts.weight.medium,
            }}
          >
            {expanded
              ? openStatus.isOpen
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
                    : t("messages:closed")
              : t(openStatus.isOpen ? "messages:openNow" : "messages:closed")}
          </span>
          {expanded && holidayToday && (
            <span
              style={{
                marginLeft: theme.spacing[2],
                fontSize: theme.fonts.size.xs,
                color: theme.colors.textSecondary,
                fontStyle: "italic",
              }}
            >
              {t("messages:holidayHoursWarning", { holiday: holidayName })}
            </span>
          )}
        </div>
      )}

      {/* Services */}
      {services.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: theme.spacing[1],
            marginBottom: theme.spacing[2],
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

      {/* Collapsed: just borough */}
      {!expanded && (
        <p
          style={{
            margin: 0,
            color: theme.colors.textSecondary,
            fontSize: theme.fonts.size.sm,
          }}
        >
          {clinic.borough}
        </p>
      )}

      {/* Expanded content */}
      {expanded && (
        <div
          style={{
            marginTop: theme.spacing[3],
            paddingTop: theme.spacing[3],
            borderTop: `1px solid ${theme.colors.border}`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Address */}
          <p
            style={{
              margin: `0 0 ${theme.spacing[2]} 0`,
              color: theme.colors.textPrimary,
              fontSize: theme.fonts.size.sm,
            }}
          >
            {clinic.address}
            {clinic.borough && !clinic.address.includes(", NY") && (
              <>
                , {clinic.borough === "Manhattan" ? "New York" : clinic.borough}
                , NY
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                let fullAddress = clinic.address;
                if (clinic.borough && !clinic.address.includes(", NY")) {
                  const cityName =
                    clinic.borough === "Manhattan"
                      ? "New York"
                      : clinic.borough;
                  fullAddress = `${clinic.address}, ${cityName}, NY`;
                }
                navigator.clipboard.writeText(fullAddress);
                setCopiedAddress(true);
                setTimeout(() => setCopiedAddress(false), 2000);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                marginLeft: theme.spacing[1],
                padding: 0,
                color: copiedAddress ? theme.colors.open : theme.colors.primary,
                fontSize: theme.fonts.size.xs,
              }}
            >
              {copiedAddress ? "✓ copied" : "copy"}
            </button>
            <a
              href={`https://www.openstreetmap.org/directions?route=;${clinic.latitude},${clinic.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                marginLeft: theme.spacing[2],
                color: theme.colors.primary,
                fontSize: theme.fonts.size.xs,
                textDecoration: "none",
              }}
            >
              directions
            </a>
          </p>

          {/* Transit */}
          {(clinic.transit || clinic.bus) && (
            <div
              style={{
                fontSize: theme.fonts.size.xs,
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing[2],
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

          {/* Quick facts */}
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
              <h4
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
              </h4>
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

          {/* Contact */}
          {(clinic.phone || clinic.website) && (
            <div
              style={{
                marginBottom: theme.spacing[3],
                fontSize: theme.fonts.size.sm,
              }}
            >
              {clinic.phone && !clinic.phone.includes("@") && (
                <div style={{ marginBottom: theme.spacing[1] }}>
                  <span style={{ color: theme.colors.textSecondary }}>
                    {t("sections:phone")}:{" "}
                  </span>
                  <a
                    href={`tel:${clinic.phone}`}
                    onClick={(e) => e.stopPropagation()}
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
                    onClick={(e) => e.stopPropagation()}
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

          {/* Show on map button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowOnMap();
            }}
            style={{
              width: "100%",
              padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
              backgroundColor: theme.colors.primary,
              color: "white",
              border: "none",
              borderRadius: theme.borderRadius.md,
              fontSize: theme.fonts.size.sm,
              fontWeight: theme.fonts.weight.medium,
              cursor: "pointer",
              transition: `background-color ${theme.motion.duration.fast}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primaryDark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
            }}
          >
            {t("actions:showOnMap")}
          </button>
        </div>
      )}
    </div>
  );
}

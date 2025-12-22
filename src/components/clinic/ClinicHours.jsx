import { useTranslation } from "react-i18next";
import theme from "../../theme";
import { formatHoursForDisplay } from "../../utils/hours";
import { CalendarIcon } from "../Icons";

export default function ClinicHours({ clinic }) {
  const { t } = useTranslation(["sections", "messages", "dynamic", "days"]);

  const formattedHours =
    Array.isArray(clinic.hours) && clinic.hours.length > 0
      ? formatHoursForDisplay(clinic.hours, (day) => t(day, { ns: "days" }))
      : null;

  // Show appointment-only message even if no structured hours
  if (
    (!formattedHours || formattedHours.length === 0) &&
    !clinic.appointment_only
  )
    return null;

  return (
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
      {clinic.appointment_only && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: theme.spacing[1],
            backgroundColor: theme.colors.warningBg || "#FEF3C7",
            color: theme.colors.warningText || "#92400E",
            padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
            borderRadius: theme.borderRadius.sm,
            fontSize: theme.fonts.size.sm,
            fontWeight: theme.fonts.weight.medium,
            marginBottom: theme.spacing[2],
          }}
        >
          <CalendarIcon style={{ width: "16px", height: "16px" }} />
          <span>{t("messages:appointmentOnly")}</span>
        </div>
      )}
      {formattedHours &&
        formattedHours.map((dept, i) => (
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
  );
}

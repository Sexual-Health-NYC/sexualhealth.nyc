import { useTranslation } from "react-i18next";
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
    <div className="mb-3">
      <h3 className="text-sm font-semibold text-text-secondary m-0 mb-2 uppercase tracking-wide">
        {t("sections:hours")}
      </h3>
      {clinic.appointment_only && (
        <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 py-1 px-2 rounded-sm text-sm font-medium mb-2">
          <CalendarIcon className="w-4 h-4" />
          <span>{t("messages:appointmentOnly")}</span>
        </div>
      )}
      {formattedHours &&
        formattedHours.map((dept, i) => (
          <div key={i} className="mb-2">
            {formattedHours.length > 1 && (
              <p className="m-0 mb-1 text-sm font-medium text-text-secondary">
                {t(dept.department, { ns: "dynamic" })}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {dept.schedules.map((sched, j) => (
                <div key={j} className="flex justify-between text-base">
                  <span className="text-text-primary">{sched.days}</span>
                  <span className="text-text-secondary">
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

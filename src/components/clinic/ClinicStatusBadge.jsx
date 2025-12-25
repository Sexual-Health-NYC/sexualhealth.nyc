import { useTranslation } from "react-i18next";
import { getOpenStatus, isHoliday, getHolidayKey } from "../../utils/hours";

export default function ClinicStatusBadge({ clinic }) {
  const { t } = useTranslation(["messages", "holidays"]);
  const openStatus = getOpenStatus(clinic.hours);
  const holidayToday = isHoliday();
  const holidayKey = holidayToday ? getHolidayKey() : null;
  const holidayName = holidayKey
    ? t(`holidays:${holidayKey}`)
    : t("holidays:holiday");

  if (!openStatus) return null;

  return (
    <div className="flex flex-col gap-1">
      <span
        className={`inline-block py-0.5 px-2 text-white rounded-sm text-xs font-medium w-fit ${
          openStatus.isOpen ? "bg-open" : "bg-closed"
        }`}
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
                : t("messages:closedOpens", { day: openStatus.nextOpen.day })
              : t("messages:closed")}
      </span>
      {holidayToday && (
        <span className="text-xs text-text-secondary italic">
          {t("messages:holidayHoursWarning", { holiday: holidayName })}
        </span>
      )}
    </div>
  );
}

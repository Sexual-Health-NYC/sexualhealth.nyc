import { useTranslation } from "react-i18next";
import theme from "../../theme";
import { getOpenStatus, isHoliday, getUpcomingHoliday } from "../../utils/hours";

export default function ClinicStatusBadge({ clinic }) {
  const { t } = useTranslation(["messages"]);
  const openStatus = getOpenStatus(clinic.hours);
  const holidayToday = isHoliday();
  const holidayName = holidayToday ? getUpcomingHoliday()?.name || "Holiday" : null;

  if (!openStatus) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing[1] }}>
      <span
        style={{
          display: "inline-block",
          padding: `2px ${theme.spacing[2]}`,
          backgroundColor: openStatus.isOpen ? theme.colors.open : theme.colors.closed,
          color: "white",
          borderRadius: theme.borderRadius.sm,
          fontSize: theme.fonts.size.xs,
          fontWeight: theme.fonts.weight.medium,
          width: "fit-content"
        }}
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
        <span
          style={{
            fontSize: theme.fonts.size.xs,
            color: theme.colors.textSecondary,
            fontStyle: "italic",
          }}
        >
          {t("messages:holidayHoursWarning", { holiday: holidayName })}
        </span>
      )}
    </div>
  );
}

import { useTranslation } from "react-i18next";
import theme from "../../theme";

function getVerificationStatus(clinic) {
  // Only use explicit last_verified field - data_sources date is NOT verification
  const verifiedDate = clinic.last_verified
    ? new Date(clinic.last_verified)
    : null;

  if (!verifiedDate || isNaN(verifiedDate.getTime())) {
    return { status: "unknown", monthsAgo: null, date: null };
  }

  const now = new Date();
  const monthsAgo =
    (now.getFullYear() - verifiedDate.getFullYear()) * 12 +
    (now.getMonth() - verifiedDate.getMonth());

  if (monthsAgo <= 5) {
    return { status: "recent", monthsAgo, date: verifiedDate };
  } else if (monthsAgo <= 6) {
    return { status: "aging", monthsAgo, date: verifiedDate };
  } else {
    return { status: "stale", monthsAgo, date: verifiedDate };
  }
}

export default function ClinicVerificationBadge({ clinic }) {
  const { t, i18n } = useTranslation(["messages"]);
  const { status, date } = getVerificationStatus(clinic);

  const statusColors = {
    recent: theme.colors.open, // green - recently verified
    aging: "#d97706", // amber/orange - getting stale
    stale: "#dc2626", // red - needs re-verification
    unknown: "#9ca3af", // light gray - not yet verified (not alarming)
  };

  // Format as relative time using native Intl API (supports all our languages)
  let timeDisplay = null;
  if (date) {
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    try {
      const rtf = new Intl.RelativeTimeFormat(i18n.language, {
        numeric: "auto",
      });
      if (diffDays < 7) {
        timeDisplay = rtf.format(-diffDays || -1, "day");
      } else if (diffDays < 30) {
        timeDisplay = rtf.format(-diffWeeks, "week");
      } else {
        timeDisplay = rtf.format(-diffMonths, "month");
      }
    } catch {
      // Fallback for older browsers
      timeDisplay = `${diffMonths} months ago`;
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: theme.fonts.size.xs,
        color: theme.colors.textSecondary,
      }}
    >
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: statusColors[status],
          flexShrink: 0,
        }}
        aria-hidden="true"
      />
      <span>{timeDisplay || t("messages:verifiedUnknown")}</span>
    </div>
  );
}

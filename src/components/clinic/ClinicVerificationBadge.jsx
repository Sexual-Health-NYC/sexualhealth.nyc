import { useTranslation } from "react-i18next";

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
    recent: "bg-open", // green - recently verified
    aging: "bg-amber-600", // amber/orange - getting stale
    stale: "bg-red-600", // red - needs re-verification
    unknown: "bg-gray-400", // light gray - not yet verified (not alarming)
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
    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${statusColors[status]}`}
        aria-hidden="true"
      />
      <span>{timeDisplay || t("messages:verifiedUnknown")}</span>
    </div>
  );
}

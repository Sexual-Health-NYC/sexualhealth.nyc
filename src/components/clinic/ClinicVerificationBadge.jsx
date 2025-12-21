import { useTranslation } from "react-i18next";
import theme from "../../theme";

// Parse date from data_sources string like "Gemini Deep Research Dec 2025"
function parseVerificationDate(dataSource) {
  if (!dataSource) return null;

  // Match patterns like "Dec 2025", "December 2024", "(Dec 2024)"
  const monthMap = {
    jan: 0,
    january: 0,
    feb: 1,
    february: 1,
    mar: 2,
    march: 2,
    apr: 3,
    april: 3,
    may: 4,
    jun: 5,
    june: 5,
    jul: 6,
    july: 6,
    aug: 7,
    august: 7,
    sep: 8,
    september: 8,
    oct: 9,
    october: 9,
    nov: 10,
    november: 10,
    dec: 11,
    december: 11,
  };

  const regex =
    /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{4})\b/i;
  const match = dataSource.match(regex);

  if (match) {
    const month = monthMap[match[1].toLowerCase()];
    const year = parseInt(match[2], 10);
    // Use middle of month as approximate date
    return new Date(year, month, 15);
  }

  return null;
}

function getVerificationStatus(clinic) {
  // First try last_verified field
  let verifiedDate = clinic.last_verified
    ? new Date(clinic.last_verified)
    : null;

  // Fall back to parsing data_sources
  if (!verifiedDate || isNaN(verifiedDate.getTime())) {
    verifiedDate = parseVerificationDate(clinic.data_sources);
  }

  if (!verifiedDate) {
    return { status: "unknown", monthsAgo: null, date: null };
  }

  const now = new Date();
  const monthsAgo =
    (now.getFullYear() - verifiedDate.getFullYear()) * 12 +
    (now.getMonth() - verifiedDate.getMonth());

  if (monthsAgo <= 3) {
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
    recent: theme.colors.open,
    aging: "#d97706", // amber/orange
    stale: theme.colors.textSecondary,
    unknown: theme.colors.textSecondary,
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

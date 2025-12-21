/**
 * Hours utilities for structured hours data
 *
 * Hours format (from GeoJSON):
 * [
 *   { department: "General", days: ["Mon", "Tue", "Wed"], open: "09:00", close: "17:00", allDay: false, notes: "" },
 *   { department: "Abortion", days: ["Thu"], open: "", close: "", allDay: true, notes: "" }
 * ]
 */

const DAY_ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

// Major US holidays when clinics are likely closed (2025-2028)
const HOLIDAYS = [
  // 2025
  "2025-12-25", // Christmas
  "2026-01-01", // New Year's Day
  // 2026
  "2026-01-19", // MLK Day
  "2026-02-16", // Presidents Day
  "2026-05-25", // Memorial Day
  "2026-07-03", // Independence Day (observed)
  "2026-09-07", // Labor Day
  "2026-11-26", // Thanksgiving
  "2026-12-25", // Christmas
  "2027-01-01", // New Year's Day
  // 2027
  "2027-01-18", // MLK Day
  "2027-02-15", // Presidents Day
  "2027-05-31", // Memorial Day
  "2027-07-05", // Independence Day (observed)
  "2027-09-06", // Labor Day
  "2027-11-25", // Thanksgiving
  "2027-12-24", // Christmas (observed)
  "2028-01-01", // New Year's Day (observed from 2027)
  // 2028
  "2028-01-17", // MLK Day
  "2028-02-21", // Presidents Day
  "2028-05-29", // Memorial Day
  "2028-07-04", // Independence Day
  "2028-09-04", // Labor Day
  "2028-11-23", // Thanksgiving
  "2028-12-25", // Christmas
  "2029-01-01", // New Year's Day
];

/**
 * Get current time in NYC timezone
 */
function getNYCTime() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
  );
}

/**
 * Check if today is a major holiday
 */
export function isHoliday(date = getNYCTime()) {
  const dateStr = date.toISOString().split("T")[0];
  return HOLIDAYS.includes(dateStr);
}

/**
 * Get today's holiday i18n key (for use with holidays namespace)
 * Returns key like "christmas", "thanksgiving", etc.
 */
export function getHolidayKey() {
  const now = getNYCTime();
  const todayStr = now.toISOString().split("T")[0];

  const holidayKeys = {
    // 2025
    "2025-12-25": "christmas",
    "2026-01-01": "newYearsDay",
    // 2026
    "2026-01-19": "mlkDay",
    "2026-02-16": "presidentsDay",
    "2026-05-25": "memorialDay",
    "2026-07-03": "independenceDay",
    "2026-09-07": "laborDay",
    "2026-11-26": "thanksgiving",
    "2026-12-25": "christmas",
    "2027-01-01": "newYearsDay",
    // 2027
    "2027-01-18": "mlkDay",
    "2027-02-15": "presidentsDay",
    "2027-05-31": "memorialDay",
    "2027-07-05": "independenceDay",
    "2027-09-06": "laborDay",
    "2027-11-25": "thanksgiving",
    "2027-12-24": "christmas",
    "2028-01-01": "newYearsDay",
    // 2028
    "2028-01-17": "mlkDay",
    "2028-02-21": "presidentsDay",
    "2028-05-29": "memorialDay",
    "2028-07-04": "independenceDay",
    "2028-09-04": "laborDay",
    "2028-11-23": "thanksgiving",
    "2028-12-25": "christmas",
    "2029-01-01": "newYearsDay",
  };

  return holidayKeys[todayStr] || null;
}

/**
 * Parse time string "09:00" or "17:30" to minutes since midnight
 */
function parseTime(timeStr) {
  if (!timeStr) return null;
  const [hours, mins] = timeStr.split(":").map(Number);
  return hours * 60 + (mins || 0);
}

/**
 * Format minutes since midnight to display time "9:00 AM"
 */
function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return mins === 0
    ? `${displayHours} ${period}`
    : `${displayHours}:${mins.toString().padStart(2, "0")} ${period}`;
}

/**
 * Check if clinic is currently open based on structured hours
 * Returns: { isOpen, currentSchedule, closesAt, opensAt, nextOpen }
 */
export function getOpenStatus(hours, hoursText = "") {
  // Handle legacy text format for clinics without structured hours
  if (!hours || hours.length === 0) {
    if (hoursText) {
      return getLegacyOpenStatus(hoursText);
    }
    return null;
  }

  const now = getNYCTime();
  const currentDayName = DAY_ORDER[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Find schedules that apply to today
  const todaySchedules = hours.filter(
    (h) => h.days && h.days.includes(currentDayName),
  );

  // Check if currently open
  for (const schedule of todaySchedules) {
    if (schedule.allDay) {
      return {
        isOpen: true,
        status: "open",
        department: schedule.department,
        closesAt: null,
        note: schedule.notes,
      };
    }

    const openTime = parseTime(schedule.open);
    const closeTime = parseTime(schedule.close);

    if (openTime !== null && closeTime !== null) {
      if (currentMinutes >= openTime && currentMinutes < closeTime) {
        return {
          isOpen: true,
          status: "open",
          department: schedule.department,
          closesAt: formatTime(closeTime),
          note: schedule.notes,
        };
      }

      // Opens later today
      if (currentMinutes < openTime) {
        return {
          isOpen: false,
          status: "opensLater",
          department: schedule.department,
          opensAt: formatTime(openTime),
          closesAt: formatTime(closeTime),
          note: schedule.notes,
        };
      }
    }
  }

  // Closed today - find next open
  const nextOpen = findNextOpen(hours, now);

  return {
    isOpen: false,
    status: "closed",
    nextOpen,
  };
}

/**
 * Find when the clinic next opens
 */
function findNextOpen(hours, fromDate) {
  const startDayIndex = fromDate.getDay();

  // Check next 7 days
  for (let offset = 1; offset <= 7; offset++) {
    const checkDayIndex = (startDayIndex + offset) % 7;
    const checkDayName = DAY_ORDER[checkDayIndex];

    const daySchedules = hours.filter(
      (h) => h.days && h.days.includes(checkDayName),
    );

    if (daySchedules.length > 0) {
      // Find earliest opening
      let earliestOpen = null;
      let earliestSchedule = null;

      for (const schedule of daySchedules) {
        if (schedule.allDay) {
          return {
            day: checkDayName,
            time: null,
            department: schedule.department,
          };
        }

        const openTime = parseTime(schedule.open);
        if (
          openTime !== null &&
          (earliestOpen === null || openTime < earliestOpen)
        ) {
          earliestOpen = openTime;
          earliestSchedule = schedule;
        }
      }

      if (earliestOpen !== null) {
        return {
          day: checkDayName,
          time: formatTime(earliestOpen),
          department: earliestSchedule.department,
        };
      }
    }
  }

  return null;
}

/**
 * Legacy parser for text-based hours (fallback)
 */
function getLegacyOpenStatus(hoursText) {
  if (!hoursText) return null;
  if (hoursText.toLowerCase().includes("24/7")) {
    return { isOpen: true, status: "open" };
  }
  if (hoursText.toLowerCase().includes("by appointment")) {
    return null;
  }
  // Can't reliably parse - return null
  return null;
}

/**
 * Format hours array for display in UI
 * Groups by department and consolidates days
 * @param {Array} hours - Array of hour objects
 * @param {Function} translateDay - Function to translate day names (key => localized name)
 */
export function formatHoursForDisplay(hours, translateDay = (d) => d) {
  if (!hours || hours.length === 0) return [];

  // Group by department
  const byDept = {};
  for (const h of hours) {
    const dept = h.department || "General";
    if (!byDept[dept]) byDept[dept] = [];
    byDept[dept].push(h);
  }

  const result = [];

  for (const [dept, schedules] of Object.entries(byDept)) {
    // Try to consolidate schedules with same times
    const consolidated = consolidateSchedules(schedules, translateDay);

    result.push({
      department: dept,
      schedules: consolidated,
    });
  }

  return result;
}

/**
 * Consolidate schedules with same times into single entries
 */
function consolidateSchedules(schedules, translateDay = (d) => d) {
  // Group by time signature
  const byTime = {};

  for (const s of schedules) {
    // Skip invalid entries (no days or no times unless allDay)
    if (!s.days || s.days.length === 0) continue;
    if (!s.allDay && (!s.open || !s.close)) continue;

    const timeKey = s.allDay ? "allDay" : `${s.open}-${s.close}`;
    if (!byTime[timeKey]) {
      byTime[timeKey] = { ...s, days: [...(s.days || [])] };
    } else {
      // Merge days
      for (const day of s.days || []) {
        if (!byTime[timeKey].days.includes(day)) {
          byTime[timeKey].days.push(day);
        }
      }
    }
  }

  // Sort days and format
  return Object.values(byTime).map((s) => {
    // Sort days by day order
    s.days.sort((a, b) => DAY_INDEX[a] - DAY_INDEX[b]);
    return {
      days: formatDayRange(s.days, translateDay),
      time: s.allDay
        ? null
        : `${formatTime(parseTime(s.open))} - ${formatTime(parseTime(s.close))}`,
      isAllDay: s.allDay || false,
      notes: s.notes,
    };
  });
}

/**
 * Format day array into readable range
 * ["Mon", "Tue", "Wed", "Thu", "Fri"] -> "Mon - Fri" (localized)
 * ["Mon", "Wed", "Fri"] -> "Mon, Wed, Fri" (localized)
 * ["Sat", "Sun"] -> "Sat - Sun" (localized)
 */
function formatDayRange(days, translateDay = (d) => d) {
  if (days.length === 0) return "";
  if (days.length === 1) return translateDay(days[0]);

  // Check if consecutive
  const indices = days.map((d) => DAY_INDEX[d]).sort((a, b) => a - b);
  let isConsecutive = true;
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] !== indices[i - 1] + 1) {
      isConsecutive = false;
      break;
    }
  }

  if (isConsecutive && days.length > 2) {
    return `${translateDay(days[0])} - ${translateDay(days[days.length - 1])}`;
  }

  return days.map(translateDay).join(", ");
}

/**
 * Check if clinic is open after a specific hour today (e.g., 17 for 5 PM)
 */
export function isOpenAfter(hours, afterHour = 17) {
  if (!hours || hours.length === 0) return false;

  const now = getNYCTime();
  const currentDayName = DAY_ORDER[now.getDay()];
  const afterMinutes = afterHour * 60;

  // Find schedules that apply to today
  const todaySchedules = hours.filter(
    (h) => h.days && h.days.includes(currentDayName),
  );

  for (const schedule of todaySchedules) {
    // All day means open after 5pm
    if (schedule.allDay) return true;

    const closeTime = parseTime(schedule.close);
    // If clinic closes after the target hour, it's open after that hour
    if (closeTime !== null && closeTime > afterMinutes) {
      return true;
    }
  }

  return false;
}

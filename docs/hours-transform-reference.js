/**
 * Reference implementation for transforming Airtable Hours records
 * into structured JSON for the GeoJSON export
 *
 * This is NOT the actual export script, just a reference showing the logic
 */

// Example Airtable Hours records for a clinic
const exampleHoursRecords = [
  {
    clinic: "Callen-Lorde Chelsea",
    department: "General",
    days: "Mon/Wed/Fri",
    openTime: "08:00",
    closeTime: "17:30",
    allDay: false,
    notes: "",
  },
  {
    clinic: "Callen-Lorde Chelsea",
    department: "General",
    days: "Tue/Thu",
    openTime: "08:00",
    closeTime: "20:30",
    allDay: false,
    notes: "",
  },
];

/**
 * Parse day string into array of normalized day names
 */
function parseDays(daysString) {
  const dayMap = {
    sun: "Sunday",
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
  };

  const normalized = daysString.toLowerCase().trim();

  // Handle special cases
  if (normalized === "weekdays") {
    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  }
  if (normalized === "weekend") {
    return ["Saturday", "Sunday"];
  }
  if (normalized === "daily" || normalized === "every day") {
    return [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
  }

  // Handle ranges like "Mon-Fri"
  const rangeMatch = normalized.match(/^(\w+)-(\w+)$/);
  if (rangeMatch) {
    const startDay = rangeMatch[1].substring(0, 3);
    const endDay = rangeMatch[2].substring(0, 3);
    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const startIdx = days.indexOf(startDay);
    const endIdx = days.indexOf(endDay);

    if (startIdx !== -1 && endIdx !== -1) {
      const result = [];
      for (let i = startIdx; i <= endIdx; i++) {
        result.push(dayMap[days[i]]);
      }
      return result;
    }
  }

  // Handle slash-separated like "Mon/Wed/Fri"
  if (normalized.includes("/")) {
    return normalized
      .split("/")
      .map((d) => {
        const day = d.trim().substring(0, 3);
        return dayMap[day];
      })
      .filter(Boolean);
  }

  // Handle comma-separated like "Mon, Wed, Fri"
  if (normalized.includes(",")) {
    return normalized
      .split(",")
      .map((d) => {
        const day = d.trim().substring(0, 3);
        return dayMap[day];
      })
      .filter(Boolean);
  }

  // Single day
  const singleDay = normalized.substring(0, 3);
  if (dayMap[singleDay]) {
    return [dayMap[singleDay]];
  }

  // Couldn't parse - return empty array
  console.warn(`Could not parse days: "${daysString}"`);
  return [];
}

/**
 * Convert 24h time to 12h format for display
 */
function formatTime12h(time24) {
  if (!time24) return "";

  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "pm" : "am";
  const hours12 = hours % 12 || 12;

  // Omit minutes if :00
  if (minutes === 0) {
    return `${hours12}${period}`;
  }
  return `${hours12}:${minutes.toString().padStart(2, "0")}${period}`;
}

/**
 * Format days array for display
 */
function formatDaysForDisplay(days) {
  // Check for common patterns
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const weekend = ["Saturday", "Sunday"];

  if (
    days.length === weekdays.length &&
    weekdays.every((d) => days.includes(d))
  ) {
    return "Mon-Fri";
  }
  if (
    days.length === weekend.length &&
    weekend.every((d) => days.includes(d))
  ) {
    return "Sat-Sun";
  }

  // Check for ranges
  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const indices = days
    .map((d) => dayOrder.indexOf(d))
    .filter((i) => i !== -1)
    .sort((a, b) => a - b);

  // Check if consecutive
  let isConsecutive = true;
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] !== indices[i - 1] + 1) {
      isConsecutive = false;
      break;
    }
  }

  if (isConsecutive && indices.length > 2) {
    const startDay = dayOrder[indices[0]].substring(0, 3);
    const endDay = dayOrder[indices[indices.length - 1]].substring(0, 3);
    return `${startDay}-${endDay}`;
  }

  // Use slash notation for non-consecutive
  return days.map((d) => d.substring(0, 3)).join("/");
}

/**
 * Transform Hours records into structured data and display string
 */
function transformHours(hoursRecords) {
  if (!hoursRecords || hoursRecords.length === 0) {
    return { hours_data: [], hours: "" };
  }

  // Build structured data
  const hours_data = hoursRecords.map((record) => {
    const entry = {
      days: parseDays(record.days),
    };

    // Add department if specified and not "General"
    if (record.department && record.department !== "General") {
      entry.dept = record.department;
    }

    if (record.allDay) {
      entry.allDay = true;
    } else {
      entry.open = record.openTime;
      entry.close = record.closeTime;
    }

    if (record.notes) {
      entry.notes = record.notes;
    }

    return entry;
  });

  // Generate display string
  const displayParts = [];

  // Group by department
  const byDept = {};
  hoursRecords.forEach((record) => {
    const dept = record.department || "General";
    if (!byDept[dept]) byDept[dept] = [];
    byDept[dept].push(record);
  });

  // Format each department
  Object.entries(byDept).forEach(([dept, records]) => {
    const schedules = records
      .map((r) => {
        const days = formatDaysForDisplay(parseDays(r.days));
        if (r.allDay) {
          return days;
        }
        const open = formatTime12h(r.openTime);
        const close = formatTime12h(r.closeTime);
        let schedule = `${days} ${open}-${close}`;
        if (r.notes) {
          schedule += ` ${r.notes}`;
        }
        return schedule;
      })
      .join("; ");

    if (dept === "General" && Object.keys(byDept).length === 1) {
      // Don't prefix with department name if only one department
      displayParts.push(schedules);
    } else {
      displayParts.push(`${dept}: ${schedules}`);
    }
  });

  const hours = displayParts.join("; ");

  return { hours_data, hours };
}

// Example usage
console.log("=== Example 1: Callen-Lorde Chelsea ===");
const result1 = transformHours(exampleHoursRecords);
console.log("Display string:", result1.hours);
console.log("Structured data:", JSON.stringify(result1.hours_data, null, 2));

// Example 2: Complex multi-department
const complexRecords = [
  {
    department: "Women's Health",
    days: "Mon-Fri",
    openTime: "09:00",
    closeTime: "17:00",
    allDay: false,
  },
  {
    department: "Adult Primary Care",
    days: "Mon-Thu",
    openTime: "08:00",
    closeTime: "20:00",
    allDay: false,
  },
  {
    department: "Adult Primary Care",
    days: "Fri",
    openTime: "08:00",
    closeTime: "17:00",
    allDay: false,
  },
  {
    department: "Abortion Services",
    days: "Wed",
    allDay: true,
  },
];

console.log("\n=== Example 2: NYC H+H Queens (Complex) ===");
const result2 = transformHours(complexRecords);
console.log("Display string:", result2.hours);
console.log("Structured data:", JSON.stringify(result2.hours_data, null, 2));

// Export functions for use in actual export script
module.exports = {
  parseDays,
  formatTime12h,
  formatDaysForDisplay,
  transformHours,
};

/**
 * Parse hours string and determine if clinic is open now
 * Expected formats:
 * - "Mon-Fri 9am-5pm"
 * - "24/7"
 * - "Mon-Wed 9am-5pm, Thu-Fri 10am-6pm"
 * - "By appointment only"
 */
export function isOpenNow(hoursString) {
  if (!hoursString) return null;

  // Handle special cases
  if (hoursString.toLowerCase().includes("24/7")) return true;
  if (hoursString.toLowerCase().includes("by appointment")) return null;

  try {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutes since midnight

    // Simple parser for "Mon-Fri 9am-5pm" format
    const dayMap = {
      sun: 0,
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6,
    };

    // Split by comma for multiple hour ranges
    const ranges = hoursString.split(",");

    for (const range of ranges) {
      // Match patterns like "Mon-Fri 9am-5pm" or "Monday 9:00am-5:00pm"
      const match = range.match(
        /(\w+)(?:-(\w+))?\s+(\d{1,2}):?(\d{2})?\s*(am|pm)\s*-\s*(\d{1,2}):?(\d{2})?\s*(am|pm)/i,
      );

      if (!match) continue;

      const [
        ,
        startDay,
        endDay,
        startHour,
        startMin,
        startPeriod,
        endHour,
        endMin,
        endPeriod,
      ] = match;

      // Convert day names to numbers
      const startDayNum = dayMap[startDay.toLowerCase().slice(0, 3)];
      const endDayNum = endDay
        ? dayMap[endDay.toLowerCase().slice(0, 3)]
        : startDayNum;

      // Check if current day is in range
      const isDayInRange = currentDay >= startDayNum && currentDay <= endDayNum;

      if (!isDayInRange) continue;

      // Convert times to minutes since midnight
      const start =
        (parseInt(startHour) % 12) * 60 +
        parseInt(startMin || 0) +
        (startPeriod.toLowerCase() === "pm" ? 12 * 60 : 0);

      const end =
        (parseInt(endHour) % 12) * 60 +
        parseInt(endMin || 0) +
        (endPeriod.toLowerCase() === "pm" ? 12 * 60 : 0);

      // Check if current time is in range
      if (currentTime >= start && currentTime <= end) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error parsing hours:", error);
    return null; // Unable to determine
  }
}

/**
 * Get status badge info (without label - component should translate)
 */
export function getOpenStatus(hoursString) {
  const isOpen = isOpenNow(hoursString);

  if (isOpen === null) {
    return null; // Don't show badge if we can't determine
  }

  return {
    isOpen,
    color: isOpen ? "#10b981" : "#94a3b8",
  };
}

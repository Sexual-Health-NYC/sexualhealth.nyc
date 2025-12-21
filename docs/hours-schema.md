# Hours Data Structure

## Airtable Schema

### Hours Table (new)

Create a new table called "Hours" with these fields:

| Field Name   | Field Type       | Description                               | Example                                          |
| ------------ | ---------------- | ----------------------------------------- | ------------------------------------------------ |
| `Clinic`     | Link to Clinics  | The clinic this schedule applies to       | Link to "Callen-Lorde Chelsea"                   |
| `Department` | Single line text | Department/service name (optional)        | "Women's Health", "Abortion Services", "General" |
| `Days`       | Single line text | Days of week                              | "Mon-Fri", "Mon/Wed/Fri", "Tuesday", "Weekdays"  |
| `Open Time`  | Single line text | Opening time in 24h format                | "09:00", "08:30"                                 |
| `Close Time` | Single line text | Closing time in 24h format                | "17:00", "20:00"                                 |
| `All Day`    | Checkbox         | Check if open all day (no specific hours) | ☑ for "Abortion: Wednesdays"                    |
| `Notes`      | Single line text | Additional context                        | "(Check for late nights)", "Express hours"       |

### Clinics Table (modified)

Add this field to the existing Clinics table:

| Field Name       | Field Type          | Description            |
| ---------------- | ------------------- | ---------------------- |
| `Hours (Linked)` | Link to Hours table | Multiple links allowed |

Keep the existing `Hours` text field for legacy/manual overrides.

## Data Flow

```
Airtable Hours Records
    ↓
Export Script (scripts/export-airtable.js)
    ↓
Structured JSON + Display String
    ↓
GeoJSON (public/clinics.geojson)
    ↓
React App
```

## JSON Structure in GeoJSON

Each clinic in the GeoJSON will have:

```json
{
  "properties": {
    "hours": "Women's Health: Mon-Fri 9am-5pm; Abortion: Wednesdays",
    "hours_data": [
      {
        "dept": "Women's Health",
        "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "open": "09:00",
        "close": "17:00"
      },
      {
        "dept": "Abortion Services",
        "days": ["Wednesday"],
        "allDay": true
      }
    ]
  }
}
```

## Day Name Normalization

The export script should normalize day references:

| Input Variations | Normalized Array                                           |
| ---------------- | ---------------------------------------------------------- |
| "Mon-Fri"        | `["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]` |
| "Mon/Wed/Fri"    | `["Monday", "Wednesday", "Friday"]`                        |
| "Weekdays"       | `["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]` |
| "Weekend"        | `["Saturday", "Sunday"]`                                   |
| "Mon-Thu"        | `["Monday", "Tuesday", "Wednesday", "Thursday"]`           |

## Display String Generation

The export script generates human-readable strings:

- Single department: "Mon-Fri 9am-5pm"
- Multiple departments: "Women's Health: Mon-Fri 9am-5pm; STD Clinic: Tue & Fri 1pm-4pm"
- All day: "Abortion: Wednesdays"
- With notes: "Mon-Fri 9am-5pm (Check for late nights)"

## Migration Path

1. Create Hours table in Airtable
2. Add `Hours (Linked)` field to Clinics table
3. Run AI migration script to parse existing `Hours` text into Hours records
4. Update export script to use linked Hours records
5. Gradually verify and clean up Hours records
6. Eventually deprecate the old `Hours` text field (but keep as override/fallback)

## Example Airtable Entries

### Simple Case: Callen-Lorde Chelsea

| Clinic               | Department | Days        | Open Time | Close Time | All Day | Notes |
| -------------------- | ---------- | ----------- | --------- | ---------- | ------- | ----- |
| Callen-Lorde Chelsea | General    | Mon/Wed/Fri | 08:00     | 17:30      |         |       |
| Callen-Lorde Chelsea | General    | Tue/Thu     | 08:00     | 20:30      |         |       |

### Complex Case: NYC Health + Hospitals/Queens

| Clinic         | Department         | Days    | Open Time | Close Time | All Day | Notes |
| -------------- | ------------------ | ------- | --------- | ---------- | ------- | ----- |
| NYC H+H Queens | Women's Health     | Mon-Fri | 09:00     | 17:00      |         |       |
| NYC H+H Queens | Adult Primary Care | Mon-Thu | 08:00     | 20:00      |         |       |
| NYC H+H Queens | Adult Primary Care | Fri     | 08:00     | 17:00      |         |       |
| NYC H+H Queens | Adult Primary Care | Sat     | 08:00     | 16:00      |         |       |
| NYC H+H Queens | Abortion Services  | Wed     |           |            | ☑      |       |

### Edge Case: Vague Hours

| Clinic        | Department | Days    | Open Time | Close Time | All Day | Notes          |
| ------------- | ---------- | ------- | --------- | ---------- | ------- | -------------- |
| Housing Works | General    | Mon-Fri |           |            |         | Business Hours |

## Usage in Frontend

### Current Implementation (src/utils/hours.js)

The `isOpenNow()` function attempts to parse the legacy `hours` string.

### Enhanced Implementation (TODO)

```javascript
// Use structured hours_data if available, fall back to parsing hours string
export function isOpenNow(clinic) {
  if (clinic.hours_data && clinic.hours_data.length > 0) {
    return isOpenNowStructured(clinic.hours_data);
  }
  // Fallback to parsing hours string
  return isOpenNowLegacy(clinic.hours);
}

function isOpenNowStructured(hoursData) {
  const now = new Date();
  const currentDay = getDayName(now.getDay()); // "Monday", "Tuesday", etc.
  const currentTime = now.getHours() * 60 + now.getMinutes();

  for (const schedule of hoursData) {
    if (!schedule.days.includes(currentDay)) continue;

    if (schedule.allDay) return true;

    const openMinutes = timeToMinutes(schedule.open);
    const closeMinutes = timeToMinutes(schedule.close);

    if (currentTime >= openMinutes && currentTime <= closeMinutes) {
      return true;
    }
  }

  return false;
}
```

## Benefits

1. **Accurate "Open Now" detection** - No more regex parsing failures
2. **Department-specific hours** - Show different hours for different services
3. **Future features** - Can add "find clinics open now" filter
4. **Human-editable** - Clear structured data in Airtable
5. **Maintainable** - Changes in Airtable immediately reflected in export
6. **Backward compatible** - Falls back to text parsing if structured data missing

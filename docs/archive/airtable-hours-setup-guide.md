# Airtable Hours Table Setup Guide

## Step-by-Step Instructions

### 1. Create the Hours Table

1. Open your Airtable base
2. Click the `+` button to add a new table
3. Name it **"Hours"**

### 2. Add Fields to Hours Table

Delete the default "Name" field and create these fields:

#### Field 1: Clinic (Link to Clinics)

- Click `+` to add field
- Type: **Link to another record**
- Link to: **Clinics** table
- Field name: **Clinic**
- Allow linking to multiple records: **No**

#### Field 2: Department

- Click `+` to add field
- Type: **Single line text**
- Field name: **Department**
- Description: "Department or service (e.g., Women's Health, General, Abortion Services)"

#### Field 3: Days

- Click `+` to add field
- Type: **Single line text**
- Field name: **Days**
- Description: "Days of operation (e.g., Mon-Fri, Mon/Wed/Fri, Tuesday)"

#### Field 4: Open Time

- Click `+` to add field
- Type: **Single line text**
- Field name: **Open Time**
- Description: "Opening time in 24h format (e.g., 09:00, 08:30)"

#### Field 5: Close Time

- Click `+` to add field
- Type: **Single line text**
- Field name: **Close Time**
- Description: "Closing time in 24h format (e.g., 17:00, 20:00)"

#### Field 6: All Day

- Click `+` to add field
- Type: **Checkbox**
- Field name: **All Day**
- Description: "Check if open all day (no specific hours)"

#### Field 7: Notes

- Click `+` to add field
- Type: **Single line text**
- Field name: **Notes**
- Description: "Additional context (e.g., Check for late nights, Express hours)"

### 3. Add Field to Clinics Table

1. Go to your **Clinics** table
2. Click `+` to add a new field
3. Type: **Link to another record**
4. Link to: **Hours** table
5. Field name: **Hours (Linked)**
6. Allow linking to multiple records: **Yes** ✓
7. Description: "Structured hours data"

### 4. Test with Sample Data

Create a test Hours record:

| Clinic            | Department | Days    | Open Time | Close Time | All Day | Notes |
| ----------------- | ---------- | ------- | --------- | ---------- | ------- | ----- |
| (Select a clinic) | General    | Mon-Fri | 09:00     | 17:00      | ☐       |       |

The clinic should now show this Hours record in its "Hours (Linked)" field.

### 5. Field Order (Recommended)

Drag fields in the Hours table to this order for easier data entry:

1. Clinic
2. Department
3. Days
4. Open Time
5. Close Time
6. All Day
7. Notes

### 6. Create Views (Optional but Recommended)

#### View 1: By Clinic

- Group by: **Clinic**
- Sort by: **Department** (A→Z)
- This helps you see all hours for each clinic together

#### View 2: Needs Review

- Filter: **Open Time** is empty AND **All Day** is unchecked
- Shows incomplete hours records

## Quick Reference

### Common Department Names

- General
- Women's Health
- Adult Primary Care
- Abortion Services
- STD Clinic
- Pride Health Center
- Teen Health Center

### Days Format Examples

- `Mon-Fri` (Monday through Friday)
- `Mon/Wed/Fri` (Monday, Wednesday, Friday only)
- `Weekdays` (Mon-Fri)
- `Weekend` (Sat-Sun)
- `Tuesday` (single day)
- `Mon-Thu` (Monday through Thursday)

### Time Format

Always use 24-hour format with colon:

- `09:00` (9am)
- `17:00` (5pm)
- `20:30` (8:30pm)
- `08:30` (8:30am)

## Data Entry Tips

1. **Start with simple cases** - Clinics with one set of hours
2. **Use General department** for clinics with uniform hours across all services
3. **Create multiple records** for different schedules (e.g., one for Mon-Thu, one for Fri)
4. **Check All Day** for services like "Abortion: Wednesdays" with no specific times
5. **Use Notes sparingly** - Only for important context

## Example Entries

### Simple: Monday-Friday, same hours

- Clinic: Callen-Lorde Chelsea
- Department: General
- Days: Mon-Fri
- Open Time: 09:00
- Close Time: 17:00

### Complex: Different hours different days

Create 2 records:

**Record 1:**

- Clinic: Callen-Lorde Chelsea
- Department: General
- Days: Mon/Wed/Fri
- Open Time: 08:00
- Close Time: 17:30

**Record 2:**

- Clinic: Callen-Lorde Chelsea
- Department: General
- Days: Tue/Thu
- Open Time: 08:00
- Close Time: 20:30

### Multi-department

**Record 1:**

- Clinic: NYC H+H Queens
- Department: Women's Health
- Days: Mon-Fri
- Open Time: 09:00
- Close Time: 17:00

**Record 2:**

- Clinic: NYC H+H Queens
- Department: Abortion Services
- Days: Wed
- All Day: ✓

## Troubleshooting

**Q: Can I use 12-hour time format (9am, 5pm)?**
A: No, use 24-hour format (09:00, 17:00). The export script will convert it for display.

**Q: What if hours vary by week or season?**
A: Use the Notes field (e.g., "Summer hours" or "Check website for current schedule").

**Q: Should I delete the old Hours text field?**
A: Not yet! Keep it as a fallback until the Hours table is fully populated.

**Q: What about "By appointment only"?**
A: Leave Open Time and Close Time empty, put "By appointment only" in Notes.

## Next Steps

After setting up the table:

1. Use AI to migrate existing hours text → Hours records
2. Manually verify and clean up the migrated data
3. Update the export script to use Hours (Linked) field
4. Test the new structured hours in the app

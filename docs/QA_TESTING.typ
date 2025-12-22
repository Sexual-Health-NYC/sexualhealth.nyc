#set document(title: "sexualhealth.nyc QA Testing Guide")
#set page(margin: 1in)
#set text(font: "Inter", size: 11pt)
#set heading(numbering: "1.")

#align(center)[
  #text(size: 24pt, weight: "bold")[sexualhealth.nyc]
  #linebreak()
  #text(size: 16pt)[Manual QA Testing Guide]
  #linebreak()
  #text(size: 11pt, fill: gray)[December 2025]
]

#v(1em)

= Overview

This document covers manual QA testing procedures for sexualhealth.nyc. All features must be tested on *both desktop and mobile* viewports.

#table(
  columns: (1fr, 1fr),
  inset: 8pt,
  [*Desktop*], [*Mobile*],
  [Chrome/Firefox/Safari], [iOS Safari, Android Chrome],
  [Width ≥ 768px], [Width < 768px],
  [Detail panel (right side)], [Bottom sheet (swipeable)],
)

= Pre-Test Setup

+ Clear browser cache and localStorage
+ Open DevTools Network tab (disable cache)
+ For mobile: Use real devices OR Chrome DevTools device emulation
+ Note the commit hash shown in About modal (footer) for bug reports

= Critical Path Tests

== 1. Initial Load

#table(
  columns: (auto, 1fr, auto, auto),
  inset: 6pt,
  [*#*], [*Test*], [*Desktop*], [*Mobile*],
  [1.1], [Page loads without errors (check console)], [☐], [☐],
  [1.2], [Map renders with clinic markers], [☐], [☐],
  [1.3], [FilterBar appears at top], [☐], [☐],
  [1.4], [Footer is visible at bottom], [☐], [☐],
  [1.5], [No horizontal scrolling/overflow], [☐], [☐],
)

== 2. Footer Visibility (Known Issue Area)

#block(fill: rgb("#fff3cd"), inset: 8pt, radius: 4pt)[
  *Note:* Recent changes to ensure footer always shows on mobile. Verify this works after clearing cache. If footer is hidden, cache busting may not be working.
]

#table(
  columns: (auto, 1fr, auto, auto),
  inset: 6pt,
  [*#*], [*Test*], [*Desktop*], [*Mobile*],
  [2.1], [Footer visible on map view], [☐], [☐],
  [2.2], [Footer visible on list view], [☐], [☐],
  [2.3], [Footer visible when bottom sheet is open (mobile)], [—], [☐],
  [2.4], [Footer visible when panel is open (desktop)], [☐], [—],
  [2.5], [About modal opens from footer], [☐], [☐],
  [2.6], [Privacy modal opens from footer], [☐], [☐],
  [2.7], [Language modal opens from footer], [☐], [☐],
  [2.8], [Commit hash visible in About modal], [☐], [☐],
)

== 3. Cache Busting Verification

#table(
  columns: (auto, 1fr, auto, auto),
  inset: 6pt,
  [*#*], [*Test*], [*Desktop*], [*Mobile*],
  [3.1], [Hard refresh (Cmd+Shift+R) loads new assets], [☐], [☐],
  [3.2], [Check Network tab: JS files have hash in filename], [☐], [☐],
  [3.3], [After deploy: new commit hash shows in About modal], [☐], [☐],
)

== 4. Map Functionality

#table(
  columns: (auto, 1fr, auto, auto),
  inset: 6pt,
  [*#*], [*Test*], [*Desktop*], [*Mobile*],
  [4.1], [Map pans and zooms], [☐], [☐],
  [4.2], [Clicking marker opens detail panel/sheet], [☐], [☐],
  [4.3], [Marker clusters expand on zoom], [☐], [☐],
  [4.4], [Clicking cluster zooms to show individual markers], [☐], [☐],
  [4.5], [ESC key closes detail panel], [☐], [☐],
)

== 5. Filter System

#table(
  columns: (auto, 1fr, auto, auto),
  inset: 6pt,
  [*#*], [*Test*], [*Desktop*], [*Mobile*],
  [5.1], [Service filters (STI, PrEP, Abortion, etc.) work], [☐], [☐],
  [5.2], [Borough filter works], [☐], [☐],
  [5.3], [Insurance filters work], [☐], [☐],
  [5.4], [Gender-affirming care sub-filters appear], [☐], [☐],
  [5.5], [Search by clinic name works], [☐], [☐],
  [5.6], ["Open now" filter works (test during business hours)], [☐], [☐],
  [5.7], [Gestational weeks slider filters abortion clinics], [☐], [☐],
  [5.8], [Multiple filters combine correctly (AND logic)], [☐], [☐],
  [5.9], [Subway line filter works], [☐], [☐],
  [5.10], [Clear filters resets all], [☐], [☐],
)

== 6. Clinic Details

#table(
  columns: (auto, 1fr, auto, auto),
  inset: 6pt,
  [*#*], [*Test*], [*Desktop*], [*Mobile*],
  [6.1], [Clinic name and address display], [☐], [☐],
  [6.2], [Hours display correctly (or "Appointment only")], [☐], [☐],
  [6.3], [Phone number is clickable (tel: link)], [☐], [☐],
  [6.4], [Website link opens in new tab], [☐], [☐],
  [6.5], [Service badges display correctly], [☐], [☐],
  [6.6], [Directions button works], [☐], [☐],
  [6.7], ["Report a correction" form opens], [☐], [☐],
)

== 7. List View

#table(
  columns: (auto, 1fr, auto, auto),
  inset: 6pt,
  [*#*], [*Test*], [*Desktop*], [*Mobile*],
  [7.1], [List/Map toggle works], [☐], [☐],
  [7.2], [Clinic cards display correctly], [☐], [☐],
  [7.3], [Clicking card expands details], [☐], [☐],
  [7.4], ["Show on map" button works], [☐], [☐],
  [7.5], [Filters apply to list view], [☐], [☐],
  [7.6], [Virtual/telehealth section appears when filtering GAC/abortion], [☐], [☐],
)

== 8. Virtual Clinics Section

#table(
  columns: (auto, 1fr, auto, auto),
  inset: 6pt,
  [*#*], [*Test*], [*Desktop*], [*Mobile*],
  [8.1], [Section appears when filtering abortion services], [☐], [☐],
  [8.2], [Section appears when filtering gender-affirming care], [☐], [☐],
  [8.3], [Section appears when filtering PrEP], [☐], [☐],
  [8.4], [Folx Health shows with GAC badges], [☐], [☐],
  [8.5], [Plume shows with GAC badges], [☐], [☐],
  [8.6], [Website links work for virtual clinics], [☐], [☐],
)

== 9. Internationalization (i18n)

#table(
  columns: (auto, 1fr, auto, auto),
  inset: 6pt,
  [*#*], [*Test*], [*Desktop*], [*Mobile*],
  [9.1], [Language switcher opens from footer], [☐], [☐],
  [9.2], [Changing language updates all UI text], [☐], [☐],
  [9.3], [RTL languages (Arabic, Hebrew) display correctly], [☐], [☐],
  [9.4], [Language preference persists after refresh], [☐], [☐],
  [9.5], [No missing translation keys (check console)], [☐], [☐],
)

== 10. Accessibility

#table(
  columns: (auto, 1fr, auto, auto),
  inset: 6pt,
  [*#*], [*Test*], [*Desktop*], [*Mobile*],
  [10.1], [Tab navigation works through all interactive elements], [☐], [☐],
  [10.2], [Focus indicators visible], [☐], [☐],
  [10.3], ["Skip to main content" link works], [☐], [—],
  [10.4], [Screen reader announces clinic count on filter change], [☐], [☐],
  [10.5], [Color contrast passes (use axe DevTools)], [☐], [☐],
)

= Mobile-Specific Tests

#table(
  columns: (auto, 1fr, auto),
  inset: 6pt,
  [*#*], [*Test*], [*Pass*],
  [M.1], [Bottom sheet swipes up/down smoothly], [☐],
  [M.2], [Bottom sheet doesn't overlap footer], [☐],
  [M.3], [Touch targets are ≥44px], [☐],
  [M.4], [No accidental zooming on input focus], [☐],
  [M.5], [Filter chips scroll horizontally], [☐],
  [M.6], [Map gestures (pinch-zoom, pan) work], [☐],
)

= Known Issues to Verify Fixed

#table(
  columns: (auto, 1fr, 1fr, auto),
  inset: 6pt,
  [*#*], [*Issue*], [*Fix Applied*], [*Verified*],
  [K.1], [Footer hidden on mobile], [CSS z-index + position], [☐],
  [K.2], [RTL horizontal overflow], [Clip-based sr-only CSS], [☐],
  [K.3], [Language modal too wide], [Removed fixed width], [☐],
)

= Bug Report Template

When filing bugs, include:

```
**Device:** [Desktop Chrome / iPhone 14 Safari / etc.]
**Viewport:** [Desktop / Mobile]
**Commit:** [from About modal]
**Steps to reproduce:**
1. ...
2. ...
**Expected:** ...
**Actual:** ...
**Screenshot:** [attach]
```

= Sign-Off

#table(
  columns: (1fr, 1fr, 1fr),
  inset: 8pt,
  [*Tester*], [*Date*], [*Result*],
  [], [], [☐ Pass / ☐ Fail],
)

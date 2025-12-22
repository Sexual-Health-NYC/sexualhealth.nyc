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

This document covers manual QA testing procedures for sexualhealth.nyc. The most effective testing comes from *embodying real user personas* — people with specific needs, constraints, and contexts.

#table(
  columns: (1fr, 1fr),
  inset: 8pt,
  [*Desktop*], [*Mobile*],
  [Chrome/Firefox/Safari], [iOS Safari, Android Chrome],
  [Width ≥ 768px], [Width < 768px],
  [Detail panel (right side)], [Bottom sheet (swipeable)],
)

= Persona-Based Testing

#block(fill: rgb("#e8f4fd"), inset: 12pt, radius: 4pt)[
  *Testing Philosophy:* Don't just click through features mechanically. Inhabit each persona below. What are they feeling? What do they need to find quickly? What might confuse or frustrate them?
]

== Persona 1: Maria — Urgent STI Concern

#block(fill: rgb("#fff8e1"), inset: 10pt, radius: 4pt)[
  *Context:* 28-year-old woman, noticed symptoms this morning. Anxious, wants to get tested TODAY. Has Medicaid. Takes the subway from Crown Heights.

  *Mindset:* Worried, wants answers fast. Doesn't want to call ahead or make appointments. Needs to know: "Can I walk in right now?"
]

#table(
  columns: (auto, 1fr, auto),
  inset: 6pt,
  [*#*], [*Test as Maria*], [*Pass*],
  [P1.1], [Filter for STI testing — results appear quickly], [☐],
  [P1.2], [Filter for "Open now" — see which clinics she can visit immediately], [☐],
  [P1.3], [Filter Brooklyn / Crown Heights area — relevant results], [☐],
  [P1.4], [Filter Medicaid — confirms coverage], [☐],
  [P1.5], [Check clinic hours — clearly shows walk-in vs appointment], [☐],
  [P1.6], [Tap phone number — calls directly from mobile], [☐],
  [P1.7], [Get directions — opens maps app with transit directions], [☐],
)

== Persona 2: Alex — Starting PrEP

#block(fill: rgb("#e8f5e9"), inset: 10pt, radius: 4pt)[
  *Context:* 24-year-old gay man, just moved to NYC. Heard about PrEP, wants to start but doesn't know where to go. No primary care doctor yet. Has insurance through work but unsure if it covers PrEP.

  *Mindset:* Curious but slightly nervous. Wants somewhere LGBTQ-friendly. Prefers informed consent (no hoops to jump through).
]

#table(
  columns: (auto, 1fr, auto),
  inset: 6pt,
  [*#*], [*Test as Alex*], [*Pass*],
  [P2.1], [Filter for PrEP — sees all PrEP providers], [☐],
  [P2.2], [Notices LGBTQ-focused clinics (Callen-Lorde, etc.)], [☐],
  [P2.3], [Can identify informed consent providers], [☐],
  [P2.4], [Virtual/telehealth options appear (Folx, Plume)], [☐],
  [P2.5], [Clinic details show what to expect (labs, timeline)], [☐],
  [P2.6], [Can filter by subway line near his new apartment], [☐],
)

== Persona 3: Jamie — Needs Abortion Care

#block(fill: rgb("#fce4ec"), inset: 10pt, radius: 4pt)[
  *Context:* 32-year-old woman, 8 weeks pregnant, decided to terminate. Has limited time off work. Wants to understand medication vs procedural options. Uninsured but heard about financial assistance.

  *Mindset:* Has made her decision, now needs logistics. Time-sensitive. Wants clear, non-judgmental information.
]

#table(
  columns: (auto, 1fr, auto),
  inset: 6pt,
  [*#*], [*Test as Jamie*], [*Pass*],
  [P3.1], [Filter for Abortion — sees providers], [☐],
  [P3.2], [Gestational weeks filter (8 weeks) — shows eligible clinics], [☐],
  [P3.3], [Can distinguish medication vs procedural abortion limits], [☐],
  [P3.4], [Sees "sliding scale" or financial assistance options], [☐],
  [P3.5], [Virtual options appear (Hey Jane, Abortion on Demand)], [☐],
  [P3.6], [Phone numbers work to schedule quickly], [☐],
)

== Persona 4: Sam — Trans Healthcare

#block(fill: rgb("#f3e5f5"), inset: 10pt, radius: 4pt)[
  *Context:* 19-year-old trans man, wants to start testosterone. Lives with unsupportive family in Staten Island. Looking for informed consent HRT — doesn't want to wait months for letters.

  *Mindset:* Hopeful but wary. Has been turned away before. Needs to know he'll be treated with respect. May need to travel to Manhattan for the right care.
]

#table(
  columns: (auto, 1fr, auto),
  inset: 6pt,
  [*#*], [*Test as Sam*], [*Pass*],
  [P4.1], [Filter Gender-Affirming Care — sees providers], [☐],
  [P4.2], [Filter for Hormones — narrows results], [☐],
  [P4.3], [Filter for Informed Consent — finds the right clinics], [☐],
  [P4.4], [Can see which clinics serve patients under 21], [☐],
  [P4.5], [Virtual options (Plume, Folx) appear as alternatives], [☐],
  [P4.6], [Transit filters help plan trip from Staten Island], [☐],
  [P4.7], [Clinic details feel welcoming (LGBTQ-focused badges)], [☐],
)

== Persona 5: Grandma Chen — Helping Grandson

#block(fill: rgb("#fff3e0"), inset: 10pt, radius: 4pt)[
  *Context:* 68-year-old Chinese grandmother. Grandson mentioned he needs "health services" but is too embarrassed to look himself. She wants to help but isn't tech-savvy. Prefers Chinese language.

  *Mindset:* Loving, wants to help. Unfamiliar with these topics. Needs simple, clear interface. Language barrier.
]

#table(
  columns: (auto, 1fr, auto),
  inset: 6pt,
  [*#*], [*Test as Grandma Chen*], [*Pass*],
  [P5.1], [Find language switcher (globe icon in footer)], [☐],
  [P5.2], [Switch to Chinese — all text updates], [☐],
  [P5.3], [Interface still makes sense in Chinese], [☐],
  [P5.4], [Can find Charles B. Wang Community Health Center], [☐],
  [P5.5], [Search works with clinic name], [☐],
  [P5.6], [Phone number clearly visible to write down for grandson], [☐],
)

== Persona 6: David — Screen Reader User

#block(fill: rgb("#e3f2fd"), inset: 10pt, radius: 4pt)[
  *Context:* 35-year-old blind man using VoiceOver on iPhone. Needs to find HIV testing. Relies entirely on audio feedback and proper semantic HTML.

  *Mindset:* Experienced with accessibility issues. Expects frustration but hopes this site is different.
]

#table(
  columns: (auto, 1fr, auto),
  inset: 6pt,
  [*#*], [*Test as David (with screen reader)*], [*Pass*],
  [P6.1], [Page announces meaningful title on load], [☐],
  [P6.2], ["Skip to main content" link works], [☐],
  [P6.3], [Filter buttons are properly labeled], [☐],
  [P6.4], [Clinic count announced when filters change], [☐],
  [P6.5], [Can navigate to clinic details via list view], [☐],
  [P6.6], [Phone numbers and links are clearly announced], [☐],
  [P6.7], [Modal dialogs trap focus correctly], [☐],
)

== Persona 7: Night Shift Worker

#block(fill: rgb("#eceff1"), inset: 10pt, radius: 4pt)[
  *Context:* 40-year-old nurse working 7pm-7am shifts. Needs contraception refill but is always asleep during normal clinic hours. Looking for evening or weekend availability.

  *Mindset:* Frustrated by "9-5 only" healthcare. Needs to find clinics open when she's awake.
]

#table(
  columns: (auto, 1fr, auto),
  inset: 6pt,
  [*#*], [*Test as Night Shift Worker*], [*Pass*],
  [P7.1], [Filter for Contraception], [☐],
  [P7.2], ["Open after 5pm" filter shows evening options], [☐],
  [P7.3], [Clinic hours clearly show days/times], [☐],
  [P7.4], [Can identify Saturday availability from hours], [☐],
  [P7.5], [Virtual/telehealth options offer flexibility], [☐],
)

= Pre-Test Setup

+ Clear browser cache and localStorage
+ Open DevTools Network tab (disable cache)
+ For mobile: Use real devices OR Chrome DevTools device emulation
+ Note the commit hash shown in About modal (footer) for bug reports

= Technical Verification Tests

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
  *Note:* Recent changes to ensure footer always shows on mobile. Verify this works after clearing cache.
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

== 8. Internationalization (i18n)

#table(
  columns: (auto, 1fr, auto, auto),
  inset: 6pt,
  [*#*], [*Test*], [*Desktop*], [*Mobile*],
  [8.1], [Language switcher opens from footer], [☐], [☐],
  [8.2], [Changing language updates all UI text], [☐], [☐],
  [8.3], [RTL languages (Arabic, Hebrew) display correctly], [☐], [☐],
  [8.4], [Language preference persists after refresh], [☐], [☐],
  [8.5], [No missing translation keys (check console)], [☐], [☐],
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
**Persona:** [Which persona were you testing as?]
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

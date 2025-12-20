# UI Implementation Plan - sexualhealth.nyc

**Last Updated:** December 19, 2025
**Stack:** Vite + React + react-map-gl (Mapbox GL JS) + Vercel

---

## Executive Summary

Transform the current static HTML map into a rich, interactive React application with advanced filtering, mobile-first design, and accessibility. Users should be able to find exactly the clinic they need in under 30 seconds.

**Key User Flows:**

1. **Quick Search:** "I need STI testing that takes Medicaid near me" → Filter + Results in 10 seconds
2. **Emergency Search:** "I need PEP right now" → One-click filter shows only PEP clinics, sorted by distance
3. **Research Mode:** "What services does this clinic offer?" → Click marker, see full details in side panel

---

## Tech Stack Decision

### Why React + react-map-gl?

**Current:** Vanilla JS with Mapbox GL JS (test-embed.html)
**Proposed:** React with [react-map-gl](https://visgl.github.io/react-map-gl/)

**Benefits:**

- **Reactive state management** - Filter changes instantly update map without manual DOM manipulation
- **Component reusability** - Filter UI, clinic cards, popups all modular
- **Type safety** - react-map-gl v8.0 (Jan 2025) has official TypeScript support
- **Hooks integration** - Custom hooks for geolocation, clinic search, filtering
- **Better with Vite** - Fast HMR, component-level updates
- **Tidewave compatibility** - Better AI assistance for React components

**Installation:**

```bash
npm install react react-dom
npm install react-map-gl mapbox-gl
npm install -D @vitejs/plugin-react
```

---

## Data Schema Reference

Every clinic has these filterable attributes (from PLAN.md):

### Services (Boolean flags)

- `has_sti_testing`
- `has_hiv_testing`
- `has_prep`
- `has_pep`
- `has_contraception`
- `has_abortion`
- `has_gender_affirming`
- `has_vaccines`

### Insurance & Cost (Boolean + strings)

- `accepts_medicaid` (boolean)
- `medicaid_mcos` (string - comma-separated MCOs)
- `accepts_medicare` (boolean)
- `sliding_scale` (boolean)
- `no_insurance_ok` (boolean)
- `insurance_verified` (enum: "confirmed", "listed", "unknown")

### Access (Boolean + strings)

- `walk_in` (boolean)
- `appointment_only` (boolean)
- `hours` (string)
- `languages` (string - comma-separated)

### Special Populations (Boolean)

- `lgbtq_focused`
- `youth_friendly`
- `anonymous_testing`

### Location

- `borough` (enum: Manhattan, Brooklyn, Queens, Bronx, Staten Island)
- `nearest_subway` (string)
- `nearest_bus` (string)
- `latitude`, `longitude`

---

## UI Layout Architecture

### Desktop (≥1024px)

```
┌─────────────────────────────────────────────────────────────┐
│ Header: Logo + Search Bar + "Report Error" Link            │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│   Filter     │                                              │
│   Sidebar    │          MAP VIEW                            │
│   (320px)    │                                              │
│              │                                              │
│   Services   │                                              │
│   Insurance  │                                              │
│   Access     │                                              │
│   Borough    │                                              │
│              │                                              │
│   [Clear]    ├──────────────────────────────────────────────┤
│   [Apply]    │   Clinic Detail Panel (slides in on click)  │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

### Mobile (≤768px)

```
┌─────────────────────────┐
│ Header + Hamburger Menu │
├─────────────────────────┤
│                         │
│      MAP VIEW           │
│      (Full Screen)      │
│                         │
│                         │
├─────────────────────────┤
│ [Filter Button] (FAB)   │ ← Floating Action Button
└─────────────────────────┘

When filter button tapped:
┌─────────────────────────┐
│ ← Back                  │
├─────────────────────────┤
│   Services              │
│   ☐ STI Testing         │
│   ☐ HIV Testing         │
│   ...                   │
│                         │
│   Insurance             │
│   ☐ Medicaid            │
│   ...                   │
│                         │
│ [Apply Filters]         │
└─────────────────────────┘
```

---

## Component Architecture

### Core Components

```tsx
App (Root)
├── Header
│   ├── Logo
│   ├── SearchBar (autocomplete clinic names)
│   └── ReportErrorLink
├── MapContainer
│   ├── Map (react-map-gl)
│   ├── UserLocationMarker (geolocation)
│   ├── ClinicMarkers (clustered)
│   └── NavigationControl
├── FilterSidebar (Desktop) / FilterDrawer (Mobile)
│   ├── ServiceFilters
│   ├── InsuranceFilters
│   ├── AccessFilters
│   ├── BoroughFilter
│   └── FilterActions (Clear/Apply)
├── ClinicDetailPanel (Slide-in)
│   ├── ClinicHeader
│   ├── ServiceBadges
│   ├── ContactInfo
│   ├── InsuranceDetails
│   ├── Hours
│   ├── TransitInfo
│   └── DirectionsButton
└── ResultsList (Mobile fallback for accessibility)
```

### State Management Strategy

**Zustand** (lightweight, no boilerplate) or **React Context** (no extra deps)

```tsx
// Recommended: Zustand store
interface AppState {
  // Data
  clinics: Clinic[];

  // Filters
  filters: {
    services: Set<string>; // ['sti_testing', 'prep']
    insurance: Set<string>; // ['medicaid', 'no_insurance_ok']
    access: Set<string>; // ['walk_in']
    boroughs: Set<string>; // ['Manhattan', 'Brooklyn']
    searchQuery: string;
  };

  // UI State
  selectedClinic: Clinic | null;
  userLocation: [number, number] | null;
  mapViewport: ViewState;
  isMobile: boolean;
  isFilterDrawerOpen: boolean;

  // Actions
  setFilter: (category: string, value: string, checked: boolean) => void;
  clearFilters: () => void;
  selectClinic: (clinic: Clinic | null) => void;
  setUserLocation: (coords: [number, number]) => void;
}
```

### Filtering Logic

**Client-side filtering** (124+ clinics = small dataset, no backend needed)

```tsx
const filteredClinics = useMemo(() => {
  return clinics.filter((clinic) => {
    // Services: AND logic (must have ALL selected services)
    if (filters.services.size > 0) {
      const hasAllServices = Array.from(filters.services).every(
        (service) => clinic[`has_${service}`] === true,
      );
      if (!hasAllServices) return false;
    }

    // Insurance: OR logic (must have ANY selected insurance)
    if (filters.insurance.size > 0) {
      const hasAnyInsurance = Array.from(filters.insurance).some(
        (insurance) => clinic[insurance] === true,
      );
      if (!hasAnyInsurance) return false;
    }

    // Borough: OR logic
    if (filters.boroughs.size > 0) {
      if (!filters.boroughs.has(clinic.borough)) return false;
    }

    // Search query: fuzzy match on name + address
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchable = `${clinic.name} ${clinic.address}`.toLowerCase();
      if (!searchable.includes(query)) return false;
    }

    return true;
  });
}, [clinics, filters]);
```

---

## Filter UI Design

### Service Filters (Most Important)

**Visual Priority:** Large checkboxes with icons

```tsx
<FilterSection title="Services">
  <Checkbox
    icon={<TestTubeIcon />}
    label="STI Testing"
    sublabel="Chlamydia, Gonorrhea, Syphilis"
    checked={filters.services.has("sti_testing")}
  />
  <Checkbox
    icon={<ShieldIcon />}
    label="PrEP"
    sublabel="HIV prevention pill"
    highlighted={true} // Highlight critical services
  />
  <Checkbox
    icon={<ClockIcon />}
    label="PEP"
    sublabel="Emergency HIV prevention (72hr window)"
    highlighted={true}
  />
  {/* ... */}
</FilterSection>
```

**Design Notes:**

- Services are checkboxes (multi-select)
- Icons make scanning faster
- Sublabels explain medical jargon
- PEP/PrEP highlighted (time-sensitive)

### Insurance Filters (Critical for Access)

```tsx
<FilterSection title="Insurance & Cost">
  <Checkbox label="Accepts Medicaid" />

  {/* Conditional: Show if Medicaid selected */}
  {filters.insurance.has("medicaid") && (
    <ExpandableSection title="Specific Medicaid Plans">
      <Checkbox label="Healthfirst" size="sm" />
      <Checkbox label="Fidelis" size="sm" />
      <Checkbox label="MetroPlus" size="sm" />
    </ExpandableSection>
  )}

  <Checkbox label="Accepts Medicare" />
  <Checkbox label="Sliding Scale (Income-based)" />
  <Checkbox label="No Insurance Required" badge="Popular" />
</FilterSection>
```

**Design Notes:**

- Medicaid MCOs hidden by default (avoid overwhelming)
- "No Insurance Required" badged (popular search)
- Verification badges for confirmed data

### Access Filters

```tsx
<FilterSection title="Availability">
  <RadioGroup label="Appointment Type">
    <Radio value="any" label="Any" checked />
    <Radio value="walk_in" label="Walk-ins Only" />
    <Radio value="appointment" label="By Appointment" />
  </RadioGroup>

  <Checkbox label="Open Weekends" />
  <Checkbox label="Open Evenings (after 5pm)" />
</FilterSection>
```

### Special Population Filters

```tsx
<FilterSection title="Specializations">
  <Checkbox icon={<RainbowIcon />} label="LGBTQ+ Focused" />
  <Checkbox icon={<UserIcon />} label="Youth Friendly (under 18)" />
  <Checkbox icon={<LockIcon />} label="Anonymous Testing Available" />
</FilterSection>
```

---

## Map Interaction Design

### Marker Clustering

**Problem:** 124+ markers = visual clutter
**Solution:** Cluster markers when zoomed out, expand on zoom in

```tsx
import { Marker } from "react-map-gl";
import useSupercluster from "use-supercluster";

const { clusters, supercluster } = useSupercluster({
  points: filteredClinics.map((clinic) => ({
    type: "Feature",
    properties: { cluster: false, clinic },
    geometry: {
      type: "Point",
      coordinates: [clinic.longitude, clinic.latitude],
    },
  })),
  bounds: mapViewport.bounds,
  zoom: mapViewport.zoom,
  options: { radius: 75, maxZoom: 20 },
});

return (
  <>
    {clusters.map((cluster) => {
      const [longitude, latitude] = cluster.geometry.coordinates;
      const { cluster: isCluster, point_count, clinic } = cluster.properties;

      if (isCluster) {
        return (
          <Marker key={cluster.id} longitude={longitude} latitude={latitude}>
            <ClusterMarker
              pointCount={point_count}
              onClick={() => zoomToCluster(cluster.id)}
            />
          </Marker>
        );
      }

      return (
        <Marker key={clinic.id} longitude={longitude} latitude={latitude}>
          <ClinicMarker clinic={clinic} onClick={() => selectClinic(clinic)} />
        </Marker>
      );
    })}
  </>
);
```

### Marker Styling

**Default State:**

- Purple circle with white border
- Size: 32px

**Hover State:**

- Scale to 40px
- Show clinic name tooltip

**Selected State:**

- Blue circle (brand color)
- Scale to 48px
- Pulse animation

**Special Markers:**

- PEP available: Red pulsing ring (urgency indicator)
- User location: Blue dot with accuracy circle

### Popup vs Side Panel

**Mobile:** Popup (bottom sheet)
**Desktop:** Side panel (doesn't obscure map)

```tsx
// Desktop: Slide-in panel
<ClinicDetailPanel
  clinic={selectedClinic}
  isOpen={!!selectedClinic}
  onClose={() => selectClinic(null)}
  position="right" // Slides from right
  width={400}
/>

// Mobile: Bottom sheet
<ClinicBottomSheet
  clinic={selectedClinic}
  isOpen={!!selectedClinic}
  onClose={() => selectClinic(null)}
  snapPoints={[0.4, 0.9]} // Can drag to expand
/>
```

---

## Clinic Detail Panel Design

### Content Hierarchy

```tsx
<ClinicDetailPanel>
  {/* 1. Header */}
  <Header>
    <ClinicName>{clinic.name}</ClinicName>
    <CloseButton />
  </Header>

  {/* 2. Quick Actions */}
  <QuickActions>
    <CallButton phone={clinic.phone} />
    <DirectionsButton
      coords={[clinic.latitude, clinic.longitude]}
      address={clinic.address}
    />
    <WebsiteButton url={clinic.website} />
  </QuickActions>

  {/* 3. Service Badges */}
  <ServiceBadges>
    {clinic.has_sti_testing && <Badge color="purple">STI Testing</Badge>}
    {clinic.has_prep && <Badge color="blue">PrEP</Badge>}
    {clinic.has_pep && <Badge color="red">PEP</Badge>}
    {/* ... */}
  </ServiceBadges>

  {/* 4. Key Info */}
  <InfoSection icon={<ClockIcon />} title="Hours">
    <Hours schedule={clinic.hours} />
    <Badge color={isOpenNow(clinic) ? "green" : "gray"}>
      {isOpenNow(clinic) ? "Open Now" : "Closed"}
    </Badge>
  </InfoSection>

  <InfoSection icon={<DollarIcon />} title="Insurance">
    {clinic.accepts_medicaid && <p>✓ Medicaid accepted</p>}
    {clinic.medicaid_mcos && (
      <Details>
        <summary>Specific MCOs</summary>
        <p>{clinic.medicaid_mcos}</p>
      </Details>
    )}
    {clinic.no_insurance_ok && (
      <HighlightBox>Can be seen without insurance</HighlightBox>
    )}
    {clinic.sliding_scale && <p>✓ Sliding scale available</p>}
  </InfoSection>

  <InfoSection icon={<SubwayIcon />} title="Transit">
    <TransitInfo>
      <SubwayLine>{clinic.nearest_subway}</SubwayLine>
      <BusRoute>{clinic.nearest_bus}</BusRoute>
    </TransitInfo>
  </InfoSection>

  {/* 5. Special Notes */}
  {clinic.lgbtq_focused && <Badge icon={<RainbowIcon />}>LGBTQ+ Focused</Badge>}
  {clinic.youth_friendly && <Badge>Youth Friendly</Badge>}

  {/* 6. Footer */}
  <Footer>
    <VerificationNote>Last verified: {clinic.last_verified}</VerificationNote>
    <ReportErrorLink clinicId={clinic.id} />
  </Footer>
</ClinicDetailPanel>
```

---

## Mobile-Specific Features

### 1. Geolocation "Near Me" Button

```tsx
<FloatingActionButton
  icon={<LocationIcon />}
  onClick={async () => {
    const position = await navigator.geolocation.getCurrentPosition();
    setUserLocation([position.coords.longitude, position.coords.latitude]);

    // Sort clinics by distance
    const sorted = sortByDistance(filteredClinics, userLocation);

    // Zoom to user + nearest clinics
    flyToBounds(calculateBounds([userLocation, ...sorted.slice(0, 5)]));
  }}
>
  Near Me
</FloatingActionButton>
```

### 2. List View Toggle (Accessibility)

Screen readers struggle with maps. Provide alternative:

```tsx
<ViewToggle>
  <Button active={view === "map"} onClick={() => setView("map")}>
    Map
  </Button>
  <Button active={view === "list"} onClick={() => setView("list")}>
    List
  </Button>
</ViewToggle>;

{
  view === "list" && (
    <ClinicList>
      {filteredClinics.map((clinic) => (
        <ClinicCard
          key={clinic.id}
          clinic={clinic}
          onClick={() => {
            selectClinic(clinic);
            setView("map");
          }}
        />
      ))}
    </ClinicList>
  );
}
```

### 3. Quick Filter Chips (Mobile)

Instead of full filter drawer, show active filters as dismissible chips:

```tsx
<ActiveFilterChips>
  {filters.services.has("sti_testing") && (
    <Chip onRemove={() => removeFilter("services", "sti_testing")}>
      STI Testing ×
    </Chip>
  )}
  {filters.insurance.has("medicaid") && (
    <Chip onRemove={() => removeFilter("insurance", "medicaid")}>
      Medicaid ×
    </Chip>
  )}
  <Button variant="link" onClick={openFilterDrawer}>
    + Add Filters
  </Button>
</ActiveFilterChips>
```

---

## Performance Optimizations

### 1. Lazy Load Map

```tsx
import { lazy, Suspense } from "react";

const Map = lazy(() => import("./components/Map"));

<Suspense fallback={<MapSkeleton />}>
  <Map />
</Suspense>;
```

### 2. Virtualized Clinic List (Mobile)

For 100+ clinics in list view:

```tsx
import { FixedSizeList } from "react-window";

<FixedSizeList
  height={window.innerHeight - 200}
  itemCount={filteredClinics.length}
  itemSize={120}
  width="100%"
>
  {({ index, style }) => (
    <ClinicCard style={style} clinic={filteredClinics[index]} />
  )}
</FixedSizeList>;
```

### 3. Memoize Expensive Computations

```tsx
const sortedClinics = useMemo(() => {
  if (!userLocation) return filteredClinics;

  return filteredClinics
    .map((clinic) => ({
      ...clinic,
      distance: calculateDistance(userLocation, [
        clinic.latitude,
        clinic.longitude,
      ]),
    }))
    .sort((a, b) => a.distance - b.distance);
}, [filteredClinics, userLocation]);
```

---

## Accessibility (WCAG 2.1 AA)

### 1. Keyboard Navigation

```tsx
// All interactive map elements must be keyboard-accessible
<Marker
  tabIndex={0}
  role="button"
  aria-label={`${clinic.name} - ${clinic.address}`}
  onKeyPress={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      selectClinic(clinic);
    }
  }}
/>
```

### 2. Screen Reader Announcements

```tsx
import { LiveAnnouncer } from "react-aria-live";

// When filters change
const announceFilterResults = (count: number) => {
  announce(`${count} clinics found matching your filters`);
};

// When clinic selected
const announceClinicSelected = (clinic: Clinic) => {
  announce(`Selected ${clinic.name}. ${clinic.address}.`);
};
```

### 3. Color Contrast

- All text: minimum 4.5:1 contrast ratio
- Interactive elements: minimum 3:1 contrast
- Don't rely on color alone (use icons + text)

### 4. Focus Indicators

```css
/* Clear visible focus for keyboard users */
button:focus-visible,
[tabindex]:focus-visible {
  outline: 3px solid #0066cc;
  outline-offset: 2px;
}
```

---

## Visual Design System

### Color Palette

```scss
// Primary (Sexual Health = Purple/Pink spectrum)
$primary: #7b2cbf; // Deep purple (main brand)
$primary-light: #9d4edd; // Light purple (hover states)
$primary-dark: #5a189a; // Dark purple (active states)

// Accent
$accent: #ff006e; // Hot pink (CTAs, highlights)

// Service Category Colors
$sti-testing: #7b2cbf; // Purple
$prep: #0096c7; // Blue
$pep: #e63946; // Red (urgency)
$contraception: #06a77d; // Green
$abortion: #ff6b6b; // Coral
$lgbtq: #ff006e; // Rainbow accent

// Neutrals
$text-primary: #212529;
$text-secondary: #6c757d;
$background: #ffffff;
$surface: #f8f9fa;
$border: #dee2e6;

// Status
$open: #10b981; // Green
$closed: #94a3b8; // Gray
$verified: #3b82f6; // Blue
```

### Typography

```scss
// Using system fonts for performance
$font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

// Scale
$text-xs: 0.75rem; // 12px - Sublabels, metadata
$text-sm: 0.875rem; // 14px - Body small, captions
$text-base: 1rem; // 16px - Body text
$text-lg: 1.125rem; // 18px - Emphasized text
$text-xl: 1.25rem; // 20px - Section headers
$text-2xl: 1.5rem; // 24px - Panel titles
$text-3xl: 2rem; // 32px - Page titles
```

### Spacing Scale

```scss
$space-1: 0.25rem; // 4px
$space-2: 0.5rem; // 8px
$space-3: 0.75rem; // 12px
$space-4: 1rem; // 16px
$space-6: 1.5rem; // 24px
$space-8: 2rem; // 32px
$space-12: 3rem; // 48px
```

---

## Animation & Micro-interactions

### Filter Apply Animation

```tsx
// When filters applied, markers animate in
const MotionMarker = motion(Marker);

<MotionMarker
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0, opacity: 0 }}
  transition={{
    type: "spring",
    stiffness: 500,
    damping: 30,
  }}
/>;
```

### Panel Slide-in

```tsx
<motion.div
  initial={{ x: 400 }}
  animate={{ x: 0 }}
  exit={{ x: 400 }}
  transition={{ type: "tween", duration: 0.3 }}
>
  <ClinicDetailPanel />
</motion.div>
```

### Loading States

```tsx
// While GeoJSON loads
<MapSkeleton>
  <PulsingCircle />
  <Text>Loading clinics...</Text>
</MapSkeleton>

// Filter skeleton (avoid layout shift)
<FilterSkeleton>
  {[...Array(8)].map((_, i) => (
    <CheckboxSkeleton key={i} />
  ))}
</FilterSkeleton>
```

---

## Error Handling

### Network Errors

```tsx
const { data: clinics, error, isLoading } = useFetch("/clinics.geojson");

if (error) {
  return (
    <ErrorState>
      <Icon name="wifi-off" size={48} />
      <h2>Unable to load clinic data</h2>
      <p>Please check your connection and try again.</p>
      <Button onClick={() => window.location.reload()}>Retry</Button>
    </ErrorState>
  );
}
```

### Geolocation Errors

```tsx
const handleLocationError = (error: GeolocationPositionError) => {
  const messages = {
    1: "Location access denied. Please enable location services in your browser settings.",
    2: "Unable to determine your location. Try again or enter an address.",
    3: "Location request timed out. Please try again.",
  };

  toast.error(messages[error.code] || "Location unavailable");
};
```

### Empty States

```tsx
// No clinics match filters
{
  filteredClinics.length === 0 && (
    <EmptyState>
      <Icon name="search" size={48} />
      <h3>No clinics found</h3>
      <p>Try adjusting your filters or search in a different area.</p>
      <Button onClick={clearFilters}>Clear Filters</Button>
    </EmptyState>
  );
}
```

---

## Testing Strategy

### Component Tests (Vitest + React Testing Library)

```tsx
describe("FilterSidebar", () => {
  it("filters clinics by service", () => {
    render(<App />);

    const stiCheckbox = screen.getByLabelText("STI Testing");
    fireEvent.click(stiCheckbox);

    const applyButton = screen.getByText("Apply Filters");
    fireEvent.click(applyButton);

    const markers = screen.getAllByRole("button", { name: /clinic/i });
    markers.forEach((marker) => {
      expect(marker).toHaveAttribute("data-has-sti-testing", "true");
    });
  });
});
```

### E2E Tests (Playwright)

```tsx
test("user can find PrEP clinic near them", async ({ page }) => {
  await page.goto("/");

  // Mock geolocation
  await page.context().setGeolocation({
    latitude: 40.7589,
    longitude: -73.9851,
  });

  // Click "Near Me" button
  await page.click("text=Near Me");

  // Open filters
  await page.click('[aria-label="Open filters"]');

  // Select PrEP
  await page.check("text=PrEP");

  // Apply
  await page.click("text=Apply Filters");

  // Should show markers
  await expect(page.locator("[data-marker]").first()).toBeVisible();

  // Click first clinic
  await page.locator("[data-marker]").first().click();

  // Detail panel should open
  await expect(
    page.locator('[data-testid="clinic-detail-panel"]'),
  ).toBeVisible();
});
```

---

## Implementation Phases

### Phase 1: React Migration (Week 1)

- [ ] Set up Vite + React
- [ ] Install react-map-gl
- [ ] Convert test-embed.html to React component
- [ ] Basic map with markers (no clustering)
- [ ] Load clinics.geojson
- [ ] Deploy to Vercel (verify it works)

### Phase 2: Core Filtering (Week 2)

- [ ] Build filter state management (Zustand or Context)
- [ ] Implement service filters (checkboxes)
- [ ] Implement insurance filters
- [ ] Implement borough filter
- [ ] Wire up filtering logic
- [ ] Show filter count ("12 clinics found")

### Phase 3: UI Polish (Week 3)

- [ ] Marker clustering (use-supercluster)
- [ ] Clinic detail panel (desktop)
- [ ] Clinic bottom sheet (mobile)
- [ ] Search autocomplete
- [ ] Active filter chips
- [ ] "Near Me" geolocation button

### Phase 4: Advanced Features (Week 4)

- [ ] Transit info display (subway/bus icons)
- [ ] "Open Now" badge
- [ ] Directions integration (Google Maps/Apple Maps)
- [ ] List view toggle (accessibility)
- [ ] Dark mode support
- [ ] Analytics events (filter usage, clinic clicks)

### Phase 5: Testing & Launch (Week 5)

- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Performance audit (Lighthouse score >90)
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Mobile)
- [ ] User testing (recruit 5-10 people to test)
- [ ] Fix critical bugs
- [ ] Launch 🚀

---

## Recommended Libraries

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-map-gl": "^8.1.0",
    "mapbox-gl": "^3.5.0",
    "zustand": "^5.0.2", // State management
    "use-supercluster": "^1.2.0", // Marker clustering
    "framer-motion": "^12.0.0", // Animations
    "react-window": "^1.8.10", // List virtualization
    "react-aria": "^3.39.0", // Accessibility primitives
    "date-fns": "^4.1.0" // "Open Now" logic
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vitest": "^2.1.8",
    "@testing-library/react": "^16.1.0",
    "playwright": "^1.49.1",
    "tailwindcss": "^4.1.0" // Optional: utility-first CSS
  }
}
```

---

## References & Resources

- **react-map-gl Documentation:** https://visgl.github.io/react-map-gl/
- **react-map-gl GitHub:** https://github.com/visgl/react-map-gl
- **Vite + React Guide:** https://codeparrot.ai/blogs/advanced-guide-to-using-vite-with-react-in-2025
- **Mapbox GL JS API:** https://docs.mapbox.com/mapbox-gl-js/
- **Zustand:** https://zustand-demo.pmnd.rs/
- **use-supercluster:** https://github.com/leighhalliday/use-supercluster
- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

---

## Questions to Resolve Before Starting

1. **TypeScript or JavaScript?** (Recommend TS for safety)
2. **Tailwind CSS or CSS Modules?** (Tailwind = faster, CSS Modules = more control)
3. **Analytics provider?** (GoatCounter + custom events? Plausible? Vercel Analytics?)
4. **Budget for Mapbox?** (Free tier: 50k loads/month - check if sufficient)
5. **Domain verification for Resend?** (Do this now or later?)

---

**Next Steps:**

1. Review this doc
2. Answer questions above
3. Run `npm create vite@latest . -- --template react` to start migration
4. Install dependencies listed above
5. Begin Phase 1 implementation

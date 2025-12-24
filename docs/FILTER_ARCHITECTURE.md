# Filter Architecture

## Problem

The walk-ins filter sync issue revealed a fundamental architectural problem:

### What Went Wrong

- Desktop view (`FilterBar.jsx`) and mobile view (`FilterControls.jsx`) rendered filters **independently**
- No single source of truth for:
  - Which filters exist
  - Filter ordering
  - Filter types (dropdown, toggle, conditional)
  - Filter visibility rules
- Hardcoded UI patterns scattered across components
- Easy to add a filter in one view and forget the other

### Root Cause

**Component-driven duplication** instead of **data-driven rendering**.

---

## Solution: Configuration-Driven Filters

### Current Implementation (What We Fixed)

✅ **Shared filter data** via `useFilterOptions` hook

- All filter options (labels, values) come from one source
- Both views use the same hook

```javascript
// src/hooks/useFilterOptions.js
const accessOptions = [
  { value: "walk_in", label: t("messages:walkInsAccepted") },
];
```

### Recommended Future Architecture

📋 **Declarative filter configuration** via `filterConfig.js`

Instead of:

```jsx
// ❌ BAD: Manually rendering each filter in each view
<FilterDropdown name="access" title="Walk-ins" options={accessOptions} />
```

We should have:

```jsx
// ✅ GOOD: Render from config
{
  visibleFilters.map((config) => (
    <FilterRenderer key={config.id} config={config} />
  ));
}
```

---

## Architecture Components

### 1. Filter Configuration (`src/config/filterConfig.js`)

**Single source of truth** for all filter metadata:

```javascript
export const FILTER_CONFIG = [
  {
    id: "access",
    type: FILTER_TYPES.MULTI_SELECT,
    category: "access",
    titleKey: "sections:walkIns",
    optionsKey: "accessOptions",
    order: 7,
  },
  // ... all other filters
];
```

**Benefits:**

- Adding a filter? Add one config entry → automatically appears in both views
- Reordering? Change `order` value → both views update
- Conditional logic? Define `parentFilter` → handled automatically

### 2. Filter Options Hook (`src/hooks/useFilterOptions.js`)

**Data source** for filter choices:

```javascript
export default function useFilterOptions() {
  const { t } = useTranslation();

  return {
    serviceOptions: [...],
    accessOptions: [...],
    // etc.
  };
}
```

**Responsibility:** Provide translated options for each filter category.

### 3. Filter Renderer Components

**Presentation layer** that renders filters based on type:

```jsx
function FilterRenderer({ config, mode }) {
  const filterOptions = useFilterOptions();
  const options = filterOptions[config.optionsKey];

  switch (config.type) {
    case FILTER_TYPES.MULTI_SELECT:
      return mode === "desktop" ? (
        <FilterDropdown {...config} options={options} />
      ) : (
        <CheckboxGroup {...config} options={options} />
      );

    case FILTER_TYPES.TOGGLE:
      return <ToggleFilter {...config} />;

    // ... other types
  }
}
```

---

## Migration Path

### Phase 1: Current State ✅ (Completed)

- [x] Move filter data to `useFilterOptions` hook
- [x] Both views consume from same hook
- [x] Walk-ins filter synced

### Phase 2: Introduce Configuration (Recommended)

1. Create `src/config/filterConfig.js` with `FILTER_CONFIG`
2. Create `useVisibleFilters()` hook that uses config
3. Refactor `FilterBar.jsx` to map over config
4. Refactor `FilterControls.jsx` to map over config
5. Remove hardcoded filter rendering

### Phase 3: Advanced Features (Future)

- Dynamic filter ordering via user preferences
- A/B test different filter combinations
- Admin panel to enable/disable filters
- Filter analytics and usage tracking

---

## Adding a New Filter

### Current Process (What You Did for Walk-ins)

1. ✅ Add option to `useFilterOptions.js`:

   ```javascript
   const accessOptions = [
     { value: "walk_in", label: t("messages:walkInsAccepted") },
   ];
   ```

2. ✅ Add to desktop (`FilterBar.jsx`):

   ```jsx
   <FilterDropdown
     name="access"
     title={t("sections:walkIns")}
     options={accessOptions}
     category="access"
   />
   ```

3. ✅ Add to mobile (`FilterControls.jsx`):

   ```jsx
   <FilterSection title={t("sections:walkIns")}>
     {accessOptions.map(option => <Checkbox ... />)}
   </FilterSection>
   ```

4. ✅ Add to active pills section
5. ✅ Add dropdown ref
6. ✅ Test both views

**Problem:** 6 manual steps, easy to miss one.

### Future Process (With Configuration)

1. Add option to `useFilterOptions.js`
2. Add config to `FILTER_CONFIG` array
3. Done! ✨

**Benefits:**

- 2 steps instead of 6
- Impossible to add to only one view
- Ordering, visibility, all handled automatically

---

## Type System

### Filter Types

```javascript
FILTER_TYPES = {
  MULTI_SELECT: "multi_select", // Multiple checkboxes
  TOGGLE: "toggle", // Single on/off button
  TRANSIT: "transit", // Subway/bus special UI
  CHILD_FILTER: "child_filter", // Shown conditionally
};
```

### Configuration Schema

```typescript
type FilterConfig = {
  id: string; // Unique identifier
  type: FilterType; // How to render
  category: string; // Store category name
  titleKey: string; // i18n key for title
  optionsKey?: string; // Key in useFilterOptions()
  order: number; // Render order
  parentFilter?: string; // For conditional filters
  parentValue?: string; // Required parent value
  desktopStyle?: object; // Desktop-specific styling
};
```

---

## Testing Strategy

### Current Coverage

- Manual testing: Switch views, verify filter appears
- No automated tests for filter sync

### Recommended Tests

```javascript
describe("Filter Sync", () => {
  it("renders same filters in desktop and mobile", () => {
    const desktopFilters = getVisibleFilters(mockFilters);
    const mobileFilters = getVisibleFilters(mockFilters);
    expect(desktopFilters).toEqual(mobileFilters);
  });

  it("shows child filter when parent selected", () => {
    const filters = { services: new Set(["gender_affirming"]) };
    const visible = getVisibleFilters(filters);
    expect(visible.find((f) => f.id === "genderAffirming")).toBeDefined();
  });
});
```

---

## Best Practices

### ✅ DO

- Add new filters to `FILTER_CONFIG`
- Keep filter data in `useFilterOptions`
- Use configuration to drive rendering
- Test both desktop and mobile views
- Document filter purpose in config comments

### ❌ DON'T

- Hardcode filters in component JSX
- Add filters to only one view
- Duplicate filter logic between views
- Skip conditional rendering rules
- Forget to add i18n keys

---

## Real-World Example: Adding "Telehealth Available" Filter

### Step 1: Add to `useFilterOptions.js`

```javascript
const accessOptions = [
  { value: "walk_in", label: t("messages:walkInsAccepted") },
  { value: "telehealth", label: t("messages:telehealthAvailable") }, // NEW
];
```

### Step 2: Add to `filterConfig.js`

```javascript
// No changes needed! Already uses accessOptions
```

### Step 3: Done!

The filter automatically appears in:

- Desktop dropdown under "Walk-ins"
- Mobile checkboxes under "Walk-ins"
- Active filter pills
- Filter count

**Time saved:** ~30 minutes of manual work + testing

---

## Migration Checklist

If implementing full configuration approach:

- [ ] Create `src/config/filterConfig.js`
- [ ] Define `FILTER_CONFIG` array
- [ ] Create `getVisibleFilters()` helper
- [ ] Create `<FilterRenderer>` component
- [ ] Refactor `FilterBar.jsx` to use config
- [ ] Refactor `FilterControls.jsx` to use config
- [ ] Add tests for filter visibility logic
- [ ] Update this documentation
- [ ] Remove TODO comments from old code

---

## Questions & Answers

**Q: Do we need to implement the full config approach now?**
A: No. Current fix (shared `useFilterOptions`) is sufficient. Config approach is recommended for future scalability.

**Q: What if we need view-specific behavior?**
A: Add `desktopProps` / `mobileProps` to config, or use `mode` parameter in renderer.

**Q: How do we handle complex conditional logic?**
A: Add `shouldShow(filters)` function to config instead of simple `parentFilter`.

**Q: What about performance?**
A: Config is static, no runtime overhead. Mapping is O(n) where n = number of filters (~10).

---

## Related Files

- `src/hooks/useFilterOptions.js` - Filter data source
- `src/components/FilterBar.jsx` - Desktop view
- `src/components/FilterControls.jsx` - Mobile view
- `src/store/useAppStore.js` - Filter state management
- `src/config/filterConfig.js` - Configuration (future)

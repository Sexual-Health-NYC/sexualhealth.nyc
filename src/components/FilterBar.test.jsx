import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import FilterBar from "./FilterBar";

// Mock the store
vi.mock("../store/useAppStore", () => ({
  default: () => ({
    filters: {
      services: new Set(),
      insurance: new Set(),
      access: new Set(),
      accessType: new Set(),
      boroughs: new Set(),
      gestationalWeeks: null,
      genderAffirming: new Set(),
      prep: new Set(),
      searchQuery: "",
      openNow: false,
      openAfter5pm: false,
      subwayLines: new Set(),
      busRoutes: new Set(),
    },
    setFilter: vi.fn(),
    setGestationalWeeks: vi.fn(),
    clinics: [],
  }),
}));

describe("FilterBar", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<FilterBar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

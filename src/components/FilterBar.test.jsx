import { describe, it, expect } from "vitest";
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
      boroughs: new Set(),
      gestationalWeeks: null,
    },
    setFilters: vi.fn(),
  }),
}));

describe("FilterBar", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<FilterBar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

import { test, expect } from "@playwright/test";

test.describe("App Navigation", () => {
  test("should load the homepage with map view", async ({ page }) => {
    await page.goto("/");

    // Should show the logo
    await expect(page.getByAltText("sexualhealth.nyc")).toBeVisible();

    // Should show map/list toggle buttons
    await expect(page.getByRole("button", { name: /map/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /list/i })).toBeVisible();

    // Map button should be active by default
    const mapButton = page.getByRole("button", { name: /map/i });
    await expect(mapButton).toHaveAttribute("aria-pressed", "true");
  });

  test("should toggle between map and list view", async ({ page }) => {
    await page.goto("/");

    // Click list view
    await page.getByRole("button", { name: /list/i }).click();

    // List button should now be active
    const listButton = page.getByRole("button", { name: /list/i });
    await expect(listButton).toHaveAttribute("aria-pressed", "true");

    // Should show clinic cards in list view
    await expect(
      page.locator("[role='button'][aria-expanded]").first(),
    ).toBeVisible();

    // Click map view to go back
    await page.getByRole("button", { name: /map/i }).click();
    const mapButton = page.getByRole("button", { name: /map/i });
    await expect(mapButton).toHaveAttribute("aria-pressed", "true");
  });

  test("should have accessible skip link", async ({ page }) => {
    await page.goto("/");

    // Skip link should exist but be visually hidden
    const skipLink = page.getByRole("link", { name: /skip to main/i });
    await expect(skipLink).toBeAttached();
  });
});

test.describe("Filter Functionality", () => {
  test("should show filter controls", async ({ page }) => {
    await page.goto("/");

    // Should have search input
    await expect(
      page.getByRole("combobox", { name: /search clinics/i }),
    ).toBeVisible();
  });

  test("should filter by search query", async ({ page }) => {
    await page.goto("/");

    // Type in search
    const searchInput = page.getByRole("combobox", { name: /search clinics/i });
    await searchInput.fill("planned");

    // Should show autocomplete suggestions
    await expect(page.getByRole("listbox")).toBeVisible();
  });

  test("should show clear all button when filters active", async ({ page }) => {
    await page.goto("/");

    // Initially no clear button
    await expect(
      page.getByRole("button", { name: /clear all/i }),
    ).not.toBeVisible();

    // Add a search filter
    const searchInput = page.getByRole("combobox", { name: /search clinics/i });
    await searchInput.fill("test");

    // Clear all should appear
    await expect(
      page.getByRole("button", { name: /clear all/i }),
    ).toBeVisible();

    // Click clear all
    await page.getByRole("button", { name: /clear all/i }).click();

    // Search should be cleared
    await expect(searchInput).toHaveValue("");
  });
});

test.describe("Clinic Interaction", () => {
  test("should expand clinic card in list view", async ({ page }) => {
    await page.goto("/");

    // Switch to list view
    await page.getByRole("button", { name: /list/i }).click();

    // Wait for clinics to load
    await page.waitForSelector("[role='button'][aria-expanded='false']");

    // Click first clinic card
    const firstClinic = page
      .locator("[role='button'][aria-expanded='false']")
      .first();
    await firstClinic.click();

    // Should show "Show on Map" button (indicates expansion)
    await expect(
      page.getByRole("button", { name: /show on map/i }),
    ).toBeVisible();
  });

  test("should navigate to map when clicking Show on Map", async ({ page }) => {
    await page.goto("/");

    // Switch to list view
    await page.getByRole("button", { name: /list/i }).click();

    // Wait and expand first clinic
    await page.waitForSelector("[role='button'][aria-expanded='false']");
    await page
      .locator("[role='button'][aria-expanded='false']")
      .first()
      .click();

    // Click Show on Map
    await page.getByRole("button", { name: /show on map/i }).click();

    // Should switch to map view
    const mapButton = page.getByRole("button", { name: /map/i });
    await expect(mapButton).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("Footer", () => {
  test("should open About modal", async ({ page }) => {
    await page.goto("/");

    // Click About button in footer
    await page.getByRole("button", { name: /about/i }).click();

    // Modal should open
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("heading", { name: /about/i })).toBeVisible();

    // Close modal
    await page.getByRole("button", { name: /close/i }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("should open Privacy modal", async ({ page }) => {
    await page.goto("/");

    // Click Privacy button
    await page.getByRole("button", { name: /privacy/i }).click();

    // Modal should open
    await expect(page.getByRole("dialog")).toBeVisible();

    // Close with Escape
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});

test.describe("Accessibility", () => {
  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/");

    // Should have an h1 (visually hidden for screen readers via sr-only class)
    const h1 = page.locator("h1.sr-only");
    await expect(h1).toBeAttached();
  });

  test("should have accessible filter region", async ({ page }) => {
    await page.goto("/");

    // Filter region should be labeled
    await expect(
      page.getByRole("region", { name: /filter clinics/i }),
    ).toBeVisible();
  });

  test("should have accessible main content", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("main", { name: /main content/i }),
    ).toBeVisible();
  });
});

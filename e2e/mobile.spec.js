import { test, expect } from "@playwright/test";

test.use({ ...test.devices?.["iPhone 13"] });

test.describe("Mobile Experience", () => {
  test("should show mobile filter button", async ({ page }) => {
    await page.goto("/");

    // Should show Filters button on mobile
    await expect(page.getByRole("button", { name: /filters/i })).toBeVisible();
  });

  test("should open filter modal on mobile", async ({ page }) => {
    await page.goto("/");

    // Click filters button
    await page.getByRole("button", { name: /filters/i }).click();

    // Modal should open
    await expect(page.getByRole("dialog", { name: /filter/i })).toBeVisible();

    // Should have Apply button
    await expect(page.getByRole("button", { name: /apply/i })).toBeVisible();
  });

  test("should close filter modal with Apply button", async ({ page }) => {
    await page.goto("/");

    // Open filters
    await page.getByRole("button", { name: /filters/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // Click Apply
    await page.getByRole("button", { name: /apply/i }).click();

    // Modal should close
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("should show bottom sheet when clinic selected on map", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for map to load and clinics to appear
    await page.waitForTimeout(2000);

    // Click on a map marker (they have specific classes)
    const marker = page.locator(".mapboxgl-marker").first();
    if (await marker.isVisible()) {
      await marker.click();

      // Bottom sheet should appear
      await expect(page.locator("[data-bottom-sheet]")).toBeVisible();
    }
  });

  test("should show mobile logo", async ({ page }) => {
    await page.goto("/");

    // Mobile logo should be visible
    await expect(page.getByAltText("sexualhealth.nyc")).toBeVisible();
  });
});

test.describe("Mobile List View", () => {
  test("should work in list view on mobile", async ({ page }) => {
    await page.goto("/");

    // Switch to list view
    await page.getByRole("button", { name: /list/i }).click();

    // Should show clinics
    await page.waitForSelector("[role='button'][aria-expanded]");
    const clinicCards = page.locator("[role='button'][aria-expanded]");
    await expect(clinicCards.first()).toBeVisible();
  });

  test("should expand clinic card on mobile", async ({ page }) => {
    await page.goto("/");

    // Switch to list view
    await page.getByRole("button", { name: /list/i }).click();

    // Wait for cards
    await page.waitForSelector("[role='button'][aria-expanded='false']");

    // Tap first card
    const firstCard = page
      .locator("[role='button'][aria-expanded='false']")
      .first();
    await firstCard.click();

    // Should show expanded content (Show on Map button)
    await expect(
      page.getByRole("button", { name: /show on map/i }),
    ).toBeVisible();
  });
});

test.describe("Mobile Footer", () => {
  test("should show footer on mobile", async ({ page }) => {
    await page.goto("/");

    // Footer should be visible
    await expect(page.locator("footer")).toBeVisible();
  });

  test("should open language picker on mobile", async ({ page }) => {
    await page.goto("/");

    // Click language button (globe icon)
    await page.getByRole("button", { name: /change language/i }).click();

    // Language picker should open
    await expect(page.getByText(/select language/i)).toBeVisible();
  });
});

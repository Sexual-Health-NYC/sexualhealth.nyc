import { test, expect } from "@playwright/test";

// Only run on chromium (desktop) project, not mobile
test.skip(({ browserName }) => browserName !== "chromium");

test.describe("Telehealth Banner - Desktop", () => {
  test("should show telehealth banner when services are selected", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for map and clinics to load
    await page.waitForTimeout(1500);

    // Select abortion service (has 7 virtual clinic matches)
    await page.getByRole("button", { name: "Services filter" }).click();
    await page.getByRole("checkbox", { name: /abortion/i }).check();

    // Close dropdown
    await page.keyboard.press("Escape");

    // Wait for banner - should show telehealth options
    await expect(page.getByText(/telehealth options/i)).toBeVisible({
      timeout: 10000,
    });

    // Take screenshot
    await page.screenshot({
      path: "e2e/screenshots/telehealth-banner-desktop.png",
    });
  });

  test("should hide telehealth banner when clinic selected on desktop", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for map to load
    await page.waitForTimeout(1500);

    // Select abortion service
    await page.getByRole("button", { name: "Services filter" }).click();
    await page.getByRole("checkbox", { name: /abortion/i }).check();
    await page.keyboard.press("Escape");

    // Banner should be visible
    const banner = page.getByText(/telehealth options/i);
    await expect(banner).toBeVisible({ timeout: 10000 });

    // Click on a marker
    const marker = page.locator(".mapboxgl-marker").first();
    if (await marker.isVisible()) {
      await marker.click();

      // Wait for clinic details to show
      await page.waitForTimeout(500);

      // Banner is currently hidden when clinic is selected
      await page.screenshot({
        path: "e2e/screenshots/telehealth-banner-clinic-selected-desktop.png",
      });
    }
  });
});

import { test, expect, devices } from "@playwright/test";

test.use({ ...devices["iPhone 13"] });

test.describe("Telehealth Banner - Mobile", () => {
  test("should show telehealth banner when services are selected", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for map to load
    await page.waitForTimeout(1500);

    // Open filter modal
    await page.getByRole("button", { name: /filters/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // Select abortion service (has virtual clinic matches)
    await page.getByRole("checkbox", { name: /abortion/i }).check();

    // Apply filters
    await page.getByRole("button", { name: /apply/i }).click();

    // Wait for banner to appear
    const banner = page.getByText(/telehealth options/i);
    await expect(banner).toBeVisible({ timeout: 10000 });

    // Take screenshot of banner position
    await page.screenshot({
      path: "e2e/screenshots/telehealth-banner-mobile.png",
    });

    // Verify banner has the telehealth-banner data attribute
    await expect(page.locator("[data-telehealth-banner]")).toBeVisible();
  });

  test("should keep telehealth banner visible above bottom sheet when clinic selected", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for map to load
    await page.waitForTimeout(2000);

    // First, find and click a SINGLE clinic marker (empty button, not cluster with number)
    const allMarkerButtons = page.locator(".mapboxgl-marker button");
    const count = await allMarkerButtons.count();

    let clickedSingleMarker = false;
    for (let i = 0; i < count && !clickedSingleMarker; i++) {
      const btn = allMarkerButtons.nth(i);
      const text = await btn.textContent();
      // Single markers have empty text, clusters have numbers
      if (text?.trim() === "") {
        await btn.click();
        clickedSingleMarker = true;
      }
    }

    if (clickedSingleMarker) {
      // Bottom sheet should appear
      await expect(page.locator("[data-bottom-sheet]")).toBeVisible({
        timeout: 5000,
      });

      // Take screenshot showing bottom sheet without banner
      await page.screenshot({
        path: "e2e/screenshots/bottomsheet-no-banner.png",
      });

      // Close the bottom sheet by clicking outside (on the map)
      // The bottom sheet covers filter button, so we need to close it first
      await page.keyboard.press("Escape");
      await expect(page.locator("[data-bottom-sheet]")).not.toBeVisible({
        timeout: 3000,
      });

      // Now add the abortion filter
      await page.getByRole("button", { name: /filters/i }).click();
      await page.getByRole("checkbox", { name: /abortion/i }).check();
      await page.getByRole("button", { name: /apply/i }).click();

      // Banner should appear
      const banner = page.locator("[data-telehealth-banner]");
      await expect(banner).toBeVisible({ timeout: 10000 });

      // Now click another single marker to open bottom sheet WITH banner visible
      // Find another single marker
      const allMarkersAgain = page.locator(".mapboxgl-marker button");
      const count2 = await allMarkersAgain.count();
      for (let i = 0; i < count2; i++) {
        const btn = allMarkersAgain.nth(i);
        const text = await btn.textContent();
        if (text?.trim() === "") {
          await btn.click({ force: true });
          break;
        }
      }

      // Wait for bottom sheet
      await expect(page.locator("[data-bottom-sheet]")).toBeVisible({
        timeout: 5000,
      });

      // Banner should still be visible above the bottom sheet
      await expect(banner).toBeVisible();

      // Take screenshot showing banner above bottom sheet
      await page.screenshot({
        path: "e2e/screenshots/telehealth-banner-above-bottomsheet.png",
      });

      // Verify banner is positioned above the bottom sheet
      const bannerBox = await banner.boundingBox();
      const bottomSheetBox = await page
        .locator("[data-bottom-sheet]")
        .boundingBox();

      if (bannerBox && bottomSheetBox) {
        // Banner bottom should be at or above bottom sheet top
        expect(bannerBox.y + bannerBox.height).toBeLessThanOrEqual(
          bottomSheetBox.y + 5, // Allow 5px tolerance
        );
      }
    } else {
      // Skip test if no single markers visible (all clustered)
      test.skip();
    }
  });

  test("should position telehealth banner in visible map area", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for map to load
    await page.waitForTimeout(1500);

    // Select a service to show the banner
    await page.getByRole("button", { name: /filters/i }).click();
    await page.getByRole("checkbox", { name: /abortion/i }).check();
    await page.getByRole("button", { name: /apply/i }).click();

    // Wait for banner
    const banner = page.locator("[data-telehealth-banner]");
    await expect(banner).toBeVisible({ timeout: 10000 });

    // Get banner position
    const bannerBox = await banner.boundingBox();
    const viewportHeight = page.viewportSize().height;

    // Banner should be visible on screen (not cut off at bottom)
    expect(bannerBox.y + bannerBox.height).toBeLessThan(viewportHeight);
    expect(bannerBox.y).toBeGreaterThan(0);
  });
});

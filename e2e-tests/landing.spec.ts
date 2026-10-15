import { test, expect } from "@playwright/test";

test("landing page loads and displays Reelaty branding and navigation", async ({ page }) => {
  await page.goto("/");
  
  // Verify main branding and heading
  await expect(page.getByText("Reelaty.ai").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: /Create Viral AI Video Reels/i })).toBeVisible();
  
  // Verify CTA button exists
  const getStartedBtn = page.getByRole("button", { name: /Start Creating Free|Get Started Free/i }).first();
  await expect(getStartedBtn).toBeVisible();
});

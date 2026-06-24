// Example: using the TOTP helper inside a Playwright E2E login test.
//
// The key idea is to call generateTOTP() at the exact moment you need the
// code, right before filling the OTP field. TOTP codes rotate every 30
// seconds, so generating it up front (e.g. in beforeAll) risks submitting a
// stale code on slower steps.
//
// Run with: MFA_TOTP_SECRET=<base32-seed> npx playwright test

import { test, expect } from "@playwright/test";
import { generateTOTP } from "../src/totp-helper.js";

test("logs in through the MFA challenge", async ({ page }) => {
  await page.goto("https://example.com/login");

  await page.getByLabel("Email").fill("test-user@example.com");
  await page.getByLabel("Password").fill(process.env.TEST_USER_PASSWORD ?? "");
  await page.getByRole("button", { name: "Sign in" }).click();

  // The MFA challenge screen is now visible. Generate the code at the last
  // possible moment so it is guaranteed to be within the current 30s window.
  const code = generateTOTP();

  await page.getByLabel("One-time code").fill(code);
  await page.getByRole("button", { name: "Verify" }).click();

  await expect(page).toHaveURL(/\/dashboard/);
});

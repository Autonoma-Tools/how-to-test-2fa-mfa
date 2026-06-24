// Test fixture helper for MFA/2FA login testing.
//
// Reads a Base32 TOTP secret from the MFA_TOTP_SECRET environment variable and
// generates the current 6-digit authenticator-app code (SHA1, 6 digits, 30s
// period) at runtime. Import this in an E2E test (Playwright, Cypress, etc.)
// and call generateTOTP() immediately before filling the one-time-code field,
// so the code is always fresh and never expires mid-test.
//
// Never hard-code the secret. Provision MFA_TOTP_SECRET via your test runner's
// environment (CI secret store, .env file that is gitignored, etc.).

import * as OTPAuth from "otpauth";

const ISSUER = "Autonoma";
const LABEL = "mfa-login-test";

/**
 * Build an OTPAuth.TOTP instance from the Base32 secret in the environment.
 * Throws a clear error if MFA_TOTP_SECRET is missing so tests fail loudly
 * instead of silently submitting an empty or wrong code.
 *
 * @returns {OTPAuth.TOTP}
 */
function createTOTP() {
  const secret = process.env.MFA_TOTP_SECRET;

  if (!secret) {
    throw new Error(
      "MFA_TOTP_SECRET is not set. Provide the Base32 TOTP seed via the " +
        "MFA_TOTP_SECRET environment variable before running MFA login tests."
    );
  }

  return new OTPAuth.TOTP({
    issuer: ISSUER,
    label: LABEL,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });
}

/**
 * Generate the current 6-digit TOTP code as a string.
 * Call this immediately before filling the OTP input in your test.
 *
 * @returns {string} the current 6-digit one-time code, e.g. "492817"
 */
export function generateTOTP() {
  return createTOTP().generate();
}

export default generateTOTP;

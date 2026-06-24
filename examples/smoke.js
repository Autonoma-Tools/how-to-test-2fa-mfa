// Quick smoke check: prints the current 6-digit code so you can confirm the
// helper and your MFA_TOTP_SECRET are wired up correctly. The printed code
// should match what your authenticator app shows for the same seed.
//
// Run with: MFA_TOTP_SECRET=<base32-seed> node examples/smoke.js

import { generateTOTP } from "../src/totp-helper.js";

const code = generateTOTP();
console.log(`Current TOTP code: ${code}`);

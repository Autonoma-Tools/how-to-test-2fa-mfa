# How to Test Two-Factor (2FA) and MFA Login

TOTP helper module for MFA login testing: reads a Base32 secret from an env variable and generates the current 6-digit authenticator-app code at runtime using otpauth.

> Companion code for the Autonoma blog post: **[How to Test Two-Factor (2FA) and MFA Login](https://getautonoma.com/blog/how-to-test-2fa-mfa)**

## Requirements

Node 18+ and the [`otpauth`](https://www.npmjs.com/package/otpauth) package. A Base32 TOTP seed for the test account (the same "manual entry" key an authenticator app stores when you scan an enrollment QR code).

## Quickstart

```bash
git clone https://github.com/Autonoma-Tools/how-to-test-2fa-mfa.git
cd how-to-test-2fa-mfa
npm install
cp .env.example .env   # then set a real test-account seed
MFA_TOTP_SECRET=<base32-seed> node examples/smoke.js
```

The smoke script prints the current code. It should match what your authenticator app shows for the same seed.

## Usage in a test

Import the helper and call `generateTOTP()` at the last possible moment, right before filling the one-time-code field. TOTP codes rotate every 30 seconds, so generating the code up front risks submitting a stale value on slower steps.

```js
import { generateTOTP } from "./src/totp-helper.js";

// ...after submitting username + password, on the MFA challenge screen:
const code = generateTOTP();
await page.getByLabel("One-time code").fill(code);
await page.getByRole("button", { name: "Verify" }).click();
```

See [`examples/playwright-login.spec.js`](./examples/playwright-login.spec.js) for a full Playwright login flow.

The secret is read from `process.env.MFA_TOTP_SECRET`. If it is missing, the helper throws a clear error so tests fail loudly instead of submitting an empty code. Never hard-code the seed; provision it through your CI secret store or a gitignored `.env`.

## Project structure

```
how-to-test-2fa-mfa/
├── src/
│   └── totp-helper.js              # the reusable generateTOTP() helper
├── examples/
│   ├── playwright-login.spec.js    # full MFA login flow in Playwright
│   └── smoke.js                    # prints the current code to verify setup
├── .env.example                    # MFA_TOTP_SECRET placeholder
├── package.json
├── LICENSE
└── README.md
```

- `src/` — primary source files for the snippets referenced in the blog post.
- `examples/` — runnable examples you can execute as-is.

## About

This repository is maintained by [Autonoma](https://getautonoma.com) as reference material for the linked blog post. Autonoma builds autonomous AI agents that plan, execute, and maintain end-to-end tests directly from your codebase.

If something here is wrong, out of date, or unclear, please [open an issue](https://github.com/Autonoma-Tools/how-to-test-2fa-mfa/issues/new).

## License

Released under the [MIT License](./LICENSE) © 2026 Autonoma Labs.

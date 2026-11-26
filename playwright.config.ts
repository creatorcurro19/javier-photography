import { defineConfig } from "@playwright/test";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3105;

/** Secreto ficticio solo para firmar eventos de prueba del webhook de Stripe en local. */
export const E2E_WEBHOOK_SECRET = "whsec_e2e_local_only";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
  },
  webServer: {
    command: `npx next start -p ${PORT}`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: { STRIPE_WEBHOOK_SECRET: E2E_WEBHOOK_SECRET },
  },
});

/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Short app / brand name (nav, meta title, image alt). */
  readonly VITE_APP_NAME?: string;
  /**
   * Logo URL: site-root path (e.g. `/potterwiki-logo.png` in `public/`) or full `https://…` URL.
   */
  readonly VITE_APP_LOGO_URL?: string;
  /** GA4 Measurement ID (e.g. `G-XXXXXXXXXX`). Overrides code default when set. */
  readonly VITE_GA_MEASUREMENT_ID?: string;
  /** `"true"` / `"false"` to override default enablement (prod on, dev off). */
  readonly VITE_ENABLE_ANALYTICS?: string;
  /** `"true"` / `"false"` — verbose module logs + GA `debug_mode` when analytics runs. */
  readonly VITE_GA_DEBUG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

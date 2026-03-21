/**
 * Client-side branding from `VITE_APP_*` env vars (inlined at build time).
 * Falls back to bundled logo + default name when unset.
 */
import defaultLogo from "@/assets/potterwiki-logo.png";

const envName = import.meta.env.VITE_APP_NAME?.trim();
const envLogo = import.meta.env.VITE_APP_LOGO_URL?.trim();

/** Display name in nav, footer, share card alt text, etc. */
export const APP_NAME =
  envName && envName.length > 0 ? envName : "Potter Wiki";

/**
 * Logo URL for `<img src>` — public path, absolute URL, or bundled asset default.
 * Set `VITE_APP_LOGO_URL` (e.g. `/potterwiki-logo.png` or a CDN URL) per environment.
 */
export const APP_LOGO_SRC: string =
  envLogo && envLogo.length > 0 ? envLogo : defaultLogo;

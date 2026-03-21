/**
 * @fileoverview Runtime configuration for analytics (measurement ID, enable flags, debug).
 *
 * @purpose Single source of truth so behavior differs by environment without touching client code.
 * @why Environment toggles and the measurement ID must not be hard-coded across the codebase.
 * @when Read by `analyticsClient` during `initAnalytics`; avoid importing this from UI components.
 *
 * @example
 * ```ts
 * // In .env.development — force analytics on while debugging:
 * // VITE_ENABLE_ANALYTICS=true
 * // VITE_GA_DEBUG=true
 * ```
 *
 * @edgeCases Missing `VITE_*` vars fall back to sane defaults; invalid booleans are treated as unset.
 */

/**
 * Default GA4 measurement ID when `VITE_GA_MEASUREMENT_ID` is not set in `.env.*`.
 * Override per mode in `.env.development` / `.env.production` (e.g. separate property on `live`).
 */
export const GA_MEASUREMENT_ID = "G-JSFW6F07X6" as const;

/**
 * Resolves measurement ID: env wins when non-empty, else default constant.
 *
 * @purpose Let production / “live” builds use a different GA property without code changes.
 * @why `import.meta.env.VITE_GA_MEASUREMENT_ID` is inlined at build time per Vite mode.
 */
function resolveMeasurementId(): string {
  const fromEnv = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
  if (fromEnv) return fromEnv;
  return GA_MEASUREMENT_ID;
}

/**
 * Parses "true"/"false" from env; returns undefined if unset or unrecognized.
 *
 * @purpose Normalize Vite string env vars into booleans.
 * @why `import.meta.env` values are always strings when defined via `.env` files.
 * @when Used internally when resolving enable/debug flags.
 *
 * @example
 * ```ts
 * parseEnvBoolean(import.meta.env.VITE_ENABLE_ANALYTICS);
 * ```
 *
 * @edgeCases Empty string → undefined; any value other than true/false (case-insensitive) → undefined.
 */
function parseEnvBoolean(value: string | undefined): boolean | undefined {
  if (value === undefined || value === "") return undefined;
  const v = value?.trim()?.toLowerCase();
  if (v === "true") return true;
  if (v === "false") return false;
  return undefined;
}

const explicitEnable = parseEnvBoolean(import.meta.env.VITE_ENABLE_ANALYTICS);
const explicitDebug = parseEnvBoolean(import.meta.env.VITE_GA_DEBUG);

/**
 * Resolved analytics configuration for the current build/runtime.
 *
 * @purpose Expose one object the client can read without re-deriving rules.
 * @why Call sites should not duplicate "when is analytics on?" logic.
 * @when After module load; values are fixed for the lifetime of the page (Vite inlines at build time).
 *
 * @example
 * ```ts
 * if (analyticsConfig.enabled) initAnalytics();
 * ```
 *
 * @edgeCases
 * - SSR/build: reads `import.meta.env` safely; no `window` access here.
 * - Default: enabled in production only; dev stays off unless `VITE_ENABLE_ANALYTICS=true`.
 */
export const analyticsConfig = {
  measurementId: resolveMeasurementId(),

  /**
   * Whether network calls to GA should run.
   * - `VITE_ENABLE_ANALYTICS=true` forces on (including dev).
   * - `VITE_ENABLE_ANALYTICS=false` forces off.
   * - Otherwise: on in production, off in development.
   */
  enabled:
    explicitEnable !== undefined
      ? explicitEnable
      : Boolean(import.meta.env.PROD),

  /**
   * Verbose console logging from our module + GA debug_mode when supported.
   * - `VITE_GA_DEBUG=true` turns on.
   * - Otherwise mirrors `import.meta.env.DEV` for local visibility.
   */
  debug:
    explicitDebug !== undefined ? explicitDebug : Boolean(import.meta.env.DEV),
} as const;

export type AnalyticsConfig = typeof analyticsConfig;

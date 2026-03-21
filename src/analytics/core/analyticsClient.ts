/**
 * @fileoverview Low-level GA4 adapter: wraps `react-ga4`, singleton init, SSR-safe sends.
 *
 * @purpose Isolate third-party GA details so the rest of the module (and app) stays vendor-agnostic.
 * @why Swapping GA for Mixpanel later should touch this file and `analyticsService`, not UI.
 * @when Used by `analyticsService`, `usePageTracking`, and `initAnalytics` — not imported by feature components.
 *
 * @example
 * ```ts
 * initAnalytics();
 * sendPageView("/quizzes");
 * sendEvent("custom_event", { foo: "bar" });
 * ```
 *
 * @edgeCases
 * - SSR / no `window`: init and sends no-op.
 * - Ad blockers / offline: `react-ga4` may fail silently; we catch and log in debug only.
 * - Double init: guarded by module flag + library state.
 */

import ReactGA from "react-ga4";
import { analyticsConfig } from "../config/analyticsConfig";

let clientInitialized = false;

/** Last page view dedupe (mitigates React Strict Mode double effect in development). */
let lastPageView: { path: string; at: number } | null = null;

const DEDUPE_MS = 120;

/**
 * Logs to console when `analyticsConfig.debug` is true; never throws.
 *
 * @purpose Offer visibility without polluting production logs.
 * @why Operators need a switchable trace path when validating events.
 * @when Called from init/send helpers on interesting branches or errors.
 *
 * @example `debugLog("analytics", "init skipped", { reason: "disabled" });`
 *
 * @edgeCases If `console` is missing (very old browsers), the call is skipped.
 */
function debugLog(scope: string, message: string, detail?: unknown): void {
  if (!analyticsConfig?.debug || typeof console === "undefined") return;
  if (detail !== undefined) {
    console.info(`[${scope}] ${message}`, detail);
  } else {
    console.info(`[${scope}] ${message}`);
  }
}

/**
 * Initializes the GA4 client once using `analyticsConfig`.
 *
 * @purpose Load gtag and configure the measurement ID when analytics is enabled.
 * @why Multiple `initialize` calls can duplicate tags or skew session logic.
 * @when Call once from the app root (e.g. `App.tsx` in `useEffect`).
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   initAnalytics();
 * }, []);
 * ```
 *
 * @edgeCases Disabled config, SSR, or missing browser APIs → no-op; errors swallowed with debug log.
 */
export function initAnalytics(): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    debugLog("analytics", "init skipped (SSR or no document)");
    return;
  }

  if (!analyticsConfig.enabled) {
    debugLog(
      "analytics",
      "init skipped (analytics disabled for this environment)",
    );
    return;
  }

  if (clientInitialized) {
    debugLog("analytics", "init skipped (already initialized)");
    return;
  }

  try {
    ReactGA.initialize(analyticsConfig.measurementId, {
      testMode: false,
      ...(analyticsConfig.debug ? { gtagOptions: { debug_mode: true } } : {}),
    });
    clientInitialized = true;
    debugLog("analytics", "initialized", { id: analyticsConfig.measurementId });
  } catch (e) {
    debugLog("analytics", "init failed (caught)", e);
  }
}

/**
 * Sends a GA4 `page_view` for the given path (path + query recommended).
 *
 * @purpose Record SPA navigations because GA does not auto-track client-side route changes.
 * @why The router changes URL without full reload; explicit page views keep funnels accurate.
 * @when Called from `usePageTracking` on location changes.
 *
 * @example `sendPageView(`${location.pathname}${location.search}`);`
 *
 * @edgeCases
 * - No-op if not initialized or disabled.
 * - Identical path within `DEDUPE_MS` ms is ignored to reduce duplicate dev noise.
 */
export function sendPageView(path: string): void {
  if (typeof window === "undefined") return;
  if (!analyticsConfig.enabled || !clientInitialized) {
    debugLog("analytics", "page_view skipped", {
      path,
      initialized: clientInitialized,
    });
    return;
  }

  const now = Date.now();
  if (
    lastPageView &&
    lastPageView.path === path &&
    now - lastPageView.at < DEDUPE_MS
  ) {
    debugLog("analytics", "page_view deduped", { path });
    return;
  }
  lastPageView = { path, at: now };

  try {
    ReactGA.send({ hitType: "pageview", page: path });
    debugLog("analytics", "page_view sent", { path });
  } catch (e) {
    debugLog("analytics", "page_view failed (caught)", e);
  }
}

/**
 * Sends a GA4 custom event with optional parameters (PII-free).
 *
 * @purpose Generic transport for named events after initialization.
 * @why `analyticsService` maps business actions to events without importing `react-ga4`.
 * @when After `initAnalytics`; from service methods only (from the app’s perspective).
 *
 * @example `sendEvent("quiz_completed", { score: 8, total: 10 });`
 *
 * @edgeCases Uninitialized client → debug log and return; network failures are non-fatal.
 */
export function sendEvent(
  eventName: string,
  params?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  if (!analyticsConfig.enabled || !clientInitialized) {
    debugLog("analytics", "event skipped", {
      eventName,
      initialized: clientInitialized,
    });
    return;
  }

  try {
    ReactGA.event(eventName, params);
    debugLog("analytics", "event sent", { eventName, params });
  } catch (e) {
    debugLog("analytics", "event failed (caught)", { eventName, e });
  }
}

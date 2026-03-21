/**
 * @fileoverview Public entry for the analytics module — import only from here in application code.
 *
 * @purpose Enforce a facade: internal folders (`core`, `events`, `config`) stay replaceable.
 * @why A single export surface documents the supported API and simplifies refactors.
 * @when `import { initAnalytics, usePageTracking, analyticsService } from "@/analytics"`.
 *
 * @example
 * ```tsx
 * import { initAnalytics, usePageTracking, analyticsService } from "@/analytics";
 * ```
 *
 * @edgeCases Do not import `../analytics/core/...` from features — that breaks encapsulation.
 */

export { initAnalytics } from "./core/analyticsClient";
export { usePageTracking } from "./hooks/usePageTracking";
export { analyticsService } from "./services/analyticsService";
export type { QuizCompletedAnalyticsPayload } from "./types";

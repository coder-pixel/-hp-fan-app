/**
 * @fileoverview Shared TypeScript types for the analytics module.
 *
 * @purpose Centralize shapes that cross service boundaries so callers and tests stay aligned.
 * @why Keeps the public contract explicit and avoids scattering inline object types across the app.
 * @when Import from `@/analytics` when typing analytics payloads in features or tests.
 *
 * @example
 * ```ts
 * import type { QuizCompletedAnalyticsPayload } from "@/analytics";
 * const payload: QuizCompletedAnalyticsPayload = { score: 8, total: 10 };
 * ```
 *
 * @edgeCases These types intentionally exclude PII; never extend them with user-identifiable fields.
 */

/** Payload for quiz completion analytics (scores only — no personal data). */
export type QuizCompletedAnalyticsPayload = {
  score: number;
  total: number;
};

/**
 * @fileoverview Canonical GA4 event names (snake_case) for this application.
 *
 * @purpose Prevent typos and duplicate event strings across features.
 * @why GA reports aggregate by name; inconsistent spelling splits data.
 * @when Import only inside `analyticsService` (or future provider adapters), not from UI.
 *
 * @example
 * ```ts
 * import { ANALYTICS_EVENTS } from "./analyticsEvents";
 * sendEvent(ANALYTICS_EVENTS.quiz_start);
 * ```
 *
 * @edgeCases Renaming a constant is a breaking analytics change — update GA4 custom definitions if used.
 */

/**
 * All custom / business event names sent to GA4.
 * Use snake_case per project convention.
 */
export const ANALYTICS_EVENTS = {
  quiz_start: "quiz_start",
  quiz_answer_selected: "quiz_answer_selected",
  quiz_completed: "quiz_completed",
  result_viewed: "result_viewed",
  share: "share",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

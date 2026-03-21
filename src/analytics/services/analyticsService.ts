/**
 * @fileoverview High-level analytics API for product features (quiz, results, share).
 *
 * @purpose Give UI a small, stable surface area: no `react-ga4`, no event string literals.
 * @why Prevents GA implementation details from leaking into components and eases future multi-vendor routing.
 * @when Import `analyticsService` from `@/analytics` inside hooks or event handlers — never `analyticsClient`.
 *
 * @example
 * ```tsx
 * import { analyticsService } from "@/analytics";
 * analyticsService.trackQuizStart();
 * ```
 *
 * @edgeCases All methods no-op when analytics is disabled or uninitialized; never throw to callers.
 */

import { sendEvent } from "../core/analyticsClient";
import { ANALYTICS_EVENTS } from "../events/analyticsEvents";
import type { QuizCompletedAnalyticsPayload } from "../types";

/**
 * Tracks the start of a quiz session.
 *
 * @purpose Funnel entry for quiz engagement.
 * @why Product wants to compare starts vs completions.
 * @when When the user begins a quiz (e.g. first question shown or “Start” confirmed).
 *
 * @example `analyticsService.trackQuizStart();`
 *
 * @edgeCases Safe to call multiple times per session if UX allows restarts — GA will show multiple starts.
 */
function trackQuizStart(): void {
  sendEvent(ANALYTICS_EVENTS.quiz_start);
}

/**
 * Records which option was chosen for a question (identifiers only, not free text answers).
 *
 * @purpose Question-level engagement and difficulty signals.
 * @why Aggregated option distribution helps content design without storing PII.
 * @when On answer commit / selection lock for multiple-choice style flows.
 *
 * @example `analyticsService.trackAnswerSelected("q_hp_01", "b");`
 *
 * @edgeCases Pass stable `questionId` keys from data files, not user-generated strings.
 */
function trackAnswerSelected(
  questionId: string,
  selectedOption: string
): void {
  sendEvent(ANALYTICS_EVENTS.quiz_answer_selected, {
    question_id: questionId,
    selected_option: selectedOption,
  });
}

/**
 * Fires when a quiz run finishes with a score.
 *
 * @purpose Completion funnel and performance distribution.
 * @why `score` / `total` are numeric aggregates acceptable in GA; avoid raw answer payloads.
 * @when Results screen is reached or quiz engine emits completion.
 *
 * @example `analyticsService.trackQuizCompleted({ score: 8, total: 10 });`
 *
 * @edgeCases Invalid totals should be validated upstream; we still send if called (GA may filter).
 */
function trackQuizCompleted(payload: QuizCompletedAnalyticsPayload): void {
  sendEvent(ANALYTICS_EVENTS.quiz_completed, {
    score: payload.score,
    total: payload.total,
  });
}

/**
 * Result screen viewed with final score context.
 *
 * @purpose Separate “saw results” from “completed quiz” if those moments differ in the UX.
 * @why Some users may complete but abandon before the results view loads.
 * @when Results route mounts or main result UI becomes visible.
 *
 * @example `analyticsService.trackResultViewed(8);`
 *
 * @edgeCases Score should match the same scale used in `trackQuizCompleted` for consistency.
 */
function trackResultViewed(score: number): void {
  sendEvent(ANALYTICS_EVENTS.result_viewed, { score });
}

/**
 * Share action (social / copy / native share target).
 *
 * @purpose Measure virality by channel.
 * @why `platform` is a coarse label (e.g. `twitter`, `clipboard`), not a user identifier.
 * @when User confirms share or system share sheet completes successfully.
 *
 * @example `analyticsService.trackShare("twitter");`
 *
 * @edgeCases Use a small fixed vocabulary of platform strings for clean reporting.
 */
function trackShare(platform: string): void {
  sendEvent(ANALYTICS_EVENTS.share, { platform });
}

/**
 * Stable namespace exported as the only business-level analytics entry point.
 */
export const analyticsService = {
  trackQuizStart,
  trackAnswerSelected,
  trackQuizCompleted,
  trackResultViewed,
  trackShare,
} as const;

/**
 * @fileoverview React Router hook: sends GA4 page views on SPA navigations.
 *
 * @purpose Decouple routing from GA — components never call `sendPageView` directly.
 * @why Central tracking avoids missed routes and duplicate logic in every layout/page.
 * @when Mount once inside `BrowserRouter` (same tree as `Routes`), typically next to root routes.
 *
 * @example
 * ```tsx
 * function AnalyticsShell({ children }: { children: React.ReactNode }) {
 *   usePageTracking();
 *   return <>{children}</>;
 * }
 * // <BrowserRouter><AnalyticsShell><Routes>...</Routes></AnalyticsShell></BrowserRouter>
 * ```
 *
 * @edgeCases
 * - Requires Router context — will throw if used outside `BrowserRouter` (React Router contract).
 * - Does not re-render the tree beyond hook subscriptions; only runs side effects.
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { sendPageView } from "../core/analyticsClient";

/**
 * Subscribes to `location` changes and forwards `pathname + search` to GA4.
 *
 * @purpose Keep page_view stream aligned with visible URL in SPAs.
 * @why Hash-only navigations might need `location.hash` later; base case is path + query.
 * @when Called unconditionally in a component rendered under `BrowserRouter`.
 *
 * @example See file-level example.
 *
 * @edgeCases
 * - Initial mount + every navigation: one `sendPageView` per distinct effect run.
 * - `sendPageView` handles disabled analytics and init state internally.
 */
export function usePageTracking(): void {
  const location = useLocation();

  useEffect(() => {
    const path = `${location?.pathname}${location?.search}`;
    sendPageView(path);
  }, [location?.pathname, location?.search]);
}

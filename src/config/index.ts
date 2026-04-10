export const SUPPORT_EMAIL = "potterwiki07@gmail.com";

export const WEB3FORMS_ACCESS_KEY = import.meta.env
  .VITE_WEB3FORMS_ACCESS_KEY as string | undefined;

export const DEFAULT_THEME = (import.meta.env.VITE_DEFAULT_THEME ?? "light") as
  | "light"
  | "dark";

export { APP_NAME, APP_LOGO_SRC } from "./appBranding";

export { analyticsConfig, GA_MEASUREMENT_ID } from "@/analytics/config/analyticsConfig";

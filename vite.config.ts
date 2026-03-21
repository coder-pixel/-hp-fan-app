import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

/** Escape user-controlled app name for HTML title / meta `content` attributes. */
function _escapeHtml(text: string): string {
  return text
    ?.replace(/&/g, "&amp;")
    ?.replace(/</g, "&lt;")
    ?.replace(/>/g, "&gt;")
    ?.replace(/"/g, "&quot;");
}

/**
 * Injects `VITE_APP_NAME` and `VITE_APP_LOGO_URL` into `index.html` at build/dev time.
 * Placeholders in `index.html` use `__BRAND_*__` (not `%VITE_%`) so Vite does not treat them as env injection.
 */
function brandingHtmlPlugin(mode: string) {
  const env = loadEnv(mode, process?.cwd(), "");
  const appName = env.VITE_APP_NAME?.trim() || "Potter Wiki";
  const logoUrl = env.VITE_APP_LOGO_URL?.trim() || "/potterwiki-logo.png";
  const documentTitle = `${_escapeHtml(appName)} — Harry Potter Quizzes, Polls &amp; Fun Facts`;

  return {
    name: "inject-app-branding-html",
    transformIndexHtml(html: string) {
      return html
        ?.replaceAll("__BRAND_HTML_TITLE__", documentTitle)
        ?.replaceAll("__BRAND_LOGO_URL__", logoUrl);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // server: {
  //   host: "::",
  //   port: 8080,
  //   hmr: {
  //     overlay: false,
  //   },
  // },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    brandingHtmlPlugin(mode),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

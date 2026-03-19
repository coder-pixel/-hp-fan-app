import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

/**
 * ═══════════════════════════════════════════════════════════════
 *  Potter Wiki — DESIGN SYSTEM
 *  Tailwind Configuration & Design Token Reference
 * ═══════════════════════════════════════════════════════════════
 *
 *  All colors reference CSS custom properties defined in src/index.css.
 *  To create a new theme, add a [data-theme="name"] block in index.css
 *  and override the relevant --variables. No Tailwind changes needed.
 *
 *  TOKEN NAMING CONVENTION
 *  ───────────────────────
 *  Semantic        → background, foreground, primary, secondary, accent
 *  Component-scope → card, popover, sidebar
 *  State           → destructive, muted
 *  Brand-specific  → gold, gold-glow, indigo-deep, purple-royal
 */

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      /* ─── Typography ──────────────────────────────────────────
       *  display : Cinzel serif — used for headings, titles, magical text
       *  body    : Montserrat sans — used for body copy, labels, UI text
       */
      fontFamily: {
        display: ["Cinzel", "serif"],
        body: ["Montserrat", "sans-serif"],
      },

      /* ─── Color System ────────────────────────────────────────
       *  All values resolve to CSS variables from index.css.
       *  Wrapped in hsl() so Tailwind opacity modifiers work
       *  (e.g. bg-primary/50).
       *
       *  To add a new semantic color:
       *  1. Add --new-color in :root {} in index.css
       *  2. Add the mapping below
       *  3. Override in [data-theme] blocks for alternate themes
       */
      colors: {
        /* ── Core semantic tokens ── */

        /** Page background — darkest surface
         *  Usage: body, full-page backgrounds
         *  Example: bg-background */
        border: "hsl(var(--border))",

        /** Form input borders
         *  Usage: text inputs, selects, textareas
         *  Example: border-input */
        input: "hsl(var(--input))",

        /** Focus ring color
         *  Usage: focus-visible outlines
         *  Example: ring-ring */
        ring: "hsl(var(--ring))",

        /** Main page background
         *  Usage: <body>, page-level wrappers
         *  Example: bg-background */
        background: "hsl(var(--background))",

        /** Default text color on background
         *  Usage: body text, paragraphs
         *  Example: text-foreground */
        foreground: "hsl(var(--foreground))",

        /** Primary brand color — deep indigo
         *  Usage: primary buttons, active states, key highlights
         *  Example: bg-primary, text-primary */
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },

        /** Secondary brand color — royal purple
         *  Usage: secondary buttons, tags, accents
         *  Example: bg-secondary, border-secondary */
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },

        /** Error / danger color
         *  Usage: error messages, destructive actions, wrong answers
         *  Example: bg-destructive, text-destructive */
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },

        /** Muted / subdued surfaces
         *  Usage: disabled states, secondary backgrounds, subtle text
         *  Example: bg-muted, text-muted-foreground */
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

        /** Accent color — gold
         *  Usage: highlights, score display, call-to-action sparkle
         *  Example: text-accent, border-accent */
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },

        /** Popover / dropdown surfaces
         *  Usage: tooltip backgrounds, dropdown menus
         *  Example: bg-popover */
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        /** Card surfaces
         *  Usage: quiz cards, info panels, glass-card base
         *  Example: bg-card */
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        /* ── Brand-specific magical tokens ── */

        /** Magical gold — warm amber
         *  Usage: score highlights, CTA buttons, streak indicators
         *  Example: text-gold, border-gold */
        gold: "hsl(var(--gold))",

        /** Gold glow — lighter gold for glow effects
         *  Usage: box-shadow glows, hover states
         *  Example: shadow-[0_0_20px_hsl(var(--gold-glow)/0.3)] */
        "gold-glow": "hsl(var(--gold-glow))",

        /** Deep indigo — matches primary
         *  Usage: gradient endpoints, deep backgrounds
         *  Example: from-indigo-deep */
        "indigo-deep": "hsl(var(--indigo-deep))",

        /** Royal purple — matches secondary
         *  Usage: gradient endpoints, magical effects
         *  Example: to-purple-royal */
        "purple-royal": "hsl(var(--purple-royal))",

        /** Success green — correct answer feedback
         *  Usage: correct answer borders, success states
         *  Example: border-success, text-success */
        success: "hsl(var(--success))",

        /** Success green foreground
         *  Usage: text on success backgrounds */
        "success-foreground": "hsl(var(--success-foreground))",

        /* ── Sidebar component tokens ── */
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },

      /* ─── Border Radius ───────────────────────────────────────
       *  Based on --radius variable for global consistency.
       *  Default --radius: 0.75rem (12px)
       */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      /* ─── Keyframes ───────────────────────────────────────────
       *  Reusable animations for the magical UI.
       */
      keyframes: {
        /** Accordion expand animation (shadcn/ui) */
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        /** Accordion collapse animation (shadcn/ui) */
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        /** Gentle vertical float — used for floating particles, icons
         *  Duration: typically 6s infinite */
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        /** Pulsing sparkle — used for magical highlights
         *  Duration: typically 1.5s infinite */
        sparkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.1)" },
        },
        /** Background shimmer — used for loading states, gold text
         *  Duration: typically 3s linear infinite */
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        /** Floating particles — used for background particle system
         *  Duration: typically 8s infinite */
        "particle-float": {
          "0%": { transform: "translateY(100vh) scale(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(-10vh) scale(1)", opacity: "0" },
        },
      },

      /* ─── Animation Presets ───────────────────────────────────
       *  Ready-to-use animation classes.
       *  Usage: className="animate-float"
       */
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        sparkle: "sparkle 1.5s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "particle-float": "particle-float 8s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

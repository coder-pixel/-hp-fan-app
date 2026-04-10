import { createContext, useContext } from "react";
import { ThemeName, ThemeContextValue } from "./theme.types";
import { STORAGE_KEY } from "./theme.constants";
import { DEFAULT_THEME } from "@/config";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const getInitialTheme = (): ThemeName => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  if (typeof window !== "undefined" && window.matchMedia) {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  return DEFAULT_THEME;
};

export { ThemeContext };

import { ThemeTokens, ThemeName } from "./theme.types";

export const STORAGE_KEY = "hp-fan-app-theme";

export const darkTheme: ThemeTokens = {
  name: "dark" as ThemeName,
  background: "hsl(0 0% 2%)",
  surface: "hsl(0 0% 7%)",
  textPrimary: "hsl(214 32% 91%)",
  textSecondary: "hsl(214 20% 60%)",
  accent: "hsl(43 72% 52%)",
  border: "hsl(270 30% 20%)",
  cardBackground: "hsl(0 0% 7%)",
  buttonPrimary: "hsl(43 72% 52%)",
  buttonSecondary: "hsl(270 66% 35%)",
};

export const lightTheme: ThemeTokens = {
  name: "light" as ThemeName,
  background: "hsl(220 20% 97%)",
  surface: "hsl(220 15% 100%)",
  textPrimary: "hsl(220 15% 15%)",
  textSecondary: "hsl(220 10% 45%)",
  accent: "hsl(270 55% 45%)",
  border: "hsl(220 15% 85%)",
  cardBackground: "hsl(220 20% 100%)",
  buttonPrimary: "hsl(270 55% 45%)",
  buttonSecondary: "hsl(220 10% 65%)",
};

export const themes: Record<ThemeName, ThemeTokens> = {
  dark: darkTheme,
  light: lightTheme,
};

export const getTheme = (name: ThemeName): ThemeTokens => themes[name];

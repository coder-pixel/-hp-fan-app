export type ThemeName = "dark" | "light";

export interface ThemeTokens {
  name: ThemeName;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  border: string;
  cardBackground: string;
  buttonPrimary: string;
  buttonSecondary: string;
}

export interface ThemeContextValue {
  theme: ThemeName;
  toggleTheme: () => void;
  isDark: boolean;
}

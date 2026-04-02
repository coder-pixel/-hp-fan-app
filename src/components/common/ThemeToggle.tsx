import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/theme";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-md border border-border/40 shadow-[0_2px_12px_-2px_hsla(var(--foreground)/0.1)] hover:border-accent/50 hover:shadow-[0_0_16px_hsla(var(--accent)/0.15)] transition-all duration-300"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <Moon className={`w-3.5 h-3.5 ${theme === "dark" ? "text-accent" : "text-muted-foreground"}`} />
      <div className="relative w-9 h-5 rounded-full bg-background/50 border border-border/30 transition-colors duration-300">
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full shadow-md transition-all duration-300 ${
            theme === "dark"
              ? "left-0.5 bg-accent"
              : "left-[calc(100%-1.125rem)] bg-primary"
          }`}
        />
      </div>
      <Sun className={`w-3.5 h-3.5 ${theme === "light" ? "text-accent" : "text-muted-foreground"}`} />
    </button>
  );
};

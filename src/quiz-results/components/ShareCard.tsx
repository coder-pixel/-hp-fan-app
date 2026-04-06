import { forwardRef } from "react";
import { Star, Sparkles, Wand2, Coffee } from "lucide-react";
import { APP_NAME } from "@/config/appBranding";
import type { ShareCardTheme } from "../types/result.types";
import { cn } from "@/lib/utils";

export interface ShareCardProps {
  theme: ShareCardTheme;
  headline: string;
  score: number;
  total: number;
  percent?: number;
  quizTitle?: string;
  challengeLine?: string;
  className?: string;
}

const themeStyles: Record<ShareCardTheme, { 
  bg: string; 
  text: string; 
  accent: string; 
  border: string;
  scoreColor: string;
  iconBg: string;
}> = {
  light: {
    bg: "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50",
    text: "text-amber-900",
    accent: "text-amber-600",
    border: "border-amber-200/60",
    scoreColor: "text-amber-600",
    iconBg: "bg-amber-400/20",
  },
  dark: {
    bg: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
    text: "text-amber-100",
    accent: "text-amber-400",
    border: "border-amber-500/30",
    scoreColor: "text-amber-400",
    iconBg: "bg-amber-400/20",
  },
  fun: {
    bg: "bg-gradient-to-br from-violet-600 via-fuchsia-600 to-amber-500",
    text: "text-white",
    accent: "text-yellow-200",
    border: "border-white/30",
    scoreColor: "text-white",
    iconBg: "bg-white/20",
  },
};

const decorativeElements = {
  light: [
    { icon: Star, className: "absolute top-6 left-4 h-4 w-4 text-amber-300 rotate-12" },
    { icon: Sparkles, className: "absolute top-10 right-6 h-5 w-5 text-amber-400 -rotate-6" },
    { icon: Star, className: "absolute bottom-14 left-6 h-3 w-3 text-amber-300/60 rotate-45" },
    { icon: Sparkles, className: "absolute bottom-16 right-4 h-4 w-4 text-amber-400/70 rotate-12" },
  ],
  dark: [
    { icon: Star, className: "absolute top-6 left-4 h-4 w-4 text-amber-400/60 rotate-12" },
    { icon: Sparkles, className: "absolute top-10 right-6 h-5 w-5 text-amber-400/80 -rotate-6" },
    { icon: Star, className: "absolute bottom-14 left-6 h-3 w-3 text-amber-400/40 rotate-45" },
    { icon: Sparkles, className: "absolute bottom-16 right-4 h-4 w-4 text-amber-400/60 rotate-12" },
  ],
  fun: [
    { icon: Star, className: "absolute top-6 left-4 h-4 w-4 text-white/60 rotate-12" },
    { icon: Sparkles, className: "absolute top-10 right-6 h-5 w-5 text-yellow-200/80 -rotate-6" },
    { icon: Star, className: "absolute bottom-14 left-6 h-3 w-3 text-white/40 rotate-45" },
    { icon: Sparkles, className: "absolute bottom-16 right-4 h-4 w-4 text-yellow-200/60 rotate-12" },
  ],
};

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard(
    {
      theme,
      headline,
      score,
      total,
      percent,
      quizTitle,
      challengeLine,
      className,
    },
    ref,
  ) {
    const styles = themeStyles[theme];
    const resolvedPercent = total > 0 ? percent ?? Math.round((score / total) * 100) : 0;
    const elements = decorativeElements[theme];

    const getAchievement = () => {
      if (resolvedPercent >= 90) return { emoji: "🏆", label: "Outstanding!" };
      if (resolvedPercent >= 70) return { emoji: "⭐", label: "Great Job!" };
      if (resolvedPercent >= 50) return { emoji: "✨", label: "Well Done!" };
      return { emoji: "🪄", label: "Keep Trying!" };
    };

    const achievement = getAchievement();

    return (
      <div
        ref={ref}
        className={cn(
          "relative mx-auto flex w-full max-w-[340px] flex-col items-center justify-center rounded-3xl border p-5 sm:p-7 shadow-2xl overflow-hidden",
          styles.bg,
          styles.border,
          className,
        )}
      >
        <div
          className={cn(
            "absolute -right-20 -top-20 h-40 w-40 rounded-full blur-3xl",
            theme === "light"
              ? "bg-amber-300/40"
              : theme === "dark"
                ? "bg-amber-500/30"
                : "bg-fuchsia-300/40",
          )}
          aria-hidden
        />

        <div
          className={cn(
            "absolute -left-16 -bottom-16 h-36 w-36 rounded-full blur-2xl",
            theme === "light"
              ? "bg-orange-300/40"
              : theme === "dark"
                ? "bg-violet-500/30"
                : "bg-amber-300/40",
          )}
          aria-hidden
        />

        {elements.map((el, i) => (
          <el.icon key={i} className={el.className} strokeWidth={2.5} />
        ))}

        <div className="relative z-10 text-center">
          <p
            className={cn(
              "mb-1 font-display text-xs font-medium tracking-widest uppercase opacity-40",
              styles.text,
            )}
          >
            {APP_NAME}
          </p>

          <div className={cn("mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full", styles.iconBg)}>
            <Wand2 className={cn("h-3.5 w-3.5", styles.accent)} />
            <span className={cn("text-xs font-medium", styles.accent)}>
              {achievement.label}
            </span>
          </div>

          <p
            className={cn(
              "mb-3 font-display text-2xl sm:text-3xl font-bold leading-tight",
              styles.text,
            )}
          >
            {headline}
          </p>

          <p
            className={cn(
              "mb-4 text-sm font-medium leading-relaxed opacity-75",
              styles.text,
            )}
          >
            I scored <span className="font-bold">{score}/{total}</span> in {quizTitle ?? "the Quiz"}
          </p>

          <div className="mb-4 relative inline-flex">
            <div
              className={cn(
                "absolute inset-0 rounded-full blur-xl",
                theme === "light"
                  ? "bg-amber-400/30"
                  : theme === "dark"
                    ? "bg-amber-400/40"
                    : "bg-white/30",
              )}
            />
            <div className={cn("relative px-6 py-3 rounded-full border", styles.border, styles.iconBg)}>
              <p
                className={cn(
                  "font-display text-5xl sm:text-6xl font-black tracking-tight",
                  styles.scoreColor,
                )}
              >
                {resolvedPercent}%
              </p>
            </div>
          </div>

          <p
            className={cn(
              "mb-2 text-[10px] font-medium uppercase tracking-widest opacity-40",
              styles.text,
            )}
          >
            Accuracy
          </p>

          <div className={cn("w-full max-w-[180px] mx-auto mb-4 h-1.5 rounded-full bg-black/10 overflow-hidden")}>
            <div
              className={cn(
                "h-full rounded-full",
                theme === "fun" ? "bg-white" : "bg-amber-500",
              )}
              style={{ width: `${Math.min(100, resolvedPercent)}%` }}
            />
          </div>

          <div className={cn("mb-4 p-2 rounded-lg", styles.iconBg)}>
            <a
              href="https://www.buymeacoffee.com/yourusername" // Replace with actual Buy Me a Coffee link
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-80",
                styles.accent
              )}
            >
              <Coffee size={14} />
              Support the magic ☕
            </a>
          </div>

          {challengeLine && (
            <p
              className={cn(
                "text-sm font-semibold opacity-90",
                styles.text,
              )}
            >
              {challengeLine}
            </p>
          )}
        </div>
      </div>
    );
  },
);

ShareCard.displayName = "ShareCard";
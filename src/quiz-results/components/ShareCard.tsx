import { forwardRef } from "react";
import brandLogo from "@/assets/potterwiki-logo.png";
import type { ShareCardTheme } from "../types/result.types";
import { cn } from "@/lib/utils";

export interface ShareCardProps {
  theme: ShareCardTheme;
  headline: string;
  tagline: string;
  score: number;
  total: number;
  percent?: number;
  quizTitle?: string;
  quizUrl?: string;
  performanceLabel?: string;
  challengeLine?: string;
  /** Min % to count as passed; defaults to 60. */
  passMark?: number;
  className?: string;
}

const themeShell: Record<ShareCardTheme, string> = {
  light:
    "bg-gradient-to-b from-zinc-50 to-zinc-100 text-zinc-900 border-zinc-200/80 shadow-sm",
  dark: "bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white border-white/10",
  fun: "bg-gradient-to-br from-violet-600 via-fuchsia-600 to-amber-500 text-white border-white/20",
};

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard(
    {
      theme,
      headline,
      tagline,
      score,
      total,
      percent,
      quizTitle,
      quizUrl,
      performanceLabel,
      challengeLine,
      passMark: passMarkProp,
      className,
    },
    ref,
  ) {
    const passMark = Math.max(0, Math.min(100, passMarkProp ?? 60));
    const resolvedPercent =
      total > 0 ? percent ?? Math.round((score / total) * 100) : 0;
    const passLabel = resolvedPercent >= passMark ? "Passed" : "Keep practicing";

    return (
      <div
        ref={ref}
        className={cn(
          "relative mx-auto flex w-full max-w-[380px] flex-col justify-between overflow-hidden rounded-3xl border p-6 shadow-xl aspect-[9/16]",
          themeShell[theme],
          className,
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full blur-2xl",
            theme === "light"
              ? "bg-amber-300/30"
              : theme === "dark"
                ? "bg-violet-400/20"
                : "bg-fuchsia-300/25",
          )}
          aria-hidden
        />

        <div className="flex items-start justify-between gap-3">
          <div className="flex min-h-10 min-w-0 flex-1 shrink items-center pr-2">
            <img
              src={brandLogo}
              alt="Potterwiki"
              className="h-9 w-auto max-w-[min(100%,11rem)] object-contain object-left"
              draggable={false}
            />
          </div>
          <p
            className={cn(
              "text-right text-[10px] font-medium uppercase tracking-[0.18em] opacity-80",
              theme === "light" ? "text-zinc-600" : "text-white/80",
            )}
          >
            Quiz result
          </p>
        </div>

        <div
          className={cn(
            "mt-4 rounded-2xl border px-3 py-2.5",
            theme === "light" ? "border-zinc-300/70 bg-white/70" : "border-white/20 bg-white/10",
          )}
        >
          {quizUrl ? (
            <a
              href={quizUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[10px] font-medium uppercase tracking-[0.18em] opacity-80 underline-offset-2 hover:underline"
            >
              {quizTitle ?? "Harry Potter Quiz"}
            </a>
          ) : (
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] opacity-75">
              {quizTitle ?? "Harry Potter Quiz"}
            </p>
          )}
          <p
            className={cn(
              "mt-1 text-xs leading-relaxed",
              theme === "light" ? "text-zinc-700" : "text-white/90",
            )}
          >
            {challengeLine ?? "I scored high. Can you beat me?"}
          </p>
        </div>



        <div className="flex flex-1 flex-col justify-center">
          <p
            className={cn(
              "font-display text-xl font-bold leading-snug sm:text-2xl",
              theme === "fun" && "drop-shadow-sm",
            )}
          >
            {headline}
          </p>
          <p
            className={cn(
              "mt-3 text-sm leading-relaxed opacity-90",
              theme === "light" ? "text-zinc-700" : "text-white/90",
            )}
          >
            {tagline}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2  py-4">
          <div
            className={cn(
              "rounded-2xl border px-3 py-2",
              theme === "light" ? "border-zinc-300/70 bg-white/70" : "border-white/20 bg-white/10",
            )}
          >
            <p className="text-[9px] uppercase tracking-[0.2em] opacity-70">Accuracy</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{resolvedPercent}%</p>
          </div>
          <div
            className={cn(
              "rounded-2xl border px-3 py-2",
              theme === "light" ? "border-zinc-300/70 bg-white/70" : "border-white/20 bg-white/10",
            )}
          >
            <p className="text-[9px] uppercase tracking-[0.2em] opacity-70">Rank</p>
            <p className="mt-1 text-sm font-semibold">{performanceLabel ?? "Wizard"}</p>
          </div>
        </div>

        <div className="space-y-1 text-center">
          <p
            className={cn(
              "text-7xl leading-none font-bold tabular-nums tracking-tight font-display",
              theme === "fun" && "drop-shadow-md",
            )}
          >
            {score}
            <span
              className={cn(
                "text-3xl font-semibold opacity-80",
                theme === "light" ? "text-zinc-500" : "text-white/70",
              )}
            >
              /{total}
            </span>
          </p>
          <p
            className={cn(
              "text-xs font-medium uppercase tracking-widest opacity-75",
              theme === "light" ? "text-zinc-500" : "text-white/75",
            )}
          >
            Score
          </p>
        </div>

        <div
          className={cn(
            "mt-4 rounded-2xl border px-3 py-3",
            theme === "light" ? "border-zinc-300/70 bg-white/70" : "border-white/20 bg-white/10",
          )}
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] opacity-75">
              Progress
            </p>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                resolvedPercent >= passMark
                  ? theme === "light"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-emerald-400/20 text-emerald-200"
                  : theme === "light"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-amber-400/20 text-amber-200",
              )}
            >
              {passLabel}
            </span>
          </div>

          <div
            className={cn(
              "mt-2 h-2 w-full overflow-hidden rounded-full",
              theme === "light" ? "bg-zinc-300/70" : "bg-white/20",
            )}
          >
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                theme === "light" ? "bg-zinc-900" : "bg-white",
              )}
              style={{ width: `${Math.max(0, Math.min(100, resolvedPercent))}%` }}
            />
          </div>
          <p
            className={cn(
              "mt-2 text-[11px] leading-relaxed",
              theme === "light" ? "text-zinc-600" : "text-white/85",
            )}
          >
            {score} correct out of {total} questions.
          </p>
          <p
            className={cn(
              "mt-1 text-[10px] tabular-nums opacity-60",
              theme === "light" ? "text-zinc-600" : "text-white/75",
            )}
          >
            Pass mark: {passMark}%
          </p>
        </div>
      </div>
    );
  },
);

ShareCard.displayName = "ShareCard";

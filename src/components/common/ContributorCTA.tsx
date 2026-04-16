import { motion, useReducedMotion } from "framer-motion";
import { Instagram, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ContributorCTAProps {
  variant?: "default" | "compact" | "inline";
  className?: string;
}

const COPY = {
  title: "Be Part of the Magic 🪄",
  description:
    "Love Harry Potter as much as we do?\n\nYou can contribute your own questions, quizzes, and ideas to help grow this platform into something truly magical.\n\nLet’s build this together ⚡",
  cta: "✨ Contribute",
  helper: "DM your quiz ideas or questions directly 💬",
} as const;

const CONTRIBUTION_URL = "https://www.instagram.com/potterwiki_";

export function ContributorCTA({
  variant = "default",
  className,
}: ContributorCTAProps) {
  const prefersReducedMotion = useReducedMotion();

  const onContribute = () => {
    window.open(CONTRIBUTION_URL, "_blank");
  };

  if (variant === "inline") {
    return (
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cn("text-xs text-muted-foreground/80 font-body", className)}
      >
        <span>Want to contribute? Be part of the magic 🪄</span>{" "}
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-xs font-semibold text-accent underline underline-offset-4 decoration-accent/50 hover:decoration-accent"
          onClick={onContribute}
        >
          {COPY.cta}
        </Button>
      </motion.div>
    );
  }

  const isCompact = variant === "compact";

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-[1px]",
        className,
      )}
    >
      {/* Soft gradient border + glow */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            "linear-gradient(135deg, hsla(270, 66%, 35%, 0.55), hsla(43, 72%, 52%, 0.45))",
        }}
        aria-hidden
      />
      <div
        className="absolute -inset-8 blur-2xl opacity-30"
        style={{
          background:
            "radial-gradient(closest-side, hsla(270, 66%, 35%, 0.55), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative rounded-2xl bg-card/55 backdrop-blur-sm ring-1 ring-border/40">
        <div className={cn(isCompact ? "p-4" : "p-4 sm:p-5")}>
          <div
            className={cn(
              "flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:text-left",
              isCompact ? "sm:items-center" : "",
            )}
          >
            <div className="h-10 w-10 shrink-0 rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5" aria-hidden />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "font-display font-bold",
                  isCompact ? "text-base" : "text-base sm:text-lg",
                )}
              >
                {COPY?.title}
              </p>
              <p
                className={cn(
                  "mt-2 text-sm text-muted-foreground font-body leading-relaxed whitespace-normal sm:whitespace-pre-line",
                  isCompact ? "line-clamp-1 sm:line-clamp-2" : "",
                )}
              >
                {COPY?.description}
              </p>
            </div>
          </div>

          <div
            className={cn(
              "mt-3 flex items-center justify-center"
            )}
          >

            <motion.div
              whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
              className="w-full sm:w-auto"
            >
              <Button
                type="button"
                onClick={onContribute}
                className={cn(
                  "w-full sm:w-auto rounded-xl font-semibold text-white/95",
                  isCompact ? "h-10 px-4 text-sm" : "h-11 px-5 text-sm",
                  // Premium + subtle: dark gradient, thin ring, restrained glow
                  "bg-[linear-gradient(135deg,rgba(33,12,58,0.95),rgba(66,22,110,0.85),rgba(17,14,34,0.95))]",
                  "ring-1 ring-white/10 hover:ring-white/15",
                  "shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.35),0_0_26px_rgba(255,196,59,0.16)]",
                  "hover:brightness-[1.06] active:brightness-[0.98]",
                )}
              >
                <span className="flex w-full flex-wrap items-center justify-center gap-2 whitespace-normal text-center">
                  <span>{COPY?.cta}</span>
                  <Instagram className="h-4 w-4 text-white/85" aria-hidden />
                </span>
              </Button>
            </motion.div>
          </div>

          <p className="mt-2 text-center text-xs text-muted-foreground/70 font-body">
            {COPY?.helper}
          </p>
        </div>
      </div>
    </motion.div>
  );
}


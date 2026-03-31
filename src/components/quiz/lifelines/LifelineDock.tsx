import { motion } from "framer-motion";
import { BookOpen, Info, MousePointerClick, Sparkles } from "lucide-react";
import type { LifelineId, LifelineState } from "./lifelineTypes";
import { lifelineRegistry } from "./lifelineRegistry";
import LifelineIconButton from "./LifelineIconButton";
import type { QuizPluginsConfig } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface LifelineDockProps {
  quizLifelines: QuizPluginsConfig;
  lifelineStates: Record<LifelineId, LifelineState>;
  onActivate: (id: LifelineId) => void;
  disabled: boolean;
  /** Optional: which lifeline is currently "active" (e.g. showing effect) for glowing border */
  activeId?: LifelineId | null;
  label?: string | null;
  allowUsedActivation?: (id: LifelineId) => boolean;
}

export default function LifelineDock({
  quizLifelines,
  lifelineStates,
  onActivate,
  disabled,
  activeId = null,
  label = "Lifelines",
  allowUsedActivation,
}: LifelineDockProps) {
  // Only show lifelines that exist in registry and are not disabled by quiz config (enabled: false).
  const timerEnabled = !!quizLifelines?.timer?.enabled;
  const visibleLifelines = (Object.keys(lifelineRegistry) as LifelineId[])?.filter((id) => {
    const config = quizLifelines?.[id as keyof typeof quizLifelines];
    if (!config || typeof config !== "object" || !("enabled" in config)) return true;
    if (config?.enabled === false) return false;
    // Time Freeze is only shown when the quiz timer is also enabled (otherwise it has no effect).
    if (id === "freezeTime" && !timerEnabled) return false;
    return true;
  });

  if (visibleLifelines.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="w-full"
    >
      {/* Single compact row: label + info + icons (wraps on narrow screens) */}
      <div className="flex w-full min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5 rounded-lg border border-border/35 bg-background/70 px-2 py-1.5 shadow-sm backdrop-blur-sm sm:gap-x-3 sm:px-2.5 sm:py-1.5">
        {label ? (
          <div className="flex shrink-0 items-center gap-1">
            <span className="whitespace-nowrap text-[9px] font-body font-semibold uppercase tracking-[0.14em] text-muted-foreground/90 sm:text-[10px] sm:tracking-widest">
              {label}
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="What are lifelines?"
                  className="h-8 w-8 shrink-0 rounded-full border border-border/25 bg-muted/15 p-0 hover:bg-muted/30 active:bg-muted/40"
                >
                  <Info className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                side="bottom"
                sideOffset={6}
                className="w-[min(300px,calc(100vw-1.25rem))] overflow-hidden rounded-xl border-border/50 p-0 font-body shadow-xl"
              >
                <div className="border-b border-border/40 bg-gradient-to-br from-secondary/20 via-background to-background px-3.5 py-3 sm:px-4 sm:py-3.5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 shadow-inner">
                      <Sparkles className="h-4 w-4 text-accent" aria-hidden />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <p className="font-display text-sm font-semibold leading-tight text-foreground">Lifelines</p>
                      <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                        Optional boosts—single use each. Tap the <span className="text-foreground/90">i</span> anytime for this guide.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="max-h-[min(52vh,400px)] overflow-y-auto overscroll-contain px-3.5 py-3 sm:px-4">
                  <section className="space-y-1.5">
                    <h4 className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      <BookOpen className="h-3.5 w-3.5 shrink-0 text-accent/90" aria-hidden />
                      What they are
                    </h4>
                    <p className="text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                      Special powers that help on tough questions—hints, crowd polls, hiding wrong answers, extra tries, and more.
                      The small badge on each icon is how many uses you have left in this quiz.
                    </p>
                  </section>

                  <Separator className="my-3 bg-border/50" />

                  <section className="space-y-2">
                    <h4 className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      <MousePointerClick className="h-3.5 w-3.5 shrink-0 text-accent/90" aria-hidden />
                      How to use
                    </h4>
                    <ul className="space-y-2 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                      <li className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/80" aria-hidden />
                        <span>
                          Tap a lifeline <span className="font-medium text-foreground/90">before</span> you need it—often before you lock in an answer.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/80" aria-hidden />
                        <span>
                          {timerEnabled
                            ? "This quiz uses a timer—Time Freeze can buy you a few seconds when you’re thinking."
                            : "After you submit an answer, lifelines usually can’t be used for that question anymore."}
                        </span>
                      </li>
                    </ul>
                  </section>

                  <Separator className="my-3 bg-border/50" />

                  <section className="space-y-2">
                    <h4 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      In this quiz
                    </h4>
                    <ul className="space-y-2">
                      {visibleLifelines?.map((id: LifelineId) => {
                        const def = lifelineRegistry?.[id];
                        if (!def) return null;
                        return (
                          <li
                            key={id}
                            className="rounded-lg border border-border/40 bg-muted/25 px-2.5 py-2 transition-colors hover:bg-muted/35"
                          >
                            <p className="font-body text-xs font-semibold leading-snug text-foreground">{def.displayName}</p>
                            <p className="mt-1 line-clamp-3 text-[11px] leading-relaxed text-muted-foreground">{def.description}</p>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-1 sm:justify-start sm:gap-1.5">
          {visibleLifelines?.map((id) => {
            const def = lifelineRegistry?.[id];
            const state = lifelineStates?.[id];
            const usedCount = state?.usedCount ?? 0;
            const maxUsage = def?.maxUsagePerGame ?? 0;
            const remainingCount = Math.max(0, maxUsage - usedCount);
            return (
              <LifelineIconButton
                key={id}
                definition={def}
                used={state?.usedCount >= def?.maxUsagePerGame}
                disabled={disabled}
                allowUsedActivation={allowUsedActivation?.(id) ?? false}
                active={activeId === id}
                remainingCount={remainingCount}
                onActivate={() => onActivate(id as LifelineId)}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

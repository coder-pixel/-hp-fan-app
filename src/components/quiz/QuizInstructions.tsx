import { motion } from "framer-motion";
import { Map, MessageCircle, FlaskConical, Eye, Sparkles, Hourglass, Zap, Flame, BookOpen, Info } from "lucide-react";
import { lifelineRegistry } from "./lifelines/lifelineRegistry";
import type { LifelineId } from "./lifelines/lifelineTypes";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { AspectRatio } from "../ui/aspect-ratio";
import type { QuizPluginsConfig } from "@/types/quiz";
import { useMemo } from "react";

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Map: Map as React.FC<{ size?: number; className?: string }>,
  MessageCircle: MessageCircle as React.FC<{ size?: number; className?: string }>,
  FlaskConical: FlaskConical as React.FC<{ size?: number; className?: string }>,
  Eye: Eye as React.FC<{ size?: number; className?: string }>,
  Sparkles: Sparkles as React.FC<{ size?: number; className?: string }>,
  Hourglass: Hourglass as React.FC<{ size?: number; className?: string }>,
};

interface QuizInstructionsProps {
  totalQuestions: number;
  quizLifelines: QuizPluginsConfig;
  quizTitle?: string;
  quizImage?: string;
  onStart: () => void;
}

const QuizInstructions = ({
  totalQuestions,
  quizLifelines,
  quizTitle,
  quizImage,
  onStart,
}: QuizInstructionsProps) => {
  const visibleLifelines = useMemo(() => {
    const timerEnabled = !!quizLifelines?.timer?.enabled;
    return (Object.keys(lifelineRegistry) as LifelineId[]).filter((id) => {
      const config = quizLifelines?.[id as keyof typeof quizLifelines];
      if (!config || typeof config !== "object" || !("enabled" in config)) return true;
      if (config.enabled === false) return false;
      if (id === "freezeTime" && !timerEnabled) return false;
      return true;
    });
  }, [quizLifelines]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={[
        // Mobile: full-bleed feel — no card chrome (matches QuizCard play view)
        "w-full mx-auto overflow-hidden rounded-none border-0 bg-transparent shadow-none",
        "sm:glass-card sm:rounded-xl sm:overflow-hidden",
        // Large desktop: open layout
        "lg:bg-transparent lg:border-0 lg:shadow-none",
      ].join(" ")}
    >
      <div className="px-4 py-4 sm:p-6 sm:px-6 lg:p-0">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:items-start lg:gap-10">
          {/* Left: content — centered on mobile/tablet, left column on lg */}
          <div className="text-center lg:py-10 lg:text-left">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
              <p className="mb-2 text-xs font-body font-medium uppercase tracking-[0.25em] text-accent/70">
                {quizTitle ? "Quiz briefing" : "Wizard Quiz"}
              </p>
              <h1 className="font-display text-2xl font-bold leading-snug tracking-tight text-balance sm:text-3xl lg:text-4xl">
                {quizTitle ? (
                  <>
                    {quizTitle}
                    {/* <span className="text-gradient-gold">Instructions</span> */}
                  </>
                ) : (
                  <>
                    Wizard Quiz <span className="text-gradient-gold">Instructions</span>
                  </>
                )}
              </h1>
              <p className="mt-2 text-sm font-body text-muted-foreground">
                Quick overview before you begin.
              </p>
            </div>

            {/* Mobile/tablet image sits under title */}
            {quizImage ? (
              <div className="mx-auto mt-6 w-full max-w-2xl lg:hidden">
                <div className="overflow-hidden rounded-xl border border-border/40 bg-muted/10">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={quizImage}
                      alt={quizTitle ? `${quizTitle} cover` : "Quiz cover"}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </AspectRatio>
                </div>
                <p className="mt-2 text-center text-xs font-body text-muted-foreground/80 sm:hidden">
                  Tip: rotate for a wider view.
                </p>
              </div>
            ) : null}

            {/* Primary CTA (moved above) */}
            <div className="mx-auto mt-6 w-full max-w-2xl lg:mx-0 lg:max-w-[520px]">
              <Button onClick={onStart} className="w-full btn-primary-gold text-sm py-3.5 font-semibold">
                Start Quiz →
              </Button>
              <p className="mt-2 text-xs font-body text-muted-foreground/80 lg:text-left">
                Ready when you are. You can use lifelines during the quiz.
              </p>
            </div>

            {/* Rules moved to top */}
            <section className="mx-auto mt-6 w-full max-w-2xl sm:mt-8 lg:mx-0 lg:max-w-none">
              <h2 className="mb-3 flex items-center justify-center gap-2 font-display text-base font-semibold sm:text-lg lg:justify-start">
                <Zap size={18} className="text-accent" />
                Rules
              </h2>
              <ul className="mx-auto max-w-md space-y-1.5 text-left text-sm font-body text-muted-foreground lg:mx-0 lg:max-w-none">
                {visibleLifelines?.length > 0 ? (
                  <>
                    <li>
                      • Each lifeline can be used <span className="text-foreground font-medium">once</span> per quiz
                    </li>
                    <li>• Use them wisely — there are no second chances</li>
                  </>
                ) : null}
                <li>• Your final score will be shown at the end</li>
              </ul>
            </section>

            {/* Collapsible sections */}
            <section className="mx-auto mt-6 w-full max-w-2xl sm:mt-8 lg:mx-0 lg:max-w-none">
              <Accordion
                type="multiple"
                defaultValue={visibleLifelines?.length > 0 ? ["lifelines"] : []}
                className="w-full text-left"
              >
                {/* <AccordionItem value="how" className="border-border/30">
                  <AccordionTrigger className="font-display text-sm sm:text-base font-semibold hover:no-underline">
                    <span className="flex items-center gap-2">
                      <BookOpen size={18} className="text-accent" />
                      How the Quiz Works
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-1">
                    <ul className="space-y-2 text-sm font-body text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Zap size={14} className="text-accent mt-0.5 shrink-0" />
                        <span>
                          <span className="text-foreground font-medium">{totalQuestions} questions</span> — randomized each time
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Zap size={14} className="text-accent mt-0.5 shrink-0" />
                        <span>
                          Score <span className="text-foreground font-medium">+10 ⚡</span> for each correct answer
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Flame size={14} className="text-accent mt-0.5 shrink-0" />
                        <span>
                          Build a <span className="text-foreground font-medium">streak</span> by answering consecutively
                        </span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem> */}

                {visibleLifelines?.length > 0 ? (
                  <AccordionItem value="lifelines" className="border-border/30">
                    <AccordionTrigger className="justify-center gap-3 font-display text-sm font-semibold hover:no-underline sm:text-base lg:justify-between lg:gap-0">
                      <span className="flex items-center justify-center gap-2 lg:justify-start">
                        <FlaskConical size={18} className="text-secondary" />
                        Your Lifelines
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label="Lifelines info"
                              className="h-7 w-7 rounded-full border border-border/30 bg-muted/10 hover:bg-muted/25"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="end"
                            className="w-[240px] max-w-[85vw] p-3 font-body text-sm leading-relaxed"
                          >
                            Lifelines are single-use helpers. Use them when you're stuck, and keep an eye on
                            the timer while you decide.
                          </PopoverContent>
                        </Popover>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <p className="text-sm font-body text-muted-foreground">
                          Single-use powers to help you through tricky questions.
                        </p>


                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {visibleLifelines?.map((id) => {
                          const def = lifelineRegistry?.[id];
                          const Icon = iconMap[def?.icon] ?? Map;

                          if (!def) return null; // Timer is not a direct lifeline, will be shown in the quiz card as a timer.
                          return (
                            <div
                              key={id}
                              className="rounded-lg border border-border/30 bg-muted/15 p-3 transition-colors hover:bg-muted/25"
                            >
                              <div className="flex flex-col items-center text-center gap-2 sm:flex-row sm:items-start sm:text-left sm:gap-3">
                                <div className="w-9 h-9 rounded-md flex items-center justify-center bg-secondary/10 border border-secondary/20 shrink-0">
                                  <Icon size={16} className="text-accent" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold font-body text-foreground sm:truncate">
                                    {def?.displayName}
                                  </p>
                                  <p className="text-xs font-body text-muted-foreground leading-relaxed sm:line-clamp-2">
                                    {def?.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ) : null}
              </Accordion>
            </section>
          </div>

          {/* Right: large hero image (desktop) */}
          {quizImage ? (
            <div className="hidden lg:block lg:py-10">
              <div className="sticky top-28">
                <div className="overflow-hidden rounded-2xl border border-border/30 bg-muted/10">
                  <AspectRatio ratio={4 / 5}>
                    <img
                      src={quizImage}
                      alt={quizTitle ? `${quizTitle} cover` : "Quiz cover"}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </AspectRatio>
                </div>
                <p className="mt-3 text-xs font-body text-muted-foreground/80">
                  Pro tip: skim the rules, then jump in.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="h-2 sm:h-6" />
    </motion.div>
  );
};

export default QuizInstructions;

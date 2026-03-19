import { motion } from "framer-motion";
import { Map, MessageCircle, FlaskConical, Eye, Sparkles, Hourglass, Zap, Flame, BookOpen } from "lucide-react";
import { lifelineRegistry } from "./lifelines/lifelineRegistry";
import type { LifelineId } from "./lifelines/lifelineTypes";
import { Button } from "../ui/button";
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
  onStart: () => void;
}

const QuizInstructions = ({ totalQuestions, quizLifelines, onStart }: QuizInstructionsProps) => {
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
      className="glass-card p-6 sm:p-10 w-full mx-auto"
    >
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-center mb-2">
        Wizard Quiz <span className="text-gradient-gold">Instructions</span>
      </h1>
      <p className="text-center text-muted-foreground font-body text-sm mb-8">
        Read carefully before you begin your magical challenge.
      </p>

      <Button
        onClick={onStart}
        className="w-full btn-primary-gold text-sm py-3.5 font-semibold mb-8"
      >
        Start Quiz →
      </Button>

      {/* How it works */}
      <section className="mb-8">
        <h2 className="font-display text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-accent" />
          How the Quiz Works
        </h2>
        <ul className="space-y-2 text-sm font-body text-muted-foreground">
          <li className="flex items-start gap-2">
            <Zap size={14} className="text-accent mt-0.5 shrink-0" />
            <span><span className="text-foreground font-medium">{totalQuestions} questions</span> — randomized each time</span>
          </li>
          <li className="flex items-start gap-2">
            <Zap size={14} className="text-accent mt-0.5 shrink-0" />
            <span>Score <span className="text-foreground font-medium">+10 ⚡</span> for each correct answer</span>
          </li>
          <li className="flex items-start gap-2">
            <Flame size={14} className="text-accent mt-0.5 shrink-0" />
            <span>Build a <span className="text-foreground font-medium">streak</span> by answering consecutively</span>
          </li>
        </ul>
      </section>

      {/* Lifelines */}
      {visibleLifelines?.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
            <FlaskConical size={18} className="text-secondary" />
            Your Lifelines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* {console.log({ visibleLifelines })} */}
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
        </section>
      )}

      {/* Rules */}
      <section className="mb-8">
        <h2 className="font-display text-base sm:text-lg font-semibold mb-3">Rules</h2>
        <ul className="space-y-1.5 text-sm font-body text-muted-foreground">
          {visibleLifelines?.length > 0 &&
            <>
              <li>• Each lifeline can only be used <span className="text-foreground font-medium">once</span> per quiz</li>
              <li>• Use them wisely — there are no second chances</li>
            </>
          }
          <li>• Your final score will be shown at the end</li>
        </ul>
      </section>

      <Button
        onClick={onStart}
        className="w-full btn-primary-gold text-sm py-3.5 font-semibold"
      >
        Start Quiz →
      </Button>
    </motion.div>
  );
};

export default QuizInstructions;

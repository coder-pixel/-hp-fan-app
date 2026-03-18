import { motion } from "framer-motion";
import { Map, MessageCircle, FlaskConical, Eye, Zap, Flame, BookOpen } from "lucide-react";
import { lifelineRegistry } from "./lifelines/lifelineRegistry";
import { enabledLifelines } from "./lifelines/lifelineConfig";
import type { LifelineId } from "./lifelines/lifelineTypes";

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Map: Map as any,
  MessageCircle: MessageCircle as any,
  FlaskConical: FlaskConical as any,
  Eye: Eye as any,
};

interface QuizInstructionsProps {
  totalQuestions: number;
  onStart: () => void;
}

const QuizInstructions = ({ totalQuestions, onStart }: QuizInstructionsProps) => {
  const visibleLifelines = (Object.keys(lifelineRegistry) as LifelineId[]).filter(
    (id) => enabledLifelines[id]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 sm:p-10 w-full max-w-xl mx-auto"
    >
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-center mb-2">
        Wizard Quiz <span className="text-gradient-gold">Instructions</span>
      </h1>
      <p className="text-center text-muted-foreground font-body text-sm mb-8">
        Read carefully before you begin your magical challenge.
      </p>

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
      {visibleLifelines.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
            <FlaskConical size={18} className="text-secondary" />
            Your Lifelines
          </h2>
          <div className="grid gap-3">
            {visibleLifelines.map((id) => {
              const def = lifelineRegistry[id];
              const Icon = iconMap[def.icon] ?? Map;
              return (
                <div
                  key={id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/30"
                >
                  <div className="w-8 h-8 rounded-md flex items-center justify-center bg-secondary/10 border border-secondary/20 shrink-0">
                    <Icon size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold font-body text-foreground">{def.displayName}</p>
                    <p className="text-xs font-body text-muted-foreground leading-relaxed">{def.description}</p>
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
          <li>• Each lifeline can only be used <span className="text-foreground font-medium">once</span> per quiz</li>
          <li>• Use them wisely — there are no second chances</li>
          <li>• Your final score will be shown at the end</li>
        </ul>
      </section>

      <button
        onClick={onStart}
        className="w-full btn-primary-gold text-sm py-3.5 font-semibold"
      >
        Start Quiz →
      </button>
    </motion.div>
  );
};

export default QuizInstructions;

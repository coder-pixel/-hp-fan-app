import { motion, AnimatePresence } from "framer-motion";
import type { LifelineEffect } from "./lifelineTypes";

interface LifelineEffectsProps {
  effect: LifelineEffect | null;
  onDismiss: () => void;
}

const LifelineEffects = ({ effect, onDismiss }: LifelineEffectsProps) => {
  if (!effect) return null;

  if (effect.type === "askDumbledore" && effect.hint) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="glass-card p-4 mb-4 text-center border border-accent/20"
          style={{ boxShadow: "0 0 24px hsla(43, 72%, 52%, 0.15)" }}
        >
          <p className="text-[10px] uppercase tracking-widest text-accent/70 font-body mb-1.5">
            Dumbledore says…
          </p>
          <p className="text-sm font-body italic text-foreground/90 leading-relaxed">
            "{effect.hint}"
          </p>
          <button
            onClick={onDismiss}
            className="mt-3 text-[10px] text-muted-foreground hover:text-accent transition-colors font-body"
          >
            Dismiss
          </button>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (effect.type === "legilimency" && effect.pollResults) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="glass-card p-4 mb-4 border border-secondary/20"
          style={{ boxShadow: "0 0 24px hsla(270, 66%, 35%, 0.15)" }}
        >
          <p className="text-[10px] uppercase tracking-widest text-secondary font-body mb-3 text-center">
            Wizarding World Votes
          </p>
          <div className="flex flex-col gap-2">
            {effect.pollResults.map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="text-[11px] font-body text-muted-foreground w-24 text-right shrink-0">
                  {p.name}
                </span>
                <div className="flex-1 h-4 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.percent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: "var(--gradient-purple)" }}
                  />
                </div>
                <span className="text-[11px] font-body font-semibold text-foreground w-8">
                  {p.percent}%
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={onDismiss}
            className="mt-3 block mx-auto text-[10px] text-muted-foreground hover:text-accent transition-colors font-body"
          >
            Dismiss
          </button>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
};

export default LifelineEffects;

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

  // Legilimency (poll) is shown via PollModal when activated — not inline here.
  if (effect?.type === "legilimency") return null;

  return null;
};

export default LifelineEffects;

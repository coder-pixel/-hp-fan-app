import { motion } from "framer-motion";
import type { LifelineId, LifelineState } from "./lifelineTypes";
import { lifelineRegistry } from "./lifelineRegistry";
import { enabledLifelines } from "./lifelineConfig";
import LifelineIconButton from "./LifelineIconButton";

interface LifelineDockProps {
  lifelineStates: Record<LifelineId, LifelineState>;
  onActivate: (id: LifelineId) => void;
  disabled: boolean;
  /** Optional: which lifeline is currently "active" (e.g. showing effect) for glowing border */
  activeId?: LifelineId | null;
}

export default function LifelineDock({
  lifelineStates,
  onActivate,
  disabled,
  activeId = null,
}: LifelineDockProps) {
  const visibleLifelines = (Object.keys(lifelineRegistry) as LifelineId[]).filter(
    (id) => enabledLifelines[id]
  );

  if (visibleLifelines.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center mt-6"
    >
      <div
        className="flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-background/60 px-3 py-2 shadow-lg backdrop-blur-md"
        style={{
          boxShadow:
            "0 4px 24px -4px rgba(0,0,0,0.4), 0 0 0 1px hsla(270, 30%, 20%, 0.4)",
        }}
      >
        {visibleLifelines?.map((id) => {
          const def = lifelineRegistry?.[id];
          const state = lifelineStates?.[id];
          return (
            <LifelineIconButton
              key={id}
              definition={def}
              used={state?.usedCount >= def?.maxUsagePerGame}
              disabled={disabled}
              active={activeId === id}
              onActivate={() => onActivate(id)}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

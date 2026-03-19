import { motion } from "framer-motion";
import type { LifelineId, LifelineState } from "./lifelineTypes";
import { lifelineRegistry } from "./lifelineRegistry";
import LifelineIconButton from "./LifelineIconButton";
import type { QuizPluginsConfig } from "@/types/quiz";

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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-start"
    >
      {label && (
        <span className="mb-1 text-[10px] font-body font-medium tracking-widest uppercase text-muted-foreground/80">
          {label}
        </span>
      )}
      <div
        className="flex items-center justify-center gap-1.5 rounded-lg border border-border/40 bg-background/60 px-2 py-1.5 shadow-lg backdrop-blur-md"
        style={{
          boxShadow:
            "0 4px 24px -4px rgba(0,0,0,0.4), 0 0 0 1px hsla(270, 30%, 20%, 0.4)",
        }}
      >
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
    </motion.div>
  );
}

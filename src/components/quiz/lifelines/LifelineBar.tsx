import type { LifelineId, LifelineState } from "./lifelineTypes";
import { lifelineRegistry } from "./lifelineRegistry";
import { enabledLifelines } from "./lifelineConfig";
import LifelineButton from "./LifelineButton";

interface LifelineBarProps {
  lifelineStates: Record<LifelineId, LifelineState>;
  onActivate: (id: LifelineId) => void;
  disabled: boolean;
}

const LifelineBar = ({ lifelineStates, onActivate, disabled }: LifelineBarProps) => {
  const visibleLifelines = (Object.keys(lifelineRegistry) as LifelineId[]).filter(
    (id) => enabledLifelines[id]
  );

  if (visibleLifelines.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6 flex-wrap">
      {visibleLifelines.map((id) => {
        const def = lifelineRegistry[id];
        const state = lifelineStates[id];
        return (
          <LifelineButton
            key={id}
            definition={def}
            used={state.usedCount >= def.maxUsagePerGame}
            disabled={disabled}
            onActivate={() => onActivate(id)}
          />
        );
      })}
    </div>
  );
};

export default LifelineBar;

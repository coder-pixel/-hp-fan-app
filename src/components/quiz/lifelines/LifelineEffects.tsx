import type { LifelineEffect } from "./lifelineTypes";

interface LifelineEffectsProps {
  effect: LifelineEffect | null;
}

const LifelineEffects = ({ effect }: LifelineEffectsProps) => {
  if (!effect) return null;

  // These lifeline effects are now shown via dedicated popup modals.
  // Legilimency (poll) is shown via `PollModal` in `QuizPlayPage`.
  return null;
};

export default LifelineEffects;

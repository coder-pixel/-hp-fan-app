import type { LifelineDefinition, LifelineId } from "./lifelineTypes";

export const lifelineRegistry: Record<LifelineId, LifelineDefinition> = {
  maraudersMap: {
    id: "maraudersMap",
    displayName: "Marauder's Map",
    description: "Reveals suspicious options by highlighting the most likely answer — but it's not guaranteed.",
    icon: "Map",
    maxUsagePerGame: 1,
  },
  askDumbledore: {
    id: "askDumbledore",
    displayName: "Ask Dumbledore",
    description: "Dumbledore provides a cryptic hint about the correct answer.",
    icon: "MessageCircle",
    maxUsagePerGame: 1,
  },
  felixFelicis: {
    id: "felixFelicis",
    displayName: "Felix Felicis",
    description: "Drink the luck potion — your next answer is guaranteed correct.",
    icon: "FlaskConical",
    maxUsagePerGame: 1,
  },
  legilimency: {
    id: "legilimency",
    displayName: "Legilimency",
    description: "Read the minds of the wizarding world to see how others voted.",
    icon: "Eye",
    maxUsagePerGame: 1,
  },
  revelio: {
    id: "revelio",
    displayName: "Revelio",
    description: "Reveal hidden truth by removing two incorrect options.",
    icon: "Sparkles",
    maxUsagePerGame: 1,
  },
};

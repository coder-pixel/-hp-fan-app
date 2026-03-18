import type { LifelineId } from "./lifelineTypes";

/** Developer toggle — set to false to hide a lifeline from the UI */
export const enabledLifelines: Record<LifelineId, boolean> = {
  maraudersMap: true,
  askDumbledore: true,
  felixFelicis: true,
  legilimency: true,
  revelio: true,
};

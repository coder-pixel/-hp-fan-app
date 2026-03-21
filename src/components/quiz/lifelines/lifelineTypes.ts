export type LifelineId =
  | "maraudersMap"
  | "askDumbledore"
  | "felixFelicis"
  | "legilimency"
  | "revelio"
  | "freezeTime";

export interface LifelineDefinition {
  id: LifelineId;
  displayName: string;
  description: string;
  icon: string;
  maxUsagePerGame: number;
}

export interface LifelineState {
  id: LifelineId;
  usedCount: number;
  active: boolean;
}

export interface LifelineEffect {
  type: LifelineId;
  /** For maraudersMap: the highlighted option index */
  highlightIndex?: number;
  /** For askDumbledore: the hint text */
  hint?: string;
  /** For felixFelicis: guarantees next answer correct */
  felixActive?: boolean;
  /** For legilimency: fake poll results */
  pollResults?: { name: string; percent: number }[];
}

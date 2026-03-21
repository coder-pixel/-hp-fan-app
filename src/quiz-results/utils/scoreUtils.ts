import type { EmotionalBand, PerformanceBand } from "../types/result.types";

export function clampPercent(n: number): number {
  return Math.max(0, Math.min(100, n));
}

export function scoreToPercent(score: number, total: number): number {
  if (!total || total < 1) return 0;
  return clampPercent(Math.round((score / total) * 100));
}

export const DEFAULT_EMOTIONAL_BANDS: EmotionalBand[] = [
  { minPercent: 70, message: "Dumbledore would be proud 🧙‍♂️" },
  { minPercent: 40, message: "You're getting there 👀" },
  { minPercent: 0, message: "Even Filch expected more 😭" },
];

export function resolveEmotionalMessage(
  percent: number,
  bands?: EmotionalBand[],
): string {
  const list = bands?.length ? bands : DEFAULT_EMOTIONAL_BANDS;
  const sorted = [...list]?.sort((a, b) => b?.minPercent - a?.minPercent);
  const hit = sorted?.find((b) => percent >= b?.minPercent);
  return hit?.message ?? sorted?.[sorted?.length - 1]?.message ?? "";
}

export const DEFAULT_PERFORMANCE_BANDS: PerformanceBand[] = [
  { minPercent: 85, label: "Legend" },
  { minPercent: 55, label: "Wizard" },
  { minPercent: 0, label: "Beginner" },
];

export function resolvePerformanceLabel(
  percent: number,
  bands?: PerformanceBand[],
): string {
  const list = bands?.length ? bands : DEFAULT_PERFORMANCE_BANDS;
  const sorted = [...list]?.sort((a, b) => b?.minPercent - a?.minPercent);
  return sorted?.find((b) => percent >= b?.minPercent)?.label ?? "Beginner";
}

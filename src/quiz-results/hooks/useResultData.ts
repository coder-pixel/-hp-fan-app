import { useMemo } from "react";
import type { QuizResultsUiConfig, ResultData } from "../types/result.types";
import {
  resolveEmotionalMessage,
  resolvePerformanceLabel,
  scoreToPercent,
} from "../utils/scoreUtils";
import { buildViralShareLine } from "../utils/shareUtils";

export function useResultData(data: ResultData, config?: QuizResultsUiConfig) {
  return useMemo(() => {
    const percent = scoreToPercent(data?.score, data?.total);
    const viralLine = buildViralShareLine(
      data?.score,
      data?.total,
      config?.quizTitle,
    );
    const shareUrl = config?.shareUrl?.trim();
    const fullShareText = shareUrl ? `${viralLine}\n${shareUrl}` : viralLine;

    return {
      percent,
      emotionalMessage: resolveEmotionalMessage(
        percent,
        config?.emotionalBands,
      ),
      performanceLabel: resolvePerformanceLabel(
        percent,
        config?.performanceBands,
      ),
      viralLine,
      fullShareText,
    };
  }, [data, config]);
}

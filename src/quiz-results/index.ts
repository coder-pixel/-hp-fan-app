/**
 * Drop-in quiz results UI: results screen, review mode, and shareable card.
 * Feed {@link ResultData} from any source; no global quiz state required.
 */

export { ResultsPage } from "./pages/ResultsPage";
export { ReviewPage } from "./pages/ReviewPage";
export { ShareCardPage } from "./pages/ShareCardPage";
export type { ReviewFilter } from "./pages/ReviewPage";
export type { ShareCardPageProps } from "./pages/ShareCardPage";

export { ResultHeader } from "./components/ResultHeader";
export { ScoreVisualizer } from "./components/ScoreVisualizer";
export { PerformanceBadge } from "./components/PerformanceBadge";
export { ActionButtons } from "./components/ActionButtons";
export { ShareCard } from "./components/ShareCard";
export { AnswerItem } from "./components/AnswerItem";

export { useResultData } from "./hooks/useResultData";

export {
  scoreToPercent,
  resolveEmotionalMessage,
  resolvePerformanceLabel,
  clampPercent,
  DEFAULT_EMOTIONAL_BANDS,
  DEFAULT_PERFORMANCE_BANDS,
} from "./utils/scoreUtils";

export {
  buildViralShareLine,
  buildWhatsAppUrl,
  buildTwitterIntentUrl,
  buildFacebookSharerUrl,
  copyTextToClipboard,
  downloadNodeAsPng,
  shareNative,
} from "./utils/shareUtils";

export {
  mapHistoryToResultAnswers,
  type HistoryQuestionInput,
  type HistoryEntryInput,
} from "./utils/mapHistoryToResultAnswers";

export type {
  ResultAnswer,
  ResultData,
  ShareCardTheme,
  EmotionalBand,
  PerformanceBand,
  QuizResultsUiConfig,
  QuizSocialShareUiConfig,
} from "./types/result.types";

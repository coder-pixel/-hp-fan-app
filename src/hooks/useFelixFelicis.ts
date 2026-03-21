import { useEffect, useRef, useState } from "react";
import type { QuizQuestion } from "@/types/quiz";

/** Timing constants for Felix Felicis microcopy. */
const MICROCOPY_DURATION_MS = 1800;
const RETRY_MESSAGE_DELAY_MS = 100;

interface FelixState {
  felixActive: boolean;
  felixRetryPending: boolean;
  felixUsed: boolean;
  selectedAnswer: number | null;
  questionIndex: number;
}

interface UseFelixFelicisReturn {
  /** Transient text to show in the FelixMicrocopy overlay, or null when silent. */
  microcopy: string | null;
}

/**
 * Manages all Felix Felicis microcopy messages based on state transitions:
 *   • felixActive  activated        → "Luck is on your side…"
 *   • felixRetryPending triggered   → "Try again…"
 *   • felixUsed + correct answer    → "That was close… 🍀"
 *
 * Each message auto-dismisses after MICROCOPY_DURATION_MS.
 */
export function useFelixFelicis(
  state: FelixState,
  question: QuizQuestion | null,
): UseFelixFelicisReturn {
  const [microcopy, setMicrocopy] = useState<string | null>(null);

  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prevFelixActiveRef = useRef(false);
  const prevRetryPendingRef = useRef(false);
  const prevSelectedAnswerRef = useRef<number | null>(null);
  const prevQuestionIndexRef = useRef(state.questionIndex);

  const showMessage = (msg: string, duration = MICROCOPY_DURATION_MS) => {
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    setMicrocopy(msg);
    dismissTimerRef.current = setTimeout(() => setMicrocopy(null), duration);
  };

  // Reset all microcopy when the question changes.
  useEffect(() => {
    if (state.questionIndex !== prevQuestionIndexRef.current) {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      if (retryDelayRef.current) clearTimeout(retryDelayRef.current);
      setMicrocopy(null);
      prevFelixActiveRef.current = false;
      prevRetryPendingRef.current = false;
      prevSelectedAnswerRef.current = null;
      prevQuestionIndexRef.current = state.questionIndex;
    }
  }, [state.questionIndex]);

  // "Luck is on your side…" — when Felix first becomes active.
  useEffect(() => {
    if (state.felixActive && !prevFelixActiveRef.current) {
      showMessage("Luck is on your side…");
    }
    prevFelixActiveRef.current = state.felixActive;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.felixActive]);

  // "Try again…" — when the wrong-answer retry window opens.
  useEffect(() => {
    if (state.felixRetryPending && !prevRetryPendingRef.current) {
      // Small delay so the "wrong" red flash registers before the message appears.
      retryDelayRef.current = setTimeout(
        () => showMessage("Try again…"),
        RETRY_MESSAGE_DELAY_MS,
      );
    }
    prevRetryPendingRef.current = state.felixRetryPending;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.felixRetryPending]);

  // "That was close… 🍀" — when the player correctly answers after consuming the retry.
  useEffect(() => {
    const prevAnswer = prevSelectedAnswerRef.current;
    const currentAnswer = state.selectedAnswer;

    if (
      state.felixUsed &&
      currentAnswer !== null &&
      prevAnswer === null &&
      question &&
      currentAnswer === question.correctAnswer
    ) {
      showMessage("That was close… 🍀", 2200);
    }

    prevSelectedAnswerRef.current = currentAnswer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedAnswer]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      if (retryDelayRef.current) clearTimeout(retryDelayRef.current);
    };
  }, []);

  return { microcopy };
}

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import type { QuizContextValue, QuizActions, QuizState, QuizConfig } from "./engineTypes";
import { QuizEngine, createInitialState } from "./QuizEngine";
import { lifelinePlugin } from "./plugins/lifelinePlugin";
import { streakPlugin } from "./plugins/streakPlugin";
import { revelioPlugin } from "./plugins/revelioPlugin";
import { timerPlugin } from "./plugins/timerPlugin";
import { resolveQuizStrategy, DEFAULT_QUIZ_STRATEGY_ID } from "@/registry/strategyRegistry";

const QuizCtx = createContext<QuizContextValue | null>(null);

export const QuizProvider: React.FC<{ children: React.ReactNode; config?: QuizConfig }> = ({
  children,
  config,
}) => {
  const strategy = useMemo(
    () => resolveQuizStrategy(config?.strategyId ?? DEFAULT_QUIZ_STRATEGY_ID),
    [config?.strategyId],
  );

  const [state, setState] = useState<QuizState>(() =>
    createInitialState({
      ...config,
      strategyId: config?.strategyId ?? strategy.id,
    }),
  );

  const engineRef = useRef<QuizEngine | null>(null);

  if (!engineRef.current) {
    const engine = new QuizEngine(
      createInitialState({
        ...config,
        strategyId: config?.strategyId ?? strategy.id,
      }),
      setState,
      strategy,
    );
    engine.registerPlugin(streakPlugin);
    engine.registerPlugin(lifelinePlugin);
    engine.registerPlugin(revelioPlugin);
    engine.registerPlugin(timerPlugin);
    engineRef.current = engine;
  }

  useEffect(() => {
    if (engineRef.current) engineRef.current.state = state;
  }, [state]);

  useEffect(() => {
    engineRef.current?.setStrategy(strategy);
  }, [strategy]);

  useEffect(() => {
    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, []);

  const FELIX_RETRY_DELAY_MS = 800;

  const actions: QuizActions = useMemo(
    () => ({
      startQuiz: () => engineRef.current?.startQuiz(),
      answerQuestion: (idx: number) => {
        engineRef.current?.answerQuestion(idx);
        const afterState = engineRef.current?.state;
        if (afterState?.felixRetryPending) {
          setTimeout(() => engineRef.current?.retryQuestion(), FELIX_RETRY_DELAY_MS);
        }
      },
      advanceQuestion: () => engineRef.current?.advanceQuestion(),
      goToPreviousQuestion: () => engineRef.current?.goToPreviousQuestion(),
      goToNextQuestion: () => engineRef.current?.goToNextQuestion(),
      retryQuestion: () => engineRef.current?.retryQuestion(),
      useLifeline: (id) => engineRef.current?.useLifeline(id),
      dismissEffect: () => engineRef.current?.dismissEffect(),
      restartQuiz: () => {
        engineRef.current?.restart();
        setState(
          createInitialState({
            ...config,
            strategyId: config?.strategyId ?? strategy.id,
          }),
        );
      },
    }),
    [config, strategy.id],
  );

  const value = useMemo<QuizContextValue>(() => ({ state, actions }), [state, actions]);

  return <QuizCtx.Provider value={value}>{children}</QuizCtx.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizCtx);
  if (!ctx) throw new Error("useQuiz must be used within <QuizProvider>");
  return ctx;
}

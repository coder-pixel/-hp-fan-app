import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from "react";
import type { QuizContextValue, QuizActions, QuizState } from "./engineTypes";
import { QuizEngine, createInitialState } from "./QuizEngine";
import { lifelinePlugin } from "./plugins/lifelinePlugin";
import { streakPlugin } from "./plugins/streakPlugin";
import { revelioPlugin } from "./plugins/revelioPlugin";

const QuizCtx = createContext<QuizContextValue | null>(null);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<QuizState>(createInitialState);

  const engineRef = useRef<QuizEngine | null>(null);

  // Initialise engine once
  if (!engineRef.current) {
    const engine = new QuizEngine(createInitialState(), setState);
    engine.registerPlugin(streakPlugin);
    engine.registerPlugin(lifelinePlugin);
    engine.registerPlugin(revelioPlugin);
    engineRef.current = engine;
  }

  // Keep engine.state in sync with React state
  useEffect(() => {
    if (engineRef.current) engineRef.current.state = state;
  }, [state]);

  useEffect(() => {
    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, []);

  const actions: QuizActions = useMemo(() => ({
    startQuiz: () => engineRef.current?.startQuiz(),
    answerQuestion: (idx: number) => {
      engineRef.current?.answerQuestion(idx);
      // Schedule advance after animation delay
      setTimeout(() => engineRef.current?.advanceQuestion(), 1200);
    },
    advanceQuestion: () => engineRef.current?.advanceQuestion(),
    useLifeline: (id) => engineRef.current?.useLifeline(id),
    dismissEffect: () => engineRef.current?.dismissEffect(),
    restartQuiz: () => {
      engineRef.current?.restart();
      // After restart, re-sync initial state
      setState(createInitialState());
    },
  }), []);

  const value = useMemo<QuizContextValue>(() => ({ state, actions }), [state, actions]);

  return <QuizCtx.Provider value={value}>{children}</QuizCtx.Provider>;
};

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizCtx);
  if (!ctx) throw new Error("useQuiz must be used within <QuizProvider>");
  return ctx;
}

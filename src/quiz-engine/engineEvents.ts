import type { QuizEventName, QuizEventHandler } from "./engineTypes";

/**
 * Lightweight typed event emitter for the quiz engine.
 */
export class QuizEventBus {
  private listeners = new Map<string, Set<Function>>();

  on<E extends QuizEventName>(event: E, handler: QuizEventHandler<E>) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler);
  }

  off<E extends QuizEventName>(event: E, handler: QuizEventHandler<E>) {
    this.listeners.get(event)?.delete(handler);
  }

  emit<E extends QuizEventName>(event: E, payload: Parameters<QuizEventHandler<E>>[0]) {
    this.listeners.get(event)?.forEach((fn) => fn(payload));
  }

  clear() {
    this.listeners.clear();
  }
}

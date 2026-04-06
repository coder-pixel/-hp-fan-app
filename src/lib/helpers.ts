import type React from "react";

export type KeyDownHandler<T extends HTMLElement = HTMLElement> = (
  e: React.KeyboardEvent<T>,
) => void;

function isPrintableKey(e: React.KeyboardEvent): boolean {
  return e.key.length === 1;
}

export function createKeyDownAllowlist<T extends HTMLElement = HTMLElement>(
  allowedChar: RegExp,
): KeyDownHandler<T> {
  return (e) => {
    if (isPrintableKey(e) && !allowedChar.test(e.key)) {
      e.preventDefault();
    }
  };
}

// Common variants
export const blockNonAlphanumericSpaceKeyDown =
  createKeyDownAllowlist<HTMLInputElement>(/^[a-zA-Z0-9 ]$/);

export const blockNonAlphabetSpaceKeyDown =
  createKeyDownAllowlist<HTMLInputElement>(/^[a-zA-Z ]$/);

export const blockNonNumericKeyDown =
  createKeyDownAllowlist<HTMLInputElement>(/^[0-9]$/);

export const blockNonAlphanumericKeyDown =
  createKeyDownAllowlist<HTMLInputElement>(/^[a-zA-Z0-9]$/);

// Other commonly useful helpers
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export function safeTrim(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export async function fetchJsonWithTimeout<T>(
  input: RequestInfo | URL,
  init?: RequestInit & { timeoutMs?: number },
): Promise<T> {
  const timeoutMs = init?.timeoutMs ?? 8000;
  const controller = new AbortController();
  const id = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(input, {
      ...init,
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    return (await res.json()) as T;
  } finally {
    window.clearTimeout(id);
  }
}


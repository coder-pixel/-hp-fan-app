# Quiz platform migration guide

This app uses a **plugin-style quiz platform**: behavior is split into **`core`** (engine + plugins), **`quiz-types`** (strategies), **`themes`** (renderers), and **`registry`** (wiring without editing core files).

## Folder layout

| Path | Role |
|------|------|
| `src/core/quiz/` | `QuizEngine`, state types, event bus, timer/lifeline/streak/revelio plugins — **no React UI** |
| `src/quiz-types/<id>/` | Strategy: `evaluateAnswer`, `getNextQuestion`, `calculateResult` + optional validators |
| `src/themes/<id>/` | Theme renderer components (instructions, play shell, results wiring) |
| `src/registry/` | `resolveQuizStrategy`, `registerQuizStrategy`, `resolveQuizThemeRenderer`, `registerQuizTheme` |
| `src/hooks/useQuizEngine.ts` | `useQuiz()` + resolved `strategy` / `strategyId` / `themeId` |
| `src/configs/` | Curated quiz lists by franchise/category (re-exports from `src/data/quizzes/` today) |
| `src/quiz-engine/` | **Compatibility barrel** — re-exports `@/core/quiz` (keep existing imports working) |

## Adding a new quiz type (strategy)

1. Create `src/quiz-types/<your-type>/yourStrategy.ts` implementing `QuizStrategy` from `@/core/quiz/strategyTypes` (use `QuizQuestion` or a narrower type from `@/types/quiz` once extended).
2. At app startup (e.g. `main.tsx`), call `registerQuizStrategy(yourStrategy)` **or** add it to the map in `src/registry/strategyRegistry.ts` if you prefer static registration.
3. Set `strategyId` on the quiz config (`Quiz` in `@/types/quiz`) to match `yourStrategy.id`.
4. Ensure `QuizProvider` receives `config.strategyId` (see `QuizPlayPage`).

## Adding a new UI theme

1. Add `src/themes/<id>/YourThemeRenderer.tsx` — a component with props `QuizThemeRendererProps` (`{ quiz: Quiz }`) that renders inside an existing `<QuizProvider>` and calls `useQuiz()` / `useQuizEngine()`.
2. Call `registerQuizTheme("your-theme-id", YourThemeRenderer)` at startup **or** register in `src/registry/themeRegistry.ts`.
3. Set `themeId` on the quiz; the play page resolves the renderer with `resolveQuizThemeRenderer(quiz.themeId)`.

## Updating imports

- Prefer `@/core/quiz` for engine types and `QuizProvider` / `useQuiz`.
- `@/quiz-engine` remains valid and forwards to `@/core/quiz`.
- List pages can import quizzes from `@/configs` instead of `@/data/quizzes` (both stay in sync for HP data).

## Existing JSON-like quiz data

No change required: `Quiz` objects in `src/data/quizzes/*` remain the source of truth. Optional fields:

- `strategyId` — defaults to `multiple-choice` via registry.
- `themeId` — defaults to `harry-potter`.

The play page still normalizes raw multiple-choice rows with `toQuizQuestions()` (option `id` → engine index) before passing `questions` into the engine.

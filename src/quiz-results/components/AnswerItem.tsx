import { Check, X } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import type { ResultAnswer } from "../types/result.types";

export interface AnswerItemProps {
  value: string;
  answer: ResultAnswer;
  className?: string;
}

function isCorrectRow(a: ResultAnswer): boolean {
  return (
    !!a?.correctAnswer &&
    !!a?.userAnswer &&
    a?.userAnswer === a?.correctAnswer
  );
}

export function AnswerItem({ value, answer, className }: AnswerItemProps) {
  const ok = isCorrectRow(answer);

  return (
    <AccordionItem
      value={value}
      className={cn(
        "relative overflow-hidden rounded-2xl border transition-colors duration-200",
        ok
          ? "border-emerald-500/35 bg-emerald-950/15"
          : "border-red-500/35 bg-red-950/15",
        className,
      )}
    >

      {/* Uncomment if want to show question type in the top right corner, then have to hide the right/wrong text show below */}
      {/* {answer?.questionType ? (
        <span className="absolute right-3 top-3 z-10 inline-flex items-center rounded-full border border-border/50 bg-background/80 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground backdrop-blur-sm">
          {answer?.questionType.replace(/[-_]/g, " ")}
        </span>
      ) : null} */}


      <AccordionTrigger className="px-4 py-3.5 text-left hover:no-underline [&[data-state=open]]:border-b [&[data-state=open]]:border-border/40">
        <div className="flex w-full flex-col gap-2 pr-2 pt-5 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-0">
          <p className="font-body text-sm font-medium leading-snug text-foreground line-clamp-2">
            {answer?.question}
          </p>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
              ok
                ? "bg-emerald-500/20 text-emerald-200"
                : "bg-red-500/20 text-red-200",
            )}
          >
            {ok ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden />
                Correct
              </>
            ) : (
              <>
                <X className="h-3.5 w-3.5" aria-hidden />
                Wrong
              </>
            )}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4">
        <div className="space-y-3 rounded-xl bg-background/40 p-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400/90">
              Correct answer
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{answer?.correctAnswer}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Your answer
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{answer?.userAnswer}</p>
          </div>
          {answer?.explanation ? (
            <div className="border-t border-border/40 pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-accent/90">
                Explanation
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {answer?.explanation}
              </p>
            </div>
          ) : null}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

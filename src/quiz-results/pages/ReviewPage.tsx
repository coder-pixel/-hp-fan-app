import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnswerItem } from "../components/AnswerItem";
import type { ResultAnswer, ResultData } from "../types/result.types";

export type ReviewFilter = "all" | "wrong";

export interface ReviewPageProps {
  data: ResultData;
  onBack: () => void;
  className?: string;
}

function rowCorrect(a: ResultAnswer): boolean {
  return !!a?.correctAnswer && a?.userAnswer === a?.correctAnswer;
}

export function ReviewPage({ data, onBack, className }: ReviewPageProps) {
  const [filter, setFilter] = useState<ReviewFilter>("all");

  const wrongCount = useMemo(
    () => data?.answers?.filter((a) => !rowCorrect(a))?.length,
    [data?.answers],
  );

  const visible = useMemo(() => {
    const rows = data?.answers?.map((answer, index) => ({ answer, index }));
    if (filter === "wrong") return rows?.filter(({ answer }) => !rowCorrect(answer));
    return rows;
  }, [data?.answers, filter]);

  console.log({ data, visible })

  return (
    <div className={cn("w-full max-w-xl mx-auto", className)}>
      <header className="sticky top-0 z-20 -mx-1 mb-4 border-b border-border/50 bg-background/85 px-1 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl"
            onClick={onBack}
            aria-label="Back to results"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-lg font-semibold leading-tight sm:text-xl">
              Review answers 111
            </h2>
            <p className="text-xs text-muted-foreground font-body">
              {data?.score}/{data?.total} correct · {wrongCount} to improve
            </p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Button
            type="button"
            size="sm"
            variant={filter === "all" ? "secondary" : "ghost"}
            className="min-h-10 flex-1 rounded-xl"
            onClick={() => setFilter("all")}
          >
            All ({data?.answers?.length})
          </Button>
          <Button
            type="button"
            size="sm"
            variant={filter === "wrong" ? "secondary" : "ghost"}
            className="min-h-10 flex-1 rounded-xl"
            onClick={() => setFilter("wrong")}
          >
            Wrong only ({wrongCount})
          </Button>
        </div>
      </header>

      {visible?.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-border/60 bg-card/50 p-8 text-center text-sm text-muted-foreground"
        >
          Nothing here — you didn&apos;t miss any in this filter.
        </motion.p>
      ) : (
        <Accordion type="multiple" className="space-y-3 pb-8">
          {visible?.map(({ answer, index }) => (
            <AnswerItem key={index} value={`q-${index}`} answer={answer} />
          ))}
        </Accordion>
      )}
    </div>
  );
}

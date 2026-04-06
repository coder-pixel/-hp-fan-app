import { motion } from "framer-motion";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MagicalParticles from "@/components/quiz/MagicalParticles";
import { quizzes } from "@/data/quizzes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginationControl } from "@/components/common/PaginationControl";
import { Quiz, QuizDifficulty } from "@/types/quiz";

const difficultyLabel: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

const badgeClassByDifficulty: Record<string, string> = {
  easy: "bg-green-500/20 text-green-700 border-green-500/30 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700/40",
  medium: "bg-accent/15 text-accent border-accent/25",
  hard: "bg-red-500/20 text-red-700 border-red-500/30 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700/40",
};

const PAGE_SIZE = 10;

const QuizzesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = searchParams.get("page") ?? "1";
  const page = Math.max(1, Number.parseInt(pageParam, 10) || 1);

  const categoryParam = (searchParams.get("category") ?? "all").trim();
  const qParam = searchParams.get("q") ?? "";

  const [search, setSearch] = useState(qParam);
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    // Keep input in sync when navigating back/forward.
    setSearch(qParam);
  }, [qParam]);

  // Derive categories from data for scalability.
  const categories = useMemo(() => {
    const set = new Set<string>();
    quizzes?.forEach((q) => {
      const c = (q?.category ?? "").trim();
      if (c) set.add(c);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  const normalizedQuery = deferredSearch.trim().toLowerCase();
  const normalizedCategory = categoryParam.toLowerCase();

  const filtered = useMemo(() => {
    return (quizzes ?? [])?.filter((q) => {
      const title = (q?.title ?? "")?.toLowerCase();
      const category = (q?.category ?? "")?.toLowerCase();
      const matchesCategory =
        normalizedCategory === "all" ? true : category === normalizedCategory;
      const matchesQuery =
        !normalizedQuery
          ? true
          : title?.includes(normalizedQuery) || category?.includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [normalizedCategory, normalizedQuery]);

  const pageCount = Math.max(1, Math.ceil(filtered?.length / PAGE_SIZE));

  useEffect(() => {
    // Clamp page if filters reduce total pages.
    if (page > pageCount) {
      const next = new URLSearchParams(searchParams);
      next.set("page", String(pageCount));
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageCount]);

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered?.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // Debounce writing `q` to the URL for a smooth UX.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      const q = search?.trim();
      if (q) next.set("q", q);
      else next.delete("q");
      next.set("page", "1"); // reset pagination on search
      setSearchParams(next, { replace: true });
    }, 250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const setCategory = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== "all") next.set("category", value);
    else next.delete("category");
    next.set("page", "1");
    setSearchParams(next, { replace: true });
  };

  const setPage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    setSearch("");
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    next.delete("category");
    next.set("page", "1");
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="relative flex-1 pt-28 pb-24 px-4">
        <MagicalParticles />

        <div className="relative z-10 mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="block text-xs font-body font-medium tracking-widest uppercase text-accent/70 mb-3">
              Challenge Yourself
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
              All <span className="text-gradient-gold">Quizzes</span>
            </h1>
            <p className="text-muted-foreground font-body text-sm sm:text-base">
              Pick a quiz and test your wizarding knowledge.
            </p>
          </motion.div>

          <div className="glass-card p-4 sm:p-5 mb-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search quizzes by title or category…"
                    className="pl-9"
                    aria-label="Search quizzes"
                  />
                  {search.trim() ? (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-[180px] sm:w-[220px]">
                  <Select
                    value={categoryParam === "all" ? "all" : categoryParam}
                    onValueChange={setCategory}
                  >
                    <SelectTrigger aria-label="Filter by category">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                  className="shrink-0"
                  disabled={!searchParams.get("q") && !searchParams.get("category")}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {paged?.map((quiz) => {
              const diffKey = quiz?.difficulty;
              const diffText =
                difficultyLabel[diffKey] ?? quiz?.difficulty?.toString?.() ?? "—";

              return <QuizCard key={quiz?.id} quiz={quiz} diffKey={diffKey} diffText={diffText} />;
            })}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-10 text-center">
              <p className="text-sm text-muted-foreground font-body">
                No quizzes match your filters. Try a different search or reset.
              </p>
            </div>
          ) : null}

          <div className="mt-10">
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Showing <span className="text-foreground font-medium">{paged.length}</span> of{" "}
                <span className="text-foreground font-medium">{filtered.length}</span>
              </span>
              <span>
                Page <span className="text-foreground font-medium">{Math.min(page, pageCount)}</span> /{" "}
                <span className="text-foreground font-medium">{pageCount}</span>
              </span>
            </div>

            <PaginationControl page={Math.min(page, pageCount)} pageCount={pageCount} onPageChange={setPage} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizzesPage;



export const QuizCard = ({ quiz, diffKey, diffText }: { quiz: Quiz; diffKey: QuizDifficulty; diffText: string }) => {
  return (
    <motion.div
      key={quiz.id}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glass-card-hover p-7 flex flex-col gap-5"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          {/* <Badge
            variant="outline"
            className={badgeClassByDifficulty?.[diffKey] ?? ""}
          >
            {diffText}
          </Badge> */}
          <span className="text-[11px] text-muted-foreground font-body">
            {quiz?.questions?.length} questions
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-display text-lg font-semibold leading-snug">
            {quiz?.title}
          </h3>
          <p className="text-sm text-muted-foreground font-body">
            Category: {quiz?.category}
          </p>
        </div>

        {/* This is just listing for now; wire to a play route when ready. */}
        <Button asChild className="mt-auto">
          <Link to={`/quiz/${quiz?.id}`}>Play</Link>
        </Button>
      </div>
    </motion.div>
  );
};
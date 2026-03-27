import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, BookOpen, Trash2, BookmarkX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useBookmarks } from "@/hooks/user-module/useBookmarks";

type Tab = "questions" | "quizzes";

const SavedPage = () => {
  const { savedQuestions, savedQuizzes, removeQuestion, removeQuiz } = useBookmarks();
  const [tab, setTab] = useState<Tab>("questions");

  const EmptyState = ({ label }: { label: string }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center space-y-3">
      <BookmarkX className="w-10 h-10 mx-auto text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground">No saved {label} yet</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl space-y-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              <span className="text-gradient-gold">Saved</span> Items
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Your bookmarked questions & quizzes</p>
          </motion.div>

          {/* Tab switcher */}
          <div className="flex gap-1 bg-muted/20 rounded-xl p-1 w-fit">
            {([
              { key: "questions" as Tab, icon: BookOpen, label: "Questions" },
              { key: "quizzes" as Tab, icon: Bookmark, label: "Quizzes" },
            ]).map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg font-medium transition-colors ${tab === key
                  ? "bg-accent/20 text-accent"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "questions" ? (
              <motion.div key="questions" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className="space-y-2">
                {savedQuestions?.length === 0 ? (
                  <EmptyState label="questions" />
                ) : (
                  savedQuestions?.map((q, i) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.04 }}
                      className="glass-card rounded-xl p-4 flex items-start gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{q?.question}</p>
                        <p className="text-xs text-success mt-1">✓ {q?.correctAnswer}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{q?.quizTitle}</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeQuestion(q?.id)}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))
                )}
              </motion.div>
            ) : (
              <motion.div key="quizzes" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-2">
                {savedQuizzes?.length === 0 ? (
                  <EmptyState label="quizzes" />
                ) : (
                  savedQuizzes?.map((q, i) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.04 }}
                      className="glass-card rounded-xl p-4 flex items-center gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{q?.title}</p>
                        <p className="text-xs text-muted-foreground">{q?.questionCount} questions</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeQuiz(q?.id)}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SavedPage;

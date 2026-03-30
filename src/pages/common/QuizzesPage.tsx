import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MagicalParticles from "@/components/quiz/MagicalParticles";
import { quizzes } from "@/configs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const difficultyLabel: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

const badgeClassByDifficulty: Record<string, string> = {
  easy: "bg-green-900/40 text-green-300 border-green-700/40",
  medium: "bg-accent/15 text-accent border-accent/25",
  hard: "bg-red-900/40 text-red-300 border-red-700/40",
};

const QuizzesPage = () => {
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {quizzes?.map((quiz) => {
              const diffKey = quiz?.difficulty;
              const diffText =
                difficultyLabel[diffKey] ?? quiz?.difficulty?.toString?.() ?? "—";

              return (
                <motion.div
                  key={quiz.id}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="glass-card-hover p-7 flex flex-col gap-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Badge
                      variant="outline"
                      className={badgeClassByDifficulty?.[diffKey] ?? ""}
                    >
                      {diffText}
                    </Badge>
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
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizzesPage;


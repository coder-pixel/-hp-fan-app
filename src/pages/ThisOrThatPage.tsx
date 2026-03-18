import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChoiceCard from "@/components/thisOrThat/ChoiceCard";
import ResultBars from "@/components/thisOrThat/ResultBars";
import { thisOrThatQuestions } from "@/data/thisOrThatQuestions";
import { ArrowRight, Shuffle } from "lucide-react";

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const ThisOrThatPage = () => {
  const [questions, setQuestions] = useState(() => shuffle(thisOrThatQuestions));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<"A" | "B" | null>(null);

  const current = useMemo(() => questions[currentIndex], [questions, currentIndex]);

  const totalVotes = current.votesA + current.votesB + (selected ? 1 : 0);
  const pctA = Math.round(((current.votesA + (selected === "A" ? 1 : 0)) / totalVotes) * 100);
  const pctB = 100 - pctA;

  const handleSelect = useCallback(
    (choice: "A" | "B") => {
      if (selected) return;
      setSelected(choice);
    },
    [selected]
  );

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setQuestions(shuffle(thisOrThatQuestions));
      setCurrentIndex(0);
    } else {
      setCurrentIndex((i) => i + 1);
    }
    setSelected(null);
  };

  const handleRandom = () => {
    setQuestions(shuffle(thisOrThatQuestions));
    setCurrentIndex(0);
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-24 px-4">
        <div className="container mx-auto max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="block text-xs font-body font-medium tracking-widest uppercase text-accent/70 mb-3">
              Wizarding Choices
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
              This or <span className="text-gradient-gold">That</span>
            </h1>
            <p className="text-muted-foreground font-body text-sm sm:text-base">
              Choose your wizarding world preference.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-7 sm:p-9"
            >
              <p className="text-[11px] text-muted-foreground font-body text-center mb-1.5 tracking-wide">
                {currentIndex + 1} / {questions.length}
              </p>
              <h3 className="font-display text-lg sm:text-xl font-semibold text-center mb-8">
                {current.question}
              </h3>

              <div className="flex gap-4">
                <ChoiceCard
                  label={current.optionA}
                  emoji={current.emojiA}
                  selected={selected === "A"}
                  disabled={selected !== null && selected !== "A"}
                  onClick={() => handleSelect("A")}
                />
                <ChoiceCard
                  label={current.optionB}
                  emoji={current.emojiB}
                  selected={selected === "B"}
                  disabled={selected !== null && selected !== "B"}
                  onClick={() => handleSelect("B")}
                />
              </div>

              {selected && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <ResultBars
                    labelA={current.optionA}
                    labelB={current.optionB}
                    percentA={pctA}
                    percentB={pctB}
                  />
                </motion.div>
              )}

              <div className="flex justify-center gap-3 mt-8">
                <button
                  onClick={handleRandom}
                  className="flex items-center gap-2 btn-secondary-outline text-sm px-5 py-2.5"
                >
                  <Shuffle size={14} />
                  Random
                </button>
                {selected && (
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={handleNext}
                    className="flex items-center gap-2 btn-primary-gold text-sm px-6 py-2.5"
                  >
                    Next <ArrowRight size={14} />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThisOrThatPage;

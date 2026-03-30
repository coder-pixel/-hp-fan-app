import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import QuizCard from "@/components/home/QuizCard";
import FunFacts from "@/components/home/FunFacts";
import CTASection from "@/components/home/CTASection";
import { quizzes } from "@/configs";
import type { Quiz } from "@/types/quiz";
import { QuizDifficulty } from "@/types/quiz";

const TOP_QUIZ_COUNT = 3;

const difficultyLabel: Record<QuizDifficulty, "Easy" | "Medium" | "Hard"> = {
  [QuizDifficulty.EASY]: "Easy",
  [QuizDifficulty.MEDIUM]: "Medium",
  [QuizDifficulty.HARD]: "Hard",
};

function quizHomeDescription(quiz: Quiz): string {
  const line =
    quiz.shareCardConfig?.tagline ??
    quiz.shareCardConfig?.headline;
  if (line) return line;
  return `${quiz.category} — ${quiz.questions.length} questions.`;
}

const featuredQuizzes = quizzes.slice(0, TOP_QUIZ_COUNT);

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      {/* Quizzes */}
      <motion.section
        id="quizzes"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="py-24 px-4"
      >
        <div className="container mx-auto max-w-5xl">
          <span className="block text-xs font-body font-medium tracking-widest uppercase text-accent/70 text-center mb-3">
            Challenge Yourself
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-14">
            Popular <span className="text-gradient-gold">Quizzes</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {featuredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quizId={quiz.id}
                title={quiz.title}
                description={quizHomeDescription(quiz)}
                questionCount={quiz.questions.length}
                difficulty={difficultyLabel[quiz.difficulty] ?? "Medium"}
              />
            ))}
          </div>
          <p className="text-center mt-10">
            <Link
              to="/quizzes"
              className="text-sm font-body text-accent hover:text-accent/90 underline-offset-4 hover:underline"
            >
              View all quizzes
            </Link>
          </p>
        </div>
      </motion.section>

      <div className="section-divider max-w-xs mx-auto" />

      {/* Fun Facts */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="py-24 px-4"
      >
        <div className="container mx-auto max-w-5xl">
          <FunFacts />
        </div>
      </motion.section>

      {/* CTA */}
      <CTASection />

      <Footer />
    </div>
  );
};

export default HomePage;

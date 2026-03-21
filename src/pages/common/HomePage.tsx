import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import QuizCard from "@/components/home/QuizCard";
import PollCard from "@/components/home/PollCard";
import FunFacts from "@/components/home/FunFacts";
import CTASection from "@/components/home/CTASection";

const quizzes = [
  {
    title: "Which Hogwarts House Are You?",
    description: "Answer personality questions to discover your true Hogwarts house. The Sorting Hat awaits.",
    questionCount: 12,
    difficulty: "Easy" as const,
  },
  {
    title: "Ultimate Harry Potter Trivia",
    description: "Test your knowledge across all seven books and eight films. Only true fans survive.",
    questionCount: 20,
    difficulty: "Hard" as const,
  },
  {
    title: "How Well Do You Know Snape?",
    description: "Explore the complex life of Severus Snape — hero, villain, or something in between?",
    questionCount: 15,
    difficulty: "Medium" as const,
  },
];

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
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.title} {...quiz} />
            ))}
          </div>
        </div>
      </motion.section>

      <div className="section-divider max-w-xs mx-auto" />

      {/* Poll */}
      <motion.section
        id="polls"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="py-24 px-4"
      >
        <div className="container mx-auto max-w-5xl">
          <PollCard />
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

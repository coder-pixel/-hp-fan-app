import { motion } from "framer-motion";
import { BookOpen, Gamepad2, Sparkles, Swords } from "lucide-react";
import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MagicalParticles from "@/components/quiz/MagicalParticles";
import { SupportCTA } from "@/components/common/SupportCTA";
import { FeedbackForm } from "@/components/common/FeedbackForm";
import { ContributorCTA } from "@/components/common/ContributorCTA";

const COPY = {
  hero: {
    title: "A Magical Experience for Potterheads 🪄",
    subtitle: "More than just quizzes — a journey through the wizarding world.",
  },
  why: {
    heading: "Why This Exists",
    body:
      "This platform was built out of a deep love for the Harry Potter universe and a desire to create something fun, interactive, and meaningful for fellow fans.\n\nFrom simple quizzes to immersive experiences, the goal is to make you feel like you're actually part of the wizarding world — not just answering questions, but living the journey.",
  },
  special: {
    heading: "What Makes It Special",
    points: [
      {
        title: "Interactive by design",
        description: "Interactive, game-like quiz experience",
        icon: Gamepad2,
      },
      {
        title: "Carefully crafted",
        description: "Thoughtfully crafted questions (not just basic trivia)",
        icon: BookOpen,
      },
      {
        title: "Strategy + lifelines",
        description: "Lifelines, strategy, and engagement",
        icon: Swords,
      },
      {
        title: "Built for fans",
        description: "Designed for real Potterheads",
        icon: Sparkles,
      },
    ],
  },
  future: {
    heading: "What’s Coming Next",
    body:
      "This is just the beginning.\n\nThe vision is to evolve this into a complete magical experience — with progression systems, challenges, leaderboards, and much more.\n\nA place where Potterheads can not only test their knowledge but also connect, compete, and relive the magic together.",
  },
  creator: {
    heading: "A Note from the Creator",
    body:
      "This project is driven by my love for Harry Potter and creating fun experiences for the community 🪄  \nYour support helps me keep improving and building more magical moments ☕",
  },
} as const;

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl sm:text-3xl font-bold">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Paragraph({ text }: { text: string }) {
  return (
    <p className="text-muted-foreground font-body text-sm sm:text-base leading-relaxed whitespace-pre-line">
      {text}
    </p>
  );
}

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="relative flex-1 pt-28 pb-24 px-4">
        <MagicalParticles />

        <div className="relative z-10 mx-auto max-w-4xl space-y-12">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="text-center space-y-4"
          >
            <span className="block text-xs font-body font-medium tracking-widest uppercase text-accent/70">
              Our story
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold">
              <span className="text-gradient-gold drop-shadow-[0_8px_22px_rgba(255,196,59,0.12)]">
                {COPY?.hero?.title}
              </span>
            </h1>
            <p className="text-muted-foreground font-body text-sm sm:text-lg max-w-2xl mx-auto">
              {COPY?.hero?.subtitle}
            </p>
          </motion.div>

          <div className="glass-card p-6 sm:p-8 space-y-10">
            {/* Why */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Section title={COPY?.why?.heading}>
                <Paragraph text={COPY?.why?.body} />
              </Section>
            </motion.div>

            <div className="section-divider max-w-xs mx-auto" />

            {/* Special */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Section title={COPY?.special?.heading}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-1">
                  {COPY?.special?.points?.map((p) => {
                    const Icon = p?.icon;
                    return (
                      <div
                        key={p?.title ?? ""}
                        className="glass-card-hover p-5 rounded-2xl ring-1 ring-transparent hover:ring-accent/15 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center ring-1 ring-accent/15">
                            <Icon className="h-5 w-5" aria-hidden />
                          </div>
                          <div className="space-y-1">
                            <p className="font-display font-semibold text-base leading-snug">
                              {p?.description ?? ""}
                            </p>
                            <p className="text-sm text-muted-foreground font-body">
                              {p?.title ?? ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Section>
            </motion.div>

            <div className="section-divider max-w-xs mx-auto" />

            {/* Future */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Section title={COPY?.future?.heading}>
                <Paragraph text={COPY?.future?.body} />
              </Section>
            </motion.div>



            <div className="section-divider max-w-xs mx-auto" />

            {/* Creator note + Support */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <Section title={COPY?.creator?.heading}>
                <Paragraph text={COPY?.creator?.body} />
              </Section>

              <SupportCTA variant="subtle" />

              <ContributorCTA variant="default" className="mt-6" />
            </motion.div>

            <div className="section-divider max-w-xs mx-auto" />

            {/* Contact / Feedback */}
            <FeedbackForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;

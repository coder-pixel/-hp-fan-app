import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const facts = [
  "Dumbledore's full name is Albus Percival Wulfric Brian Dumbledore — over 10 words when you include his titles.",
  "The first Harry Potter book was rejected 12 times before Bloomsbury finally published it.",
  "Nearly Headless Nick required 45 swings of the axe, and still didn't get his head fully chopped off.",
  "Voldemort cannot love because he was conceived under a love potion.",
  "J.K. Rowling and Harry Potter share the same birthday: July 31st.",
  "The Hogwarts motto 'Draco Dormiens Nunquam Titillandus' means 'Never Tickle a Sleeping Dragon.'",
  "Dementors are based on J.K. Rowling's experience with depression.",
  "Fred and George Weasley were born on April 1st — April Fools' Day.",
];

const FunFacts = () => {
  const [index, setIndex] = useState(0);

  const generate = () => {
    let next: number;
    do {
      next = Math.floor(Math.random() * facts.length);
    } while (next === index && facts.length > 1);
    setIndex(next);
  };

  return (
    <div className="glass-card p-8 sm:p-10 max-w-lg mx-auto text-center relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(43 72% 52%), transparent)" }} />

      <span className="inline-block text-xs font-body font-medium tracking-widest uppercase text-accent/70 mb-4">
        Wizarding Lore
      </span>
      <h3 className="font-display text-xl sm:text-2xl font-semibold mb-8">Random Wizarding Fact</h3>

      <div className="min-h-[120px] flex items-center justify-center mb-8 px-2">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.45 }}
            className="text-foreground/85 font-body leading-relaxed text-sm sm:text-base"
          >
            {facts[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      <button
        onClick={generate}
        className="inline-flex items-center gap-2 btn-secondary-outline text-sm px-6 py-2.5"
      >
        <Sparkles size={15} className="animate-sparkle text-accent" />
        Generate New Fact
      </button>
    </div>
  );
};

export default FunFacts;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-28 px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse, hsl(43 72% 52%), transparent)" }} />

      <div className="section-divider mb-20 max-w-md mx-auto" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl mx-auto text-center relative z-10"
      >
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-5">
          Think you are a true{" "}
          <span className="text-gradient-gold">Potterhead</span>?
        </h2>
        <p className="text-muted-foreground font-body mb-10 text-base sm:text-lg leading-relaxed">
          Only 10% of fans can score 10/10 on the ultimate Harry Potter quiz.
        </p>
        <Link to="/quizzes" className="btn-primary-gold text-lg px-12 py-4 inline-block">
          Start the Ultimate Quiz
        </Link>
      </motion.div>
    </section>
  );
};

export default CTASection;

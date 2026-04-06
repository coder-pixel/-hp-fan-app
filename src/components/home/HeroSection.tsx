import { motion } from "framer-motion";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const Particle = ({ delay, left, size, opacity }: { delay: number; left: string; size: number; opacity: number }) => (
  <div
    className="absolute rounded-full animate-particle-float"
    style={{
      left,
      width: size,
      height: size,
      animationDelay: `${delay}s`,
      animationDuration: `${6 + Math.random() * 6}s`,
      background: `radial-gradient(circle, hsla(43, 72%, 52%, ${opacity}) 0%, transparent 70%)`,
      boxShadow: `0 0 ${size * 2}px hsla(43, 72%, 52%, ${opacity * 0.5})`,
    }}
  />
);

const HeroSection = () => {
  // used to generate the particles in the background
  const particles = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        delay: Math.random() * 8,
        left: `${Math.random() * 100}%`,
        size: 2 + Math.random() * 5,
        opacity: 0.2 + Math.random() * 0.4,
      })),
    []
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(270 66% 35%), transparent)" }} />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(43 72% 52%), transparent)" }} />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles?.map((p) => (
          <Particle key={p?.id} {...p} />
        ))}
      </div>

      {/* Radial overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(var(--obsidian))_80%)]" />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <span className="inline-block text-xs sm:text-sm font-body font-medium tracking-[0.3em] uppercase text-accent/80 mb-6">
            ⚡ The Wizarding Challenge ⚡
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8"
        >
          How Powerful Is Your{" "}
          <span className="text-gradient-gold">Harry Potter</span>{" "}
          Knowledge?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-muted-foreground text-base sm:text-lg md:text-xl mb-12 max-w-2xl mx-auto font-body leading-relaxed"
        >
          Take magical quizzes and discover hidden secrets of the wizarding world.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/quizzes" className="btn-primary-gold text-base">
            Take a Quiz
          </Link>
          {/* <a href="#quizzes" className="btn-secondary-outline text-base">
            Featured quizzes
          </a> */}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;

import { useMemo } from "react";

const MagicalParticles = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 3 + Math.random() * 5,
        delay: Math.random() * 10,
        duration: 6 + Math.random() * 6,
        opacity: 0.35 + Math.random() * 0.35,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-particle-float will-change-transform"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            background: `radial-gradient(circle, hsla(43, 72%, 52%, ${p.opacity}) 0%, hsla(43, 72%, 52%, ${p.opacity * 0.3}) 50%, transparent 70%)`,
            boxShadow: `0 0 ${p.size * 4}px hsla(43, 72%, 52%, ${p.opacity * 0.6}), 0 0 ${p.size * 8}px hsla(43, 72%, 52%, ${p.opacity * 0.2})`,
          }}
        />
      ))}
    </div>
  );
};

export default MagicalParticles;

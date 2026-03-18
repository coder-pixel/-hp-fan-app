import { useState } from "react";
import { motion } from "framer-motion";

interface PollOption {
  label: string;
  votes: number;
}

const initialOptions: PollOption[] = [
  { label: "Lupin", votes: 42 },
  { label: "Snape", votes: 28 },
  { label: "Moody", votes: 18 },
  { label: "McGonagall", votes: 12 },
];

const PollCard = () => {
  const [options, setOptions] = useState(initialOptions);
  const [selected, setSelected] = useState<string | null>(null);

  const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);

  const handleVote = (label: string) => {
    if (selected) return;
    setSelected(label);
    setOptions((prev) =>
      prev.map((o) => (o.label === label ? { ...o, votes: o.votes + 1 } : o))
    );
  };

  return (
    <div className="glass-card p-8 sm:p-10 max-w-lg mx-auto relative overflow-hidden">
      {/* Decorative corner glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(270 66% 35%), transparent)" }} />

      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-body font-medium tracking-widest uppercase text-accent/70">Daily Poll</span>
      </div>
      <h3 className="font-display text-xl sm:text-2xl font-semibold mb-2">Daily Wizard Poll</h3>
      <p className="text-muted-foreground text-sm mb-8 font-body">
        Who is the best Defense Against the Dark Arts teacher?
      </p>

      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const pct = Math.round((option.votes / (totalVotes + (selected ? 1 : 0))) * 100) || 0;
          const isSelected = selected === option.label;

          return (
            <button
              key={option.label}
              onClick={() => handleVote(option.label)}
              className={`relative overflow-hidden rounded-lg border text-left px-5 py-3.5 transition-all duration-300 ${
                isSelected
                  ? "border-accent/60 bg-accent/10 glow-gold"
                  : selected
                  ? "border-border/50 bg-muted/10 cursor-default"
                  : "border-border/60 hover:border-secondary/50 hover:bg-secondary/5 cursor-pointer"
              }`}
            >
              {selected && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 rounded-lg"
                  style={{ background: isSelected
                    ? "linear-gradient(90deg, hsla(43, 72%, 52%, 0.12), hsla(43, 72%, 52%, 0.05))"
                    : "linear-gradient(90deg, hsla(270, 66%, 35%, 0.1), transparent)"
                  }}
                />
              )}
              <div className="relative flex items-center justify-between">
                <span className="text-sm font-medium font-body">{option.label}</span>
                {selected && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xs text-muted-foreground font-body font-semibold"
                  >
                    {pct}%
                  </motion.span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-muted-foreground mt-5 text-center font-body"
        >
          ✨ {totalVotes + 1} votes cast
        </motion.p>
      )}
    </div>
  );
};

export default PollCard;

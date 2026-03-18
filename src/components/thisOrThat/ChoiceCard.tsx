import { motion } from "framer-motion";

interface ChoiceCardProps {
  label: string;
  emoji: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}

const ChoiceCard = ({ label, emoji, selected, disabled, onClick }: ChoiceCardProps) => {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.04 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 flex flex-col items-center justify-center gap-4 p-7 sm:p-9 rounded-xl border transition-all duration-400 min-h-[160px] ${
        selected
          ? "border-accent/60 bg-accent/10 glow-gold-strong"
          : disabled
          ? "border-border/30 bg-muted/10 cursor-default opacity-60"
          : "border-border/50 hover:border-secondary/50 cursor-pointer glass-card"
      }`}
    >
      <motion.span
        className="text-4xl sm:text-5xl"
        animate={selected ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        {emoji}
      </motion.span>
      <span className="font-display text-sm sm:text-base font-semibold">{label}</span>
    </motion.button>
  );
};

export default ChoiceCard;

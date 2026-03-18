import { motion } from "framer-motion";

interface ResultBarsProps {
  labelA: string;
  labelB: string;
  percentA: number;
  percentB: number;
}

const ResultBars = ({ labelA, labelB, percentA, percentB }: ResultBarsProps) => {
  return (
    <div className="flex flex-col gap-4 w-full mt-8">
      <div>
        <div className="flex justify-between text-xs font-body mb-1.5">
          <span className="text-foreground font-medium">{labelA}</span>
          <span className="text-accent font-semibold">{percentA}%</span>
        </div>
        <div className="w-full h-2.5 bg-muted/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--gradient-gold)" }}
            initial={{ width: 0 }}
            animate={{ width: `${percentA}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs font-body mb-1.5">
          <span className="text-foreground font-medium">{labelB}</span>
          <span className="text-secondary-foreground font-semibold">{percentB}%</span>
        </div>
        <div className="w-full h-2.5 bg-muted/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--gradient-purple)" }}
            initial={{ width: 0 }}
            animate={{ width: `${percentB}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground text-center font-body mt-1 tracking-wide">
        ✨ Wizard Community Choice
      </p>
    </div>
  );
};

export default ResultBars;

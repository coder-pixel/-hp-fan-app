import { motion, AnimatePresence } from "framer-motion";

interface FloatingScoreProps {
  show: boolean;
  triggerKey: number;
}

const FloatingScore = ({ show, triggerKey }: FloatingScoreProps) => (
  <AnimatePresence>
    {show && (
      <motion.div
        key={triggerKey}
        initial={{ opacity: 1, y: 0, scale: 0.8 }}
        animate={{ opacity: 0, y: -60, scale: 1.2 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none font-display font-bold text-lg text-gradient-gold whitespace-nowrap"
      >
        +10 ⚡
      </motion.div>
    )}
  </AnimatePresence>
);

export default FloatingScore;

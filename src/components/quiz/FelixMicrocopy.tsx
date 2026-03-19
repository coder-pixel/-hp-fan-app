import { AnimatePresence, motion } from "framer-motion";

interface FelixMicrocopyProps {
  message: string | null;
}

/**
 * Lightweight, pointer-events-none overlay that shows a single transient
 * message (e.g. "Luck is on your side…") and fades in/out automatically.
 * Controlled externally — the parent decides what message to show and when
 * to clear it (or use the useFelixFelicis hook which manages timing).
 */
const FelixMicrocopy = ({ message }: FelixMicrocopyProps) => (
  <AnimatePresence>
    {message && (
      <motion.div
        key={message}
        initial={{ opacity: 0, y: -10, scale: 0.93 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.96 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="pointer-events-none absolute left-1/2 top-2 z-50 -translate-x-1/2"
        aria-live="polite"
      >
        <span
          className="inline-block rounded-full border border-amber-400/30 bg-amber-950/70 px-4 py-1.5 text-xs font-body font-semibold tracking-wide text-amber-300 backdrop-blur-sm"
          style={{ textShadow: "0 0 12px hsla(38, 92%, 50%, 0.5)" }}
        >
          {message}
        </span>
      </motion.div>
    )}
  </AnimatePresence>
);

export default FelixMicrocopy;

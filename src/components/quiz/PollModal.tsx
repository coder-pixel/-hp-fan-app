import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface PollResultItem {
  name: string;
  percent: number;
}

interface PollModalProps {
  open: boolean;
  onClose: () => void;
  pollResults: PollResultItem[];
}

export default function PollModal({ open, onClose, pollResults }: PollModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="border-border/50 bg-card text-card-foreground max-w-md gap-0 overflow-hidden p-0 sm:rounded-lg"
        style={{ boxShadow: "0 0 32px hsla(270, 66%, 35%, 0.2)" }}
        onPointerDownOutside={onClose}
        onEscapeKeyDown={onClose}
      >
        <DialogHeader className="p-5 pb-3 text-center sm:text-left">
          <DialogTitle className="font-display text-lg font-semibold tracking-wide">
            Wizarding World Votes
          </DialogTitle>
        </DialogHeader>
        <div className="px-5 pb-5">
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {pollResults.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.25 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-24 shrink-0 text-right text-[11px] font-body text-muted-foreground">
                    {p.name}
                  </span>
                  <div className="flex-1 h-5 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p?.percent}%` }}
                      transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 + i * 0.05 }}
                      className="h-full rounded-full"
                      style={{ background: "var(--gradient-purple)" }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-[11px] font-body font-semibold text-foreground">
                    {p.percent}%
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="mt-4 w-full border-border/50 font-body text-xs"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

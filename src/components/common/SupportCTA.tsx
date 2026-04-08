import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface SupportCTAProps {
  variant?: "subtle";
  className?: string;
}

const PAYPAL_URL = "https://paypal.me/sauvik27";

export function SupportCTA({ variant = "subtle", className }: SupportCTAProps) {
  const isSubtle = variant === "subtle";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn("w-full", className)}
    >
      <motion.div
        animate={isSubtle ? { scale: [1, 1.01, 1] } : undefined}
        transition={
          isSubtle
            ? {
                duration: 1.6,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 10,
              }
            : undefined
        }
        className="relative"
      >
        <div className="rounded-xl p-[1px] bg-gradient-to-r from-amber-400/25 via-accent/25 to-purple-500/25">
          <div className="rounded-xl border border-border/50 bg-card/35 backdrop-blur-md p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="font-display text-base sm:text-lg font-semibold">
                  Keep the magic growing
                </p>
                <p className="text-sm text-muted-foreground font-body">
                  If this brought you joy, you can support the next chapters.
                </p>
              </div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.open(PAYPAL_URL, "_blank")}
                  className={cn(
                    "rounded-full border-border/60 bg-background/30 hover:bg-background/45",
                    "shadow-sm hover:shadow-md transition-all",
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden>☕</span>
                    <span>Support the Magic</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden />
                  </span>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

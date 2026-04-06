import { motion } from "framer-motion";
import { Coffee, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface SupportCTAProps {
  variant?: "default" | "compact";
  className?: string;
}

export function SupportCTA({ variant = "default", className }: SupportCTAProps) {
  const isCompact = variant === "compact";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn("w-full", className)}
    >
      <motion.div
        animate={{ scale: [1, 1.01, 1] }}
        transition={{
          duration: 2.2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 8.5,
        }}
        className="relative"
      >
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-secondary/50 via-accent/35 to-purple-500/30 blur-[10px] opacity-60" />

        <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-secondary/50 via-accent/35 to-purple-500/30">
          <div className={cn("rounded-2xl glass-card", isCompact ? "p-4" : "p-5")}>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" aria-hidden />
                <p className="font-display text-sm sm:text-base font-semibold text-gradient-gold">
                  Support the Magic 🪄
                </p>
              </div>

              <p
                className={cn(
                  "text-muted-foreground font-body",
                  isCompact ? "text-xs leading-relaxed" : "text-sm leading-relaxed",
                )}
              >
                This project is driven by my love for Harry Potter and creating fun experiences for the community 🪄
                <br />
                Your support helps me keep improving and building more magical moments ☕
              </p>

              <TooltipProvider delayDuration={250}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      onClick={() => window.open("https://paypal.me/sauvik27", "_blank")}
                      className={cn(
                        "rounded-full px-5 py-2.5 font-semibold shadow-md transition-all",
                        "bg-gradient-to-r from-accent to-amber-500 text-accent-foreground",
                        "hover:brightness-[1.03] hover:shadow-lg hover:scale-105",
                        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        isCompact ? "text-sm" : "text-sm sm:text-base",
                      )}
                    >
                      <Coffee className="h-4 w-4" aria-hidden />
                      ☕ Buy Me a Coffee
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-card/90 border-border/60 text-foreground backdrop-blur-md"
                  >
                    Every contribution helps 💛
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

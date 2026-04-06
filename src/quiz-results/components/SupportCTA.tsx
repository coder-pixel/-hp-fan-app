import { motion } from "framer-motion";
import { Coffee, ExternalLink, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface SupportCTAProps {
  variant?: "default" | "compact";
  className?: string;
}

export function SupportCTA({ variant = "default", className }: SupportCTAProps) {
  const isCompact = variant === "compact";
  const paypalUrl = "https://paypal.me/sauvik27";

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
        <TooltipProvider delayDuration={250}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Dialog>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.04, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex w-full justify-center"
                  >
                    <Button
                      type="button"
                      className={cn(
                        "group relative overflow-hidden rounded-full px-6 py-3 font-semibold shadow-md transition-all",
                        "bg-gradient-to-r from-accent to-amber-500 text-accent-foreground",
                        "hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        isCompact ? "text-sm" : "text-sm sm:text-base",
                      )}
                    >
                      <span className="absolute inset-0 opacity-40 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700 ease-out" />
                      <span className="relative inline-flex items-center gap-2">
                        <Coffee className="h-4 w-4" aria-hidden />
                        Buy me a coffee
                        <Sparkles className="h-4 w-4 text-white/90" aria-hidden />
                      </span>
                    </Button>
                  </motion.div>
                </DialogTrigger>

                <DialogContent className="p-0 border-0 bg-transparent shadow-none w-[92vw] max-w-lg sm:w-full">
                  <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-secondary/55 via-accent/35 to-purple-500/35">
                    <div className={cn("rounded-2xl glass-card", isCompact ? "p-5" : "p-6")}>
                      <DialogHeader className="text-center sm:text-center">
                        <DialogTitle className="font-display text-xl sm:text-2xl text-gradient-gold">
                          Support the Magic 🪄
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                          A support modal with a PayPal link
                        </DialogDescription>
                      </DialogHeader>

                      <div className="mt-4 space-y-4 text-center">
                        <p className={cn("text-muted-foreground font-body", isCompact ? "text-sm" : "text-sm leading-relaxed")}>
                          This project is driven by my love for Harry Potter and creating fun experiences for the community 🪄
                          <br />
                          {/* Your support helps me keep improving and building more magical moments ☕ */}
                        </p>

                        <div className="mx-auto max-w-md rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-4 text-left">
                          <p className="text-sm font-medium text-foreground">
                            What your donation helps with
                          </p>
                          <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc pl-5">
                            <li>Keeping the wizarding experience live, reliable, and online</li>
                            <li>Analytics & monitoring to keep things stable</li>
                            <li>Design, assets, and ongoing improvements</li>
                            <li>Time spent maintaining, fixing bugs, and adding new quizzes</li>
                          </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
                          {/* <Button
                            type="button"
                            onClick={() => window.open(paypalUrl, "_blank")}
                            className={cn(
                              "rounded-full px-6 py-3 font-semibold shadow-md transition-all",
                              "bg-gradient-to-r from-accent to-amber-500 text-accent-foreground",
                              "hover:brightness-[1.03] hover:shadow-lg hover:scale-105",
                            )}
                          >
                            <Coffee className="h-4 w-4" aria-hidden />
                            Buy me a coffee
                          </Button> */}

                          <Button
                            type="button"
                            onClick={() => window.open(paypalUrl, "_blank")}
                            className={cn(
                              "rounded-full px-6 py-3 font-semibold shadow-md transition-all flex items-center gap-2",
                              "bg-gradient-to-r from-accent via-yellow-400 to-amber-500 text-accent-foreground",
                              "hover:brightness-[1.07] hover:shadow-lg hover:scale-105 border-0"
                            )}
                          >
                            <ExternalLink className="h-4 w-4 text-amber-900 drop-shadow-[0_1px_3px_rgba(255,196,59,0.39)]" aria-hidden />
                            <span className="font-semibold">Open PayPal link</span>
                          </Button>
                        </div>

                        {/* <p className="text-xs text-muted-foreground">
                          Prefer a simple link?{" "}
                          <button
                            type="button"
                            className="font-medium text-accent underline underline-offset-4 decoration-accent/50 hover:decoration-accent"
                            onClick={() => window.open(paypalUrl, "_blank")}
                          >
                            Support here
                          </button>
                          .
                        </p> */}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </TooltipTrigger>

            <TooltipContent side="top" className="bg-card/90 border-border/60 text-foreground backdrop-blur-md">
              Every contribution helps 💛
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>
    </motion.div>
  );
}

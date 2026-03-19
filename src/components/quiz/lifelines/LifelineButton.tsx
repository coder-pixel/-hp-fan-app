import { Map, MessageCircle, FlaskConical, Eye, Sparkles, Snowflake, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import type { LifelineDefinition } from "./lifelineTypes";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const iconMap: Record<string, LucideIcon> = {
  Map,
  MessageCircle,
  FlaskConical,
  Eye,
  Sparkles,
  Snowflake,
};

interface LifelineButtonProps {
  definition: LifelineDefinition;
  used: boolean;
  disabled: boolean;
  onActivate: () => void;
}

const LifelineButton = ({ definition, used, disabled, onActivate }: LifelineButtonProps) => {
  const Icon = iconMap[definition.icon] ?? Map;
  const isDisabled = used || disabled;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          whileHover={isDisabled ? {} : { scale: 1.08 }}
          whileTap={isDisabled ? {} : { scale: 0.95 }}
          onClick={() => !isDisabled && onActivate()}
          disabled={isDisabled}
          className={`
            relative flex flex-col items-center gap-1 px-2.5 py-2 rounded-lg border text-[10px] sm:text-xs font-body font-medium transition-all duration-300 min-w-[68px] sm:min-w-[80px]
            ${
              used
                ? "border-border/20 bg-muted/20 text-muted-foreground/40 cursor-not-allowed"
                : isDisabled
                ? "border-border/30 bg-muted/30 text-muted-foreground/50 cursor-not-allowed"
                : "border-secondary/30 bg-secondary/5 text-foreground hover:border-accent/50 hover:bg-accent/5 cursor-pointer"
            }
          `}
          style={
            !isDisabled
              ? { boxShadow: "0 0 12px hsla(270, 66%, 35%, 0.15)" }
              : {}
          }
        >
          {!isDisabled && (
            <span
              className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ boxShadow: "inset 0 0 20px hsla(43, 72%, 52%, 0.1), 0 0 20px hsla(270, 66%, 35%, 0.2)" }}
            />
          )}
          <Icon size={16} className={used ? "opacity-30" : "text-accent"} />
          <span className="leading-tight text-center whitespace-nowrap">
            {definition.displayName.split(" ").slice(0, 2).join(" ")}
          </span>
          {used && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] text-muted-foreground/60 font-semibold uppercase tracking-wider">Used</span>
            </span>
          )}
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[200px] text-xs">
        <p className="font-semibold font-display text-xs mb-1">{definition.displayName}</p>
        <p className="text-muted-foreground">{definition.description}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default LifelineButton;

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  suffix?: string;
  delay?: number;
}

const StatCard = ({ icon: Icon, label, value, suffix = "", delay = 0 }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="glass-card rounded-xl p-4 flex flex-col items-center gap-2 text-center"
  >
    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
      <Icon className="w-5 h-5 text-accent" />
    </div>
    <p className="text-2xl font-bold font-display text-foreground">
      {value}{suffix}
    </p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </motion.div>
);

export default StatCard;

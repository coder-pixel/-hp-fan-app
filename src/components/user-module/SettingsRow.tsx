import { Switch } from "@/components/ui/switch";
import { LucideIcon } from "lucide-react";

interface SettingsRowProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}

const SettingsRow = ({ icon: Icon, label, description, checked, onCheckedChange }: SettingsRowProps) => (
  <div className="flex items-center gap-4 px-4 py-4">
    <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4 text-muted-foreground" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground">{label}</p>
      {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
    </div>
    <Switch checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);

export default SettingsRow;

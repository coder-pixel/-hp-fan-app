import { motion } from "framer-motion";
import { Moon, Volume2, Bell, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SettingsRow from "@/components/user-module/SettingsRow";
import { useUser } from "@/hooks/user-module/useUser";

const SettingsPage = () => {
  const { settings, updateSettings, logout } = useUser();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-lg space-y-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-accent" />
              <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Customize your experience</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl overflow-hidden divide-y divide-border/30"
          >
            <SettingsRow
              icon={Moon}
              label="Dark Mode"
              description="Embrace the darkness"
              checked={settings?.darkMode || false}
              onCheckedChange={(v) => updateSettings({ darkMode: v })}
            />
            <SettingsRow
              icon={Volume2}
              label="Sound Effects"
              description="Magical audio feedback"
              checked={settings?.soundEnabled || false}
              onCheckedChange={(v) => updateSettings({ soundEnabled: v })}
            />
            <SettingsRow
              icon={Bell}
              label="Notifications"
              description="Owl post alerts"
              checked={settings?.notifications || false}
              onCheckedChange={(v) => updateSettings({ notifications: v })}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="outline"
              onClick={logout}
              className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SettingsPage;

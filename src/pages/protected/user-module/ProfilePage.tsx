import { useState } from "react";
import { motion } from "framer-motion";
import { User, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useUser } from "@/hooks/user-module/useUser";

const ProfilePage = () => {
  const { profile, updateProfile, isLoggedIn, login, logout } = useUser();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile?.name || "");

  const handleSave = () => {
    updateProfile({ name: draft });
    setEditing(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-8 w-full max-w-sm text-center space-y-6"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
              <User className="w-8 h-8 text-accent" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">Welcome, Wizard</h2>
            <p className="text-sm text-muted-foreground">Sign in to track your magical journey.</p>
            <div className="space-y-3">
              <Input placeholder="Your wizard name" className="bg-muted/30 border-border" />
              <Input placeholder="Owl-mail address" type="email" className="bg-muted/30 border-border" />
              <Button onClick={login} className="w-full btn-primary-gold">
                Enter the Great Hall
              </Button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-lg space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 text-center space-y-4"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-secondary/30 border-2 border-accent/30 flex items-center justify-center text-2xl font-display font-bold text-accent">
              {profile?.name?.charAt(0)}
            </div>

            {editing ? (
              <div className="flex items-center gap-2 justify-center">
                <Input
                  value={draft || ""}
                  onChange={(e) => setDraft(e.target.value)}
                  className="max-w-[200px] bg-muted/30 border-border text-center"
                  autoFocus
                />
                <Button size="icon" variant="ghost" onClick={handleSave}>
                  <Check className="w-4 h-4 text-success" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => { setEditing(false); setDraft(profile?.name || ""); }}>
                  <X className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center">
                <h1 className="font-display text-xl font-bold text-foreground">{profile?.name}</h1>
                <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-accent transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            )}

            <p className="text-xs text-muted-foreground">Wizard since {profile?.joinedAt}</p>

            <Button variant="outline" onClick={logout} className="mt-4 border-destructive/30 text-destructive hover:bg-destructive/10">
              Logout
            </Button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;

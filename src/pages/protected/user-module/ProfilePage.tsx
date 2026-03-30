import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Pencil, Check, X, Mail, Calendar, Trophy, Target, Zap, BookOpen, Camera, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { mockAttempts } from "@/data/mockUserData";
import { useUser } from "@/hooks/user-module/useUser";

const stats = [
  { icon: Trophy, label: "Quizzes", value: "22", color: "text-accent" },
  { icon: Target, label: "Accuracy", value: "81%", color: "text-success" },
  { icon: Zap, label: "Best Streak", value: "7", color: "text-accent" },
  { icon: BookOpen, label: "Questions", value: "330", color: "text-secondary" },
];

const recentBadges = [
  { emoji: "🧙‍♂️", label: "Quiz Wizard" },
  { emoji: "⚡", label: "Speed Caster" },
  { emoji: "🎯", label: "Sharp Shooter" },
  { emoji: "🔥", label: "On Fire" },
];

const ProfilePage = () => {
  const { profile, updateProfile, isLoggedIn, login, logout } = useUser();
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(profile.name);
  const [draftEmail, setDraftEmail] = useState("harry@hogwarts.edu");

  const handleSave = () => {
    updateProfile({ name: draftName });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setDraftName(profile.name);
    setDraftEmail("harry@hogwarts.edu");
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
            <div className="w-20 h-20 mx-auto rounded-full bg-accent/10 border-2 border-accent/20 flex items-center justify-center">
              <User className="w-10 h-10 text-accent" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Welcome, Wizard</h2>
              <p className="text-sm text-muted-foreground mt-2">Sign in to track your magical journey.</p>
            </div>
            <div className="space-y-3">
              <Input placeholder="Your wizard name" className="bg-muted/30 border-border h-12" />
              <Input placeholder="Owl-mail address" type="email" className="bg-muted/30 border-border h-12" />
              <Button onClick={login} className="w-full btn-primary-gold h-12 text-base">
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
      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-2xl space-y-6">

          {/* ── Avatar & Identity Card ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            {/* Banner */}
            <div className="h-28 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 via-primary/30 to-accent/20" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsla(43,72%,52%,0.15),transparent_70%)]" />
              {/* Decorative stars */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-accent/60"
                  style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%` }}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>

            {/* Avatar + Info */}
            <div className="px-6 pb-6 -mt-12 relative">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-secondary/50 to-primary/50 border-4 border-card flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-display font-bold text-accent">
                      {profile.name.charAt(0)}
                    </span>
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-accent/50">
                    <Camera className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>

                {/* Name + Meta */}
                <div className="flex-1 min-w-0 pb-1">
                  <AnimatePresence mode="wait">
                    {editing ? (
                      <motion.div
                        key="editing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Display Name</label>
                          <Input
                            value={draftName}
                            onChange={(e) => setDraftName(e.target.value)}
                            className="bg-muted/30 border-border h-10"
                            autoFocus
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Owl-Mail</label>
                          <Input
                            value={draftEmail}
                            onChange={(e) => setDraftEmail(e.target.value)}
                            className="bg-muted/30 border-border h-10"
                            type="email"
                          />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <Button size="sm" onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5">
                            <Check className="w-3.5 h-3.5" /> Save
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleCancel} className="text-muted-foreground gap-1.5">
                            <X className="w-3.5 h-3.5" /> Cancel
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="display"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="flex items-center gap-2">
                          <h1 className="font-display text-xl font-bold text-foreground truncate">{profile.name}</h1>
                          <button
                            onClick={() => setEditing(true)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1.5 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 shrink-0" /> harry@hogwarts.edu
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 shrink-0" /> Joined {profile.joinedAt}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Quick Stats ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="glass-card rounded-xl p-4 text-center group hover:border-accent/30 transition-colors"
              >
                <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                <p className="text-xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Badges ───────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" /> Badges Earned
              </h2>
              <span className="text-xs text-muted-foreground">{recentBadges.length} of 12</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {recentBadges.map((badge, i) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.06 }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors cursor-default"
                >
                  <span className="text-2xl">{badge.emoji}</span>
                  <span className="text-[10px] text-muted-foreground text-center leading-tight">{badge.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Recent Activity ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card rounded-2xl p-5"
          >
            <h2 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Recent Activity
            </h2>
            <div className="space-y-2">
              {mockAttempts.slice(0, 4).map((attempt, i) => (
                <motion.div
                  key={attempt.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/10 hover:bg-muted/20 transition-colors"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${attempt.accuracy >= 80
                    ? "bg-success/15 text-success"
                    : attempt.accuracy >= 60
                      ? "bg-accent/15 text-accent"
                      : "bg-destructive/15 text-destructive"
                    }`}>
                    <Target className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{attempt.quizTitle}</p>
                    <p className="text-xs text-muted-foreground">{attempt.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-display font-bold text-foreground">{attempt.score}/{attempt.total}</p>
                    <p className={`text-xs font-medium ${attempt.accuracy >= 80 ? "text-success" : attempt.accuracy >= 60 ? "text-accent" : "text-destructive"
                      }`}>
                      {attempt.accuracy}%
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Logout ───────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full h-12 rounded-xl text-destructive/70 hover:text-destructive hover:bg-destructive/10 gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </motion.div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;

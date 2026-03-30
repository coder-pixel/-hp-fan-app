import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Target, Trophy, Zap, Users, Clock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LeaderboardRow from "@/components/user-module/LeaderboardRow";
import HistoryItem from "@/components/user-module/HistoryItem";
import { mockAttempts, mockLeaderboard } from "@/data/mockUserData";
import StatCard from "@/components/user-module/StatCard";
import { UserStats } from "@/types/user.types";

const computeStats = (): UserStats => {
  const total = mockAttempts?.length || 0;
  const avg = Math.round(mockAttempts?.reduce((s, a) => s + a.accuracy, 0) / total);
  const best = Math.max(...mockAttempts?.map((a) => a.score) || []);
  return { totalQuizzes: total, averageScore: avg, bestScore: best, accuracy: avg };
};

type LeaderboardTab = "global" | "friends";

const DashboardPage = () => {
  const stats = computeStats();
  const [lbTab, setLbTab] = useState<LeaderboardTab>("global");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl space-y-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Your <span className="text-gradient-gold">Dashboard</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Track your magical progress</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <StatCard icon={BarChart3} label="Quizzes Played" value={stats?.totalQuizzes || 0} delay={0} />
            <StatCard icon={Target} label="Avg Accuracy" value={stats?.accuracy || 0} suffix="%" delay={0.05} />
            <StatCard icon={Trophy} label="Best Score" value={stats?.bestScore || 0} delay={0.1} />
            <StatCard icon={Zap} label="Total Score" value={mockAttempts?.reduce((s, a) => s + a.score, 0) || 0} delay={0.15} />
          </div>

          {/* Leaderboard */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                <h2 className="font-display text-base font-bold text-foreground">Leaderboard</h2>
              </div>
              <div className="flex gap-1 bg-muted/30 rounded-lg p-0.5">
                {(["global", "friends"] as LeaderboardTab[])?.map((tab: LeaderboardTab) => (
                  <button
                    key={tab}
                    onClick={() => setLbTab(tab)}
                    className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${lbTab === tab
                      ? "bg-accent/20 text-accent"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {tab === "global" ? "Global" : "Friends"}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-border/30">
              {mockLeaderboard?.map((entry, i) => (
                <LeaderboardRow key={entry.rank} entry={entry} index={i} />
              ))}
            </div>
          </motion.section>

          {/* Quiz History */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-accent" />
              <h2 className="font-display text-base font-bold text-foreground">Recent Quizzes</h2>
            </div>
            <div className="space-y-2">
              {mockAttempts?.map((attempt, i) => (
                <HistoryItem key={attempt.id} attempt={attempt} index={i} />
              ))}
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;

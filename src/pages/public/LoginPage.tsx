import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Github, Mail, UserCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-24">
        <div className="mx-auto w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="glass-card rounded-2xl p-6 sm:p-8"
          >
            <div className="mb-6 text-center">
              <p className="text-xs tracking-widest uppercase text-accent/80 mb-2">Welcome Back</p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">
                Login to <span className="text-gradient-gold">Your Account</span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Continue your magical journey with quizzes, scores, and saved picks.
              </p>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="emailOrUsername">Email or Username</Label>
                <div className="relative">
                  <UserCircle2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="emailOrUsername"
                    name="emailOrUsername"
                    autoComplete="username"
                    placeholder="harry@hogwarts.com or harry_potter"
                    className="pl-9 bg-muted/30 border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-accent hover:text-accent/90 underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="pr-10 bg-muted/30 border-border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full btn-primary-gold mt-1">
                Sign In
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">or continue with</span>
              <Separator className="flex-1" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="outline" className="w-full gap-2 border-border hover:bg-accent/10">
                <Mail className="h-4 w-4" />
                Google
              </Button>
              <Button variant="outline" className="w-full gap-2 border-border hover:bg-accent/10">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              New here?{" "}
              <Link to="/signup" className="text-accent hover:text-accent/90 underline-offset-4 hover:underline">
                Create an account
              </Link>
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;

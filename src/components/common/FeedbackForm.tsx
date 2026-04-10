import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Mail, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SUPPORT_EMAIL, WEB3FORMS_ACCESS_KEY } from "@/config";

export interface FeedbackFormProps {
  className?: string;
  title?: string;
  subtitle?: string;
}

type Fields = {
  name: string;
  email: string;
  message: string;
};

function validate(fields: Fields): Record<keyof Fields, string> {
  const errs: Record<keyof Fields, string> = { name: "", email: "", message: "" };

  const name = fields?.name?.trim();
  const email = fields?.email?.trim();
  const message = fields?.message?.trim();

  if (name && (name?.length < 2 || name?.length > 200)) errs.name = "Name must be 2–200 characters.";
  if (email) {
    // Simple, intentionally permissive check.
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok || email?.length > 254) errs.email = "Enter a valid email address.";
  }
  if (!message) errs.message = "Message is required.";
  else if (message?.length < 2 || message?.length > 1200) errs.message = "Message must be 2–1200 characters.";

  return errs;
}

function hasErrors(errs: Record<keyof Fields, string>) {
  return Boolean(errs?.name || errs?.email || errs?.message);
}

function buildMailto(fields: Fields): string {
  const subject = "Potter Wiki — Feedback";
  const lines = [
    "Hi,",
    "",
    fields?.message?.trim(),
    "",
    `— ${fields?.name?.trim() || "Anonymous"}`,
    fields?.email?.trim() ? `Reply-to: ${fields?.email?.trim()}` : "",
  ].filter(Boolean);
  const body = lines?.join("\n");

  return `mailto:${encodeURIComponent(SUPPORT_EMAIL)}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

export function FeedbackForm({
  className,
  title = "Contact / Feedback",
  subtitle = "Send a suggestion, bug report, or a magical idea.",
}: FeedbackFormProps) {
  const [fields, setFields] = useState<Fields>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<keyof Fields, string>>({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");

  const canUseWeb3 = useMemo(() => Boolean(WEB3FORMS_ACCESS_KEY), []);

  const onChange = (k: keyof Fields, v: string) => {
    const next = { ...fields, [k]: v };
    setFields(next);
    setErrors(validate(next));
    setSubmitError("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const nextErrors = validate(fields);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    if (!canUseWeb3) {
      window.location.href = buildMailto(fields);
      setIsSubmitted(true);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY ?? "",
          to: SUPPORT_EMAIL,
          subject: "New Feedback from Potter Wiki App",
          from_name: fields?.name?.trim() || "Potter Wiki User",
          email: fields?.email?.trim() || undefined,
          message: fields?.message?.trim(),
          botcheck: "",
        }),
      });

      const data = (await response.json()) as { success?: boolean; message?: string };
      if (!data?.success) {
        setSubmitError(data?.message || "Couldn’t send right now. Please try again in a moment.");
        return;
      }

      setIsSubmitted(true);
    } catch {
      setSubmitError("Couldn’t send right now. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("glass-card p-5 text-center", className)}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 16 }}
          className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10"
        >
          <Sparkles className="h-5 w-5 text-emerald-400" aria-hidden />
        </motion.div>
        <h3 className="font-display text-base font-semibold text-foreground mb-1">Message sent</h3>
        <p className="text-muted-foreground text-xs">
          Thanks for helping shape the magic.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn("glass-card p-5 sm:p-6", className)}
    >
      <div className="text-center mb-4">
        <h3 className="font-display text-base sm:text-lg font-semibold text-foreground">
          {title}
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm font-body mt-1">
          {subtitle}
        </p>
      </div>

      {submitError ? (
        <div className="mb-3 flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" aria-hidden />
          <span>{submitError}</span>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="about-feedback-name" className="text-xs font-medium text-foreground/80">
              Name (optional)
            </label>
            <Input
              id="about-feedback-name"
              value={fields?.name ?? ""}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Your name"
              className="bg-background/60"
              autoComplete="name"
            />
            {errors?.name ? <p className="text-xs font-medium text-destructive">{errors?.name}</p> : null}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="about-feedback-email" className="text-xs font-medium text-foreground/80">
              Email (optional)
            </label>
            <Input
              id="about-feedback-email"
              value={fields?.email ?? ""}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="you@example.com"
              className="bg-background/60"
              autoComplete="email"
              inputMode="email"
            />
            {errors?.email ? <p className="text-xs font-medium text-destructive">{errors?.email}</p> : null}
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="about-feedback-message" className="text-xs font-medium text-foreground/80">
            Message
          </label>
          <Textarea
            id="about-feedback-message"
            value={fields?.message ?? ""}
            onChange={(e) => onChange("message", e.target.value)}
            placeholder="Tell me what to improve, fix, or build next…"
            rows={4}
            className="bg-background/60"
          />
          {errors?.message ? <p className="text-xs font-medium text-destructive">{errors?.message}</p> : null}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
              aria-label="Sending"
            />
          ) : canUseWeb3 ? (
            <>
              <Send className="h-4 w-4" aria-hidden />
              Send message
            </>
          ) : (
            <>
              <Mail className="h-4 w-4" aria-hidden />
              Open email
            </>
          )}
        </Button>

        <p className="text-[11px] text-muted-foreground/80 text-center leading-relaxed">
          {canUseWeb3
            ? "This message is delivered securely. No spam—just magic."
            : `No form service configured, so this opens your email client to message ${SUPPORT_EMAIL}.`}
        </p>
      </form>
    </motion.div>
  );
}

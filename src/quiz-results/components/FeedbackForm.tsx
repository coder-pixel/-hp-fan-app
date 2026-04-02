import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Send, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { blockNonAlphanumericSpaceKeyDown } from "@/lib/helpers";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export interface FeedbackFormProps {
  className?: string;
  title?: string;
  subtitle?: string;
}

const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

export function FeedbackForm({
  className,
  title = "Share Your Feedback",
  subtitle = "Help us improve!",
}: FeedbackFormProps) {
  const [formFields, setFormFields] = useState<Record<string, string>>({ userName: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState<Record<string, boolean>>({ userName: false, message: false });

  const _handleFormFieldChange = (field: string, value: string) => {
    const newFormFields = { ...formFields };
    const newIsDirty = { ...isDirty };

    newFormFields[field] = value;
    newIsDirty[field] = true;

    setFormFields(newFormFields);
    setIsDirty(newIsDirty);

    _validateFormFields({ newFormFields, newIsDirty });
  };

  const _validateFormFields = ({ newFormFields, newIsDirty }: { newFormFields: Record<string, string>, newIsDirty: Record<string, boolean> }) => {
    return new Promise((resolve, reject) => {
      const newErrors = { ...errors };
      let isFormValid = true;

      Object.keys(newFormFields)?.forEach((field) => {
        if (newIsDirty[field]) {
          switch (field) {
            case "userName":
              if (field === "userName") {
                const userName = newFormFields[field]?.trim() ?? "";
                if (userName?.length && (userName?.length < 2 || userName?.length > 200)) {
                  newErrors[field] = "*Username must be between 2 and 200 characters";
                  isFormValid = false;
                } else {
                  newErrors[field] = ""; // Not required, so no error if empty
                  newIsDirty[field] = false;
                }
              }
              break;

            case "message":
              if (field === "message") {
                const message = newFormFields[field]?.trim() ?? "";
                if (!message?.length) {
                  newErrors[field] = "*Required";
                  isFormValid = false;
                } else if (message?.length < 2 || message?.length > 500) {
                  newErrors[field] = "*Message must be between 2 and 500 characters";
                  isFormValid = false;
                } else {
                  newErrors[field] = "";
                  newIsDirty[field] = false;
                }
              }
              break;

            default:
              break;
          }
        }
      });


      setErrors(newErrors);
      setIsDirty(newIsDirty);
      resolve(isFormValid);
    });
  };

  const _handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const newFormFields = { ...formFields };
      const newIsDirty = { userName: true, message: true };
      // validate form fields
      const isFormValid = await _validateFormFields({ newFormFields, newIsDirty });
      if (!isFormValid) {
        return;
      }
      setIsLoading(true);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          to: "potterwiki07@gmail.com",
          subject: "New Feedback from Potter Wiki App",
          from_name: formFields?.userName ?? "Potter Wiki User",
          message: formFields?.message,
          botcheck: "",
        }),
      });

      const data = await response.json();

      if (data?.success) {
        // successToast("Feedback sent successfully.");
        setIsSubmitted(true);
      } else {
        // errorToast("Something went wrong. Please try again later.");
      }
    } catch {
      // errorToast("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("glass-card p-5 text-center", className)}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10"
        >
          <Sparkles className="h-5 w-5 text-emerald-400" />
        </motion.div>
        <h3 className="font-display text-base font-semibold text-foreground mb-1">
          Thank You!
        </h3>
        <p className="text-muted-foreground text-xs">
          Your feedback helps us improve!
        </p>
      </motion.div>
    );
  }

  if (!WEB3FORMS_ACCESS_KEY) {
    return null;
    // <div className={cn("glass-card p-4 sm:p-5 text-center", className)}>
    //   <div className="mb-4">
    //     <h3 className="font-display text-base font-semibold text-foreground mb-1">
    //       {title}
    //     </h3>
    //     <p className="text-muted-foreground text-xs">{subtitle}</p>
    //   </div>
    //   <p className="text-xs text-muted-foreground/70">
    //     Feedback form is not configured. Add VITE_WEB3FORMS_ACCESS_KEY to your environment variables.
    //   </p>
    // </div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={cn("glass-card p-4 sm:p-5", className)}
    >
      <div className="mb-4 text-center">
        <h3 className="font-display text-base font-semibold text-foreground mb-1">
          {title}
        </h3>
        <p className="text-muted-foreground text-xs">{subtitle}</p>
      </div>

      {/* {error && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )} */}

      <form onSubmit={_handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="feedback-message" className="text-xs font-medium text-foreground/80 flex items-center gap-1.5">
            <Lightbulb className="h-3 w-3 text-accent" />
            Feedback
          </label>

          <Input
            id="feedback-user-name"
            required
            value={formFields?.userName ?? ""}
            onChange={(e) => _handleFormFieldChange("userName", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all duration-300 resize-none"
            placeholder="Your Name..."
            onKeyDown={blockNonAlphanumericSpaceKeyDown}
          />
          {errors?.userName && (
            <p className="text-sm font-medium text-destructive">{errors?.userName}</p>
          )}

          <Textarea
            id="feedback-message"
            required
            rows={3}
            value={formFields?.message ?? ""}
            onChange={(e) => _handleFormFieldChange("message", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-background/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all duration-300 resize-none"
            placeholder="Your Feedback..."
          />
          {errors?.message && (
            <p className="text-sm font-medium text-destructive">{errors?.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary-gold flex items-center justify-center gap-1.5 py-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
            />
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Feedback
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}
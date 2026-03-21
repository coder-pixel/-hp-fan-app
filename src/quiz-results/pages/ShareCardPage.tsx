import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Facebook, Link2, MessageCircle, Share2, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ShareCard } from "../components/ShareCard";
import { useResultData } from "../hooks/useResultData";
import type { QuizResultsUiConfig, ResultData, ShareCardTheme } from "../types/result.types";
import {
  buildFacebookSharerUrl,
  buildTwitterIntentUrl,
  buildWhatsAppUrl,
  copyTextToClipboard,
  downloadNodeAsPng,
  shareNative,
} from "../utils/shareUtils";

const ALL_THEMES: ShareCardTheme[] = ["light", "dark", "fun"];

export interface ShareCardPageProps {
  data: ResultData;
  config?: QuizResultsUiConfig;
  onBack: () => void;
  className?: string;
}

/**
 * Full-screen share flow: preview, themes, download, and social actions in one place.
 */
export function ShareCardPage({ data, config, onBack, className }: ShareCardPageProps) {
  const shareCardRef = useRef<HTMLDivElement>(null);
  const { percent, performanceLabel, fullShareText, viralLine } = useResultData(data, config);

  const themeList = useMemo(() => {
    const t = config?.shareCard?.themes;
    return t?.length ? t : ALL_THEMES;
  }, [config?.shareCard?.themes]);

  const [theme, setTheme] = useState<ShareCardTheme>(
    () =>
      config?.shareCard?.defaultTheme && themeList?.includes(config?.shareCard?.defaultTheme)
        ? config?.shareCard?.defaultTheme
        : themeList?.[0] ?? "dark",
  );

  const headline = useMemo(
    () => config?.shareCard?.headline ?? "Certified Potterhead 🪄",
    [config?.shareCard?.headline],
  );

  const tagline = useMemo(
    () => config?.shareCard?.tagline ?? viralLine,
    [config?.shareCard?.tagline, viralLine],
  );

  const shareChallengeLine = useMemo(
    () => config?.shareCard?.challengeLine ?? viralLine,
    [config?.shareCard?.challengeLine, viralLine],
  );

  const ss = config?.socialShare;
  const showWhatsApp = !ss || ss.whatsapp?.enabled !== false;
  const showTwitter = !ss || ss.twitter?.enabled !== false;
  const showFacebook = ss?.facebook?.enabled === true;

  const handleNativeShare = async () => {
    const shared = await shareNative({
      title: config?.quizTitle,
      text: fullShareText,
      url: config?.shareUrl,
    });
    if (shared) {
      toast({ title: "Share sheet opened" });
      return;
    }
    const ok = await copyTextToClipboard(fullShareText);
    toast(
      ok
        ? { title: "Copied", description: "Share text is on your clipboard." }
        : { title: "Copy failed", description: "Try again or use another share option." },
    );
  };

  const handleDownload = async () => {
    const el = shareCardRef.current;
    if (!el) return;
    try {
      await downloadNodeAsPng(el, "quiz-result.png");
      toast({ title: "Downloaded", description: "Your result card image is saved." });
    } catch {
      toast({
        title: "Export failed",
        description: "Try a different browser or disable content blockers.",
      });
    }
  };

  const openWhatsApp = () => {
    const override = config?.socialShare?.whatsapp?.url;
    if (override) {
      window.open(override, "_blank", "noopener,noreferrer");
      return;
    }
    window.open(buildWhatsAppUrl(fullShareText, config?.shareUrl), "_blank", "noopener,noreferrer");
  };

  const openTwitter = () => {
    const override = config?.socialShare?.twitter?.url;
    if (override) {
      window.open(override, "_blank", "noopener,noreferrer");
      return;
    }
    window.open(buildTwitterIntentUrl(fullShareText, config?.shareUrl), "_blank", "noopener,noreferrer");
  };

  const openFacebook = () => {
    const override = config?.socialShare?.facebook?.url;
    if (override) {
      window.open(override, "_blank", "noopener,noreferrer");
      return;
    }
    const pageUrl = config?.shareUrl?.trim();
    if (!pageUrl) return;
    window.open(buildFacebookSharerUrl(pageUrl), "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    const text = config?.shareUrl?.trim() ? config?.shareUrl?.trim() : fullShareText;
    const ok = await copyTextToClipboard(text);
    toast(
      ok
        ? { title: "Copied" }
        : { title: "Couldn't copy", description: "Clipboard permission denied." },
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn("w-full max-w-xl mx-auto", className)}
    >
      <header className="sticky top-0 z-30 -mx-1 mb-6 flex items-center gap-2 border-b border-border/40 bg-background/90 px-1 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-11 w-11 shrink-0 rounded-xl"
          onClick={onBack}
          aria-label="Back to results"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-semibold leading-tight sm:text-xl">Share card</h2>
          <p className="text-xs text-muted-foreground font-body tabular-nums">
            {data?.score}/{data?.total} correct · {percent}% · {performanceLabel}
          </p>
        </div>
      </header>

      <div className="space-y-6 px-1 pb-10 sm:px-0">
        <div className="flex justify-center">
          <ShareCard
            ref={shareCardRef}
            theme={theme}
            headline={headline}
            tagline={tagline}
            score={data?.score}
            total={data?.total}
            percent={percent}
            performanceLabel={performanceLabel}
            quizTitle={config?.quizTitle}
            quizUrl={config?.shareUrl}
            challengeLine={shareChallengeLine}
            passMark={config?.passMark}
          />
        </div>

        {themeList?.length > 1 ? (
          <div>
            <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Card style
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {themeList?.map((t) => (
                <Button
                  key={t}
                  type="button"
                  size="sm"
                  variant={theme === t ? "secondary" : "ghost"}
                  className="rounded-full capitalize"
                  onClick={() => setTheme(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
        ) : null}

        <Button
          type="button"
          size="lg"
          className="mx-auto flex min-h-12 w-full max-w-sm rounded-xl btn-primary-gold"
          onClick={handleDownload}
        >
          <Download className="mr-2 h-4 w-4" aria-hidden />
          Download image
        </Button>

        <div className="mx-auto max-w-sm space-y-3 rounded-2xl border border-border/50 bg-muted/15 p-4">
          <p className="text-center text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Share
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {showWhatsApp ? (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="min-h-11 min-w-[7.5rem] flex-1 rounded-xl"
                onClick={openWhatsApp}
              >
                <MessageCircle className="mr-2 h-4 w-4" aria-hidden />
                WhatsApp
              </Button>
            ) : null}
            {showTwitter ? (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="min-h-11 min-w-[7.5rem] flex-1 rounded-xl"
                onClick={openTwitter}
              >
                <Twitter className="mr-2 h-4 w-4" aria-hidden />
                Twitter
              </Button>
            ) : null}
            {showFacebook ? (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="min-h-11 min-w-[7.5rem] flex-1 rounded-xl"
                onClick={openFacebook}
              >
                <Facebook className="mr-2 h-4 w-4" aria-hidden />
                Facebook
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="min-h-11 min-w-[7.5rem] flex-1 rounded-xl"
              onClick={handleCopyLink}
            >
              <Link2 className="mr-2 h-4 w-4" aria-hidden />
              Copy
            </Button>
          </div>
        </div>

        {typeof navigator !== "undefined" && navigator.share ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mx-auto flex w-full max-w-sm gap-2 text-muted-foreground"
            onClick={handleNativeShare}
          >
            <Share2 className="h-4 w-4" aria-hidden />
            System share…
          </Button>
        ) : null}
      </div>
    </motion.div>
  );
}

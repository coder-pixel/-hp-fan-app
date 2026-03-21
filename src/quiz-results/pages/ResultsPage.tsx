import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Facebook, Link2, MessageCircle, Share2, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ActionButtons } from "../components/ActionButtons";
import { PerformanceBadge } from "../components/PerformanceBadge";
import { ResultHeader } from "../components/ResultHeader";
import { ScoreVisualizer } from "../components/ScoreVisualizer";
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

export interface ResultsPageProps {
  data: ResultData;
  config?: QuizResultsUiConfig;
  onPlayAgain: () => void;
  onReviewAnswers: () => void;
  className?: string;
}

export function ResultsPage({
  data,
  config,
  onPlayAgain,
  onReviewAnswers,
  className,
}: ResultsPageProps) {
  const shareCardRef = useRef<HTMLDivElement>(null);
  const { percent, emotionalMessage, performanceLabel, fullShareText, viralLine } =
    useResultData(data, config);

  const themeList = useMemo(() => {
    const t = config?.shareCard?.themes;
    return t?.length ? t : ALL_THEMES;
  }, [config?.shareCard?.themes]);

  const [theme, setTheme] = useState<ShareCardTheme>(
    () =>
      config?.shareCard?.defaultTheme &&
        themeList?.includes(config?.shareCard?.defaultTheme)
        ? config?.shareCard?.defaultTheme
        : themeList?.[0] ?? "dark",
  );

  const headline = useMemo(() => {
    return config?.shareCard?.headline ?? "Certified Potterhead 🪄";
  }, [config?.shareCard?.headline]);

  const tagline = useMemo(() => {
    return config?.shareCard?.tagline ?? viralLine;
  }, [config?.shareCard?.tagline, viralLine]);

  const shareChallengeLine = useMemo(
    () => config?.shareCard?.challengeLine ?? viralLine,
    [config?.shareCard?.challengeLine, viralLine],
  );

  const ss = config?.socialShare;
  const showWhatsApp = !ss || ss.whatsapp?.enabled !== false;
  const showTwitter = !ss || ss.twitter?.enabled !== false;
  /** Facebook only appears when explicitly enabled (avoids showing it for `{}`). */
  const showFacebook = ss?.facebook?.enabled === true;

  const _handleChallenge = async () => {
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

  const _openWhatsApp = () => {
    const override = config?.socialShare?.whatsapp?.url;
    if (override) {
      window.open(override, "_blank", "noopener,noreferrer");
      return;
    }
    window.open(buildWhatsAppUrl(fullShareText, config?.shareUrl), "_blank", "noopener,noreferrer");
  };

  const _openTwitter = () => {
    const override = config?.socialShare?.twitter?.url;
    if (override) {
      window.open(override, "_blank", "noopener,noreferrer");
      return;
    }
    window.open(buildTwitterIntentUrl(fullShareText, config?.shareUrl), "_blank", "noopener,noreferrer");
  };

  const _openFacebook = () => {
    const override = config?.socialShare?.facebook?.url;
    if (override) {
      window.open(override, "_blank", "noopener,noreferrer");
      return;
    }
    const pageUrl = config?.shareUrl?.trim();
    if (!pageUrl) return;
    window.open(buildFacebookSharerUrl(pageUrl), "_blank", "noopener,noreferrer");
  };

  const _handleCopyLink = async () => {
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={cn("w-full max-w-xl mx-auto space-y-8", className)}
    >
      <div className="p-6 space-y-8 sm:p-10 sm:glass-card">
        <ResultHeader
          emotionalMessage={emotionalMessage}
          resultTag={config?.resultTag}
        />

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center sm:gap-10">
          <ScoreVisualizer score={data?.score} total={data?.total} percent={percent} />
          <PerformanceBadge label={performanceLabel ?? ""} percent={percent} className="sm:mt-4" />
        </div>

        <ActionButtons
          onPlayAgain={onPlayAgain}
          onReviewAnswers={onReviewAnswers}
          onChallengeFriends={_handleChallenge}
        />

        <div className="space-y-4">
          <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Share card
          </p>

          {themeList?.length > 1 ? (
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
          ) : null}
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
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="min-h-11 min-w-[8.5rem] flex-1 rounded-xl sm:flex-none"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" aria-hidden />
              Image
            </Button>
            {showWhatsApp ? (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="min-h-11 min-w-[8.5rem] flex-1 rounded-xl sm:flex-none"
                onClick={_openWhatsApp}
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
                className="min-h-11 min-w-[8.5rem] flex-1 rounded-xl sm:flex-none"
                onClick={_openTwitter}
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
                className="min-h-11 min-w-[8.5rem] flex-1 rounded-xl sm:flex-none"
                onClick={_openFacebook}
              >
                <Facebook className="mr-2 h-4 w-4" aria-hidden />
                Facebook
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="min-h-11 min-w-[8.5rem] flex-1 rounded-xl sm:flex-none"
              onClick={_handleCopyLink}
            >
              <Link2 className="mr-2 h-4 w-4" aria-hidden />
              Copy
            </Button>
          </div>
          {typeof navigator !== "undefined" && navigator.share ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full gap-2 text-muted-foreground"
              onClick={_handleChallenge}
            >
              <Share2 className="h-4 w-4" aria-hidden />
              System share…
            </Button>
          ) : null}
        </div>

      </div>
    </motion.div>
  );
}

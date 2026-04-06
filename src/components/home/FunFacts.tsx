import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchJsonWithTimeout } from "@/lib/helpers";

type HpApiCharacter = {
  name: string;
  house?: string;
  ancestry?: string;
  species?: string;
  patronus?: string;
  actor?: string;
  alive?: boolean;
  wizard?: boolean;
};

type HpApiSpell = {
  name: string;
  description?: string;
};

type HarryPotterFact = {
  text: string;
  meta?: string;
};

const FunFacts = () => {
  const [index, setIndex] = useState(0);
  const [fact, setFact] = useState<string>("");
  const [meta, setMeta] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [error, setError] = useState<string>("");

  const [characters, setCharacters] = useState<HpApiCharacter[] | null>(null);
  const [spells, setSpells] = useState<HpApiSpell[] | null>(null);

  const subtitle = useMemo(() => {
    return "Fresh Harry Potter lore, pulled from a free public API.";
  }, []);

  const pickRandom = <T,>(arr: T[]): T | undefined => {
    if (!arr?.length) return undefined;
    return arr[Math.floor(Math.random() * arr?.length)];
  };

  const characterToFacts = (c: HpApiCharacter): HarryPotterFact[] => {
    const facts: HarryPotterFact[] = [];
    const name = c?.name?.trim() ?? "";
    if (!name) return facts;

    if (c?.house) facts?.push({ text: `${name} is in ${c?.house}.`, meta: "Character" });
    if (typeof c?.alive === "boolean")
      facts?.push({
        text: `${name} is ${c?.alive ? "alive" : "not alive"} in the story timeline.`,
        meta: "Character",
      });
    if (c?.patronus) facts?.push({ text: `${name}'s Patronus is ${c?.patronus}.`, meta: "Character" });
    if (c?.ancestry) facts?.push({ text: `${name}'s ancestry is listed as ${c?.ancestry}.`, meta: "Character" });
    if (c?.species) facts?.push({ text: `${name}'s species is ${c?.species}.`, meta: "Character" });
    if (c?.actor) facts?.push({ text: `${name} is portrayed by ${c?.actor}.`, meta: "Character" });
    if (typeof c?.wizard === "boolean")
      facts?.push({ text: `${name} is ${c?.wizard ? "a wizard/witch" : "not a wizard/witch"}.`, meta: "Character" });
    return facts;
  };

  const generateOnline = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [charactersData, spellsData] = await Promise.all([
        characters
          ? Promise.resolve(characters)
          : fetchJsonWithTimeout<HpApiCharacter[]>(
            "https://hp-api.onrender.com/api/characters",
            { timeoutMs: 8000 },
          ),
        spells
          ? Promise.resolve(spells)
          : fetchJsonWithTimeout<HpApiSpell[]>(
            "https://hp-api.onrender.com/api/spells",
            { timeoutMs: 8000 },
          ),
      ]);

      if (!characters) setCharacters(charactersData);
      if (!spells) setSpells(spellsData);

      const candidateFacts: HarryPotterFact[] = [];
      const c = pickRandom(charactersData);
      if (c) candidateFacts.push(...characterToFacts(c));

      const s = pickRandom(spellsData);
      if (s?.name?.trim()) {
        candidateFacts.push({
          text: s.description?.trim()
            ? `Spell: ${s.name} — ${s.description.trim()}`
            : `Spell: ${s.name}`,
          meta: "Spell",
        });
      }

      const picked = pickRandom(candidateFacts);
      if (!picked?.text?.trim()) {
        setError("Couldn’t fetch a fact right now. Please try again.");
        setFact("");
        setMeta("");
        return;
      }

      setIndex((v) => v + 1);
      setFact(picked.text);
      setMeta(picked.meta ?? "");
    } catch {
      setError("Couldn’t fetch a fact right now. Please try again.");
      setFact("");
      setMeta("");
    } finally {
      setIsLoading(false);
    }
  };

  const generate = async () => {
    await generateOnline();
  };

  const copy = async () => {
    if (!fact?.trim()) return;
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(fact.trim());
    } catch {
      // no-op (clipboard may be blocked)
    } finally {
      window.setTimeout(() => setIsCopying(false), 550);
    }
  };

  return (
    <div className="glass-card p-6 sm:p-10 max-w-2xl mx-auto text-center relative overflow-hidden">
      {/* Decorative glow */}
      <div
        className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(43 72% 52%), transparent)",
        }}
      />
      <div
        className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(210 70% 55%), transparent)",
        }}
      />

      <span className="inline-block text-xs font-body font-medium tracking-widest uppercase text-accent/70 mb-4">
        Fun facts generator
      </span>
      <h3 className="font-display text-xl sm:text-3xl font-semibold">
        A tiny burst of <span className="text-gradient-gold">magic</span>
      </h3>
      <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
        {subtitle}
      </p>

      <div className="mt-7 sm:mt-8 min-h-[132px] flex items-center justify-center mb-6 px-2">
        <AnimatePresence mode="wait">
          <motion.p
            key={`${index}:${fact}:${meta}:${error}`}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.45 }}
            className="text-foreground/90 font-body leading-relaxed text-sm sm:text-base"
          >
            {error ? (
              <span className="text-destructive/90">{error}</span>
            ) : fact ? (
              fact
            ) : (
              <span className="text-muted-foreground">
                Tap generate to fetch a Harry Potter fact.
              </span>
            )}
          </motion.p>
        </AnimatePresence>
      </div>

      {meta ? (
        <div className="-mt-2 mb-5">
          <span className="inline-flex items-center rounded-full border border-border/40 bg-muted/20 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            {meta}
          </span>
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5">
        <Button
          type="button"
          onClick={generate}
          disabled={isLoading}
          className="btn-secondary-outline text-sm px-6 py-2.5"
        >
          <Sparkles size={15} className="animate-sparkle text-accent" />
          {isLoading ? "Summoning..." : "Generate HP fact"}
        </Button>

        <Button
          type="button"
          onClick={copy}
          variant="outline"
          disabled={!fact?.trim() || isLoading}
          className="text-sm px-4 py-2.5"
        >
          <Copy size={16} className={isCopying ? "opacity-70" : ""} />
          {isCopying ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
};

export default FunFacts;

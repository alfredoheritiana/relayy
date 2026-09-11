import { useMemo, useState } from "react";

import { RelayTrace } from "@/components/relay/relay-trace";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { demoConfig } from "@/config/product";
import { extractDeterministic } from "@/domain/extraction";
import { cn } from "@/lib/utils";

const FIELD_LABELS: Record<string, string> = {
  service: "Service",
  location: "Lieu",
  project_reason: "Contexte",
  timeline: "Délai",
};

const FIELD_ACCENT: Record<string, string> = {
  service: "decoration-relay-red",
  location: "decoration-relay-blue",
  project_reason: "decoration-relay-orange",
  timeline: "decoration-relay-lime",
};

const ALLOWED = ["service", "location", "project_reason", "timeline"] as const;

interface Fact {
  readonly key: string;
  readonly label: string;
  readonly value: string;
  readonly evidence: string;
}

/** Retire les accents en conservant la longueur (index alignés sur la phrase). */
const deaccent = (value: string): string =>
  Array.from(value.toLowerCase())
    .map((char) => char.normalize("NFD").replace(/[\u0300-\u036f]/g, "") || char)
    .join("");

/** Découpe la phrase en segments, en soulignant les fragments compris. */
function highlight(sentence: string, facts: readonly Fact[]) {
  const marks: Array<{ start: number; end: number; key: string }> = [];
  const lower = deaccent(sentence);
  for (const fact of facts) {
    const needle = deaccent(fact.evidence).trim();
    if (!needle) continue;
    const start = lower.indexOf(needle);

    if (start < 0) continue;
    const end = start + needle.length;
    if (marks.some((m) => start < m.end && end > m.start)) continue;
    marks.push({ start, end, key: fact.key });
  }
  marks.sort((a, b) => a.start - b.start);

  const parts: Array<{ text: string; key: string | null }> = [];
  let cursor = 0;
  for (const mark of marks) {
    if (mark.start > cursor) parts.push({ text: sentence.slice(cursor, mark.start), key: null });
    parts.push({ text: sentence.slice(mark.start, mark.end), key: mark.key });
    cursor = mark.end;
  }
  if (cursor < sentence.length) parts.push({ text: sentence.slice(cursor), key: null });
  return parts;
}

export interface LiveRelayTraceProps {
  tone?: "dark" | "light";
  className?: string;
}

/**
 * Démonstration locale honnête : le parser déterministe tourne dans le
 * navigateur. Aucun appel IA, aucun lead créé.
 */
export function LiveRelayTrace({ tone = "dark", className }: LiveRelayTraceProps) {
  const [text, setText] = useState<string>(demoConfig.referenceSentence);
  const [analyzedText, setAnalyzedText] = useState<string | null>(null);

  const facts = useMemo<Fact[]>(() => {
    if (analyzedText === null) return [];
    return extractDeterministic(analyzedText, [...ALLOWED]).extractions.map((extraction) => ({
      key: extraction.fieldKey,
      label: FIELD_LABELS[extraction.fieldKey] ?? extraction.fieldKey,
      value: String(extraction.value),
      evidence: extraction.evidence ?? "",
    }));
  }, [analyzedText]);

  const analyzed = analyzedText !== null;
  const dark = tone === "dark";
  const parts = analyzed ? highlight(analyzedText, facts) : [{ text, key: null }];
  const step = !analyzed ? 0 : facts.length === 0 ? 1 : facts.length >= 3 ? 3 : 2;

  return (
    <div
      className={cn(
        "flex flex-col gap-6 border border-relay-line-dark/80 p-5 sm:p-7 lg:p-8",
        dark
          ? "border-relay-line-dark bg-relay-ink text-relay-white"
          : "border-border bg-surface text-foreground",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={cn("relay-label", dark ? "text-relay-muted-dark" : "text-muted-foreground")}>
          <span className="mr-2 inline-block size-2 rounded-full bg-relay-red align-middle" />
          // LIVE RELAY TRACE
        </p>
        <span
          className={cn(
            "relay-label rounded-full border px-2.5 py-1",
            dark
              ? "border-relay-line-dark text-relay-muted-dark"
              : "border-border text-muted-foreground",
          )}
        >
          Démonstration locale
        </span>
      </div>

      <div>
        <label htmlFor="live-trace-input" className="sr-only">
          Phrase à analyser
        </label>
        <Textarea
          id="live-trace-input"
          value={text}
          rows={5}
          maxLength={500}
          onChange={(event) => {
            setText(event.target.value);
            setAnalyzedText(null);
          }}
          className={cn(
            "relay-voice min-h-48 resize-none rounded-lg text-[1.65rem] leading-[1.12] sm:min-h-56 sm:text-[2.15rem]",
            dark
              ? "border-relay-line-dark bg-relay-black text-relay-white placeholder:text-relay-muted-dark"
              : "bg-surface",
          )}
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <span className={cn("font-mono text-[11px]", dark ? "text-relay-muted-dark" : "text-muted-foreground")}>
            {text.length}/500
          </span>
          <Button
            type="button"
            onClick={() => setAnalyzedText(text.trim())}
            disabled={!text.trim()}
          >
            Analyser la demande
          </Button>
          <RelayTrace current={analyzed ? step : 0} tone={dark ? "dark" : "light"} />

      {analyzed ? (
            <button
              type="button"
              onClick={() => {
                setText(demoConfig.referenceSentence);
                setAnalyzedText(null);
              }}
              className={cn(
                "min-h-11 text-sm underline underline-offset-4",
                dark
                  ? "text-relay-muted-dark hover:text-relay-white"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Réinitialiser la phrase
            </button>
          ) : null}
        </div>
      </div>

      {analyzed ? (
        <div className="flex flex-col gap-5">
          <p className="relay-voice text-lg leading-relaxed sm:text-xl">
            {parts.map((part, index) =>
              part.key ? (
                <mark
                  key={index}
                  className={cn(
                    "bg-transparent underline decoration-2 underline-offset-4",
                    dark ? "text-relay-white" : "text-foreground",
                    FIELD_ACCENT[part.key] ?? "decoration-relay-blue",
                  )}
                >
                  {part.text}
                </mark>
              ) : (
                <span key={index}>{part.text}</span>
              ),
            )}
          </p>

          {facts.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {facts.map((fact) => (
                <li
                  key={fact.key}
                  className={cn(
                    "flex flex-col gap-0.5 rounded-lg border px-3 py-2",
                    dark ? "border-relay-line-dark bg-relay-black" : "border-border bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "relay-label",
                      dark ? "text-relay-muted-dark" : "text-muted-foreground",
                    )}
                  >
                    {fact.label}
                  </span>
                  <span className="text-sm font-semibold">{fact.value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={cn("text-sm", dark ? "text-relay-muted-dark" : "text-muted-foreground")}>
              Je dois clarifier le besoin : cette phrase ne contient pas encore de fait exploitable
              pour ce parcours.
            </p>
          )}

          <RelayTrace current={step} tone={dark ? "dark" : "light"} />

          <div
            className={cn(
              "flex flex-col gap-1 border-l-2 pl-4",
              facts.length > 0 ? "border-relay-red" : "border-relay-orange",
            )}
          >
            <span
              className={cn(
                "relay-label",
                dark ? "text-relay-muted-dark" : "text-muted-foreground",
              )}
            >
              {facts.length > 0 ? "Action — demander l’e-mail" : "Manque — préciser le besoin"}
            </span>
            <span className="font-display text-base font-semibold">
              {facts.length > 0
                ? "Coordonnées manquantes : une seule question reste utile."
                : "Reformulez votre besoin pour que Relay puisse structurer la demande."}
            </span>
          </div>

          <p
            className={cn(
              "font-mono text-xs",
              dark ? "text-relay-muted-dark" : "text-muted-foreground",
            )}
          >
            {facts.length} fait{facts.length > 1 ? "s" : ""} compris · 0 question répétée · 1
            prochaine action
          </p>
        </div>
      ) : (
        <p className={cn("text-sm", dark ? "text-relay-muted-dark" : "text-muted-foreground")}>
          Relay distinguera ce qui est déjà dit de ce qu’il faut encore demander.
        </p>
      )}
    </div>
  );
}

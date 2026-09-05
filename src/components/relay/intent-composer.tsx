import { useCallback, useMemo, useState } from "react";

import { SignalPath, nodesFromIndex } from "@/components/relay/signal-path";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { demoConfig } from "@/config/product";
import { extractDeterministic } from "@/domain/extraction";
import { cn } from "@/lib/utils";

const FIELD_LABELS: Record<string, string> = {
  service: "Service",
  location: "Lieu",
  project_reason: "Objectif",
  timeline: "Délai",
};

const ALLOWED = ["service", "location", "project_reason", "timeline"] as const;
const PATH_LABELS = ["Intention", "Contexte", "Qualification", "Action"] as const;

export interface IntentComposerProps {
  /** Variante compacte pour le hero, variante développée pour la section démo. */
  variant?: "hero" | "section";
  editable?: boolean;
  className?: string;
}

/**
 * Démonstration locale et honnête : le parser déterministe tourne dans le
 * navigateur, aucun lead n'est créé et aucun appel IA n'est prétendu.
 */
export function IntentComposer({
  variant = "hero",
  editable = false,
  className,
}: IntentComposerProps) {
  const [text, setText] = useState<string>(demoConfig.referenceSentence);
  const [analyzed, setAnalyzed] = useState(false);

  const chips = useMemo(() => {
    if (!analyzed) return [];
    const proposal = extractDeterministic(text, [...ALLOWED]);
    return proposal.extractions.map((extraction) => ({
      key: extraction.fieldKey,
      label: FIELD_LABELS[extraction.fieldKey] ?? extraction.fieldKey,
      value: String(extraction.value),
      evidence: extraction.evidence ?? "",
    }));
  }, [analyzed, text]);

  const analyze = useCallback(() => setAnalyzed(true), []);

  const stepIndex = analyzed ? (chips.length >= 3 ? 2 : 1) : 0;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 sm:p-6",
        variant === "section" && "sm:p-8",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Démonstration interactive
        </span>
        <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Local
        </span>
      </div>

      <div className="mt-4">
        {editable ? (
          <>
            <label htmlFor="composer-text" className="sr-only">
              Décrivez un besoin
            </label>
            <Textarea
              id="composer-text"
              rows={3}
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                setAnalyzed(false);
              }}
              className="text-base leading-relaxed"
            />
          </>
        ) : (
          <p className="text-lg leading-relaxed text-foreground">« {text} »</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={analyze} disabled={analyzed || text.trim().length < 8}>
          {analyzed ? "Demande analysée" : "Analyser cette demande"}
        </Button>
        {analyzed ? (
          <Button
            variant="ghost"
            onClick={() => {
              setText(demoConfig.referenceSentence);
              setAnalyzed(false);
            }}
          >
            Recommencer
          </Button>
        ) : null}
      </div>

      <div className="mt-6">
        <SignalPath
          nodes={nodesFromIndex([...PATH_LABELS], stepIndex)}
          liveLabel={
            analyzed
              ? `${chips.length} éléments compris sur cette demande.`
              : "En attente d’une demande à analyser."
          }
        />
      </div>

      {analyzed ? (
        <div className="mt-6 space-y-4">
          <ul className="flex flex-wrap gap-2">
            {chips.map((chip, index) => (
              <li
                key={chip.key}
                style={{ animationDelay: `${index * 90}ms` }}
                className="animate-in fade-in slide-in-from-bottom-1 rounded-lg border border-border bg-paper px-3 py-2 duration-300"
              >
                <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {chip.label}
                </span>
                <span className="text-sm font-medium text-foreground">{chip.value}</span>
              </li>
            ))}
          </ul>

          {chips.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Rien d’exploitable dans cette phrase. Relay poserait la première question du parcours.
            </p>
          ) : (
            <>
              <p className="text-sm text-foreground">
                {chips.length} réponses déjà comprises. Relay passe directement aux coordonnées.
              </p>
              <div className="rounded-xl border border-border bg-paper p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  Lead Object
                </p>
                <dl className="mt-2 space-y-1 text-sm">
                  {chips.map((chip) => (
                    <div key={`lead-${chip.key}`} className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">{chip.label}</dt>
                      <dd className="text-right font-medium text-foreground">{chip.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 border-t border-border pt-3 text-sm font-medium text-foreground">
                  Prochaine action : demander les coordonnées
                </p>
              </div>
            </>
          )}
          <p className="text-xs text-muted-foreground">
            Aperçu local : aucun lead n’est créé et aucun modèle d’IA n’est appelé ici.
          </p>
        </div>
      ) : null}
    </div>
  );
}

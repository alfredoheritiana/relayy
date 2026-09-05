import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { SignalPath } from "@/components/relay/signal-path";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { extractDeterministic } from "@/domain/extraction";
import { cn } from "@/lib/utils";
import {
  confirmVisitorSubmission,
  startVisitorSession,
  submitVisitorAnswer,
  type VisitorCompletion,
  type VisitorState,
  type VisitorSummaryLine,
} from "@/lib/relay/visitor.functions";

interface VisitorFlowProps {
  slug: string;
  demoHint?: string;
  onLeadCreated?: (leadId: string) => void;
}

/** Le chargement ne doit jamais dépasser cette durée sans issue. */
const SLOW_AFTER_MS = 1_500;
const TIMEOUT_MS = 20_000;

const LOCAL_FIELD_LABELS: Record<string, string> = {
  service: "Service",
  location: "Lieu",
  project_reason: "Objectif",
  timeline: "Délai",
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error instanceof Error ? error : new Error("unknown"));
      },
    );
  });
}

function PhaseTrail({ state }: { state: VisitorState }) {
  return (
    <SignalPath
      liveLabel={state.progressLabel}
      nodes={state.progress.map((phase) => ({
        key: phase.key,
        label: phase.label,
        state: phase.state === "done" ? "done" : phase.state === "current" ? "active" : "idle",
      }))}
    />
  );
}

function SummaryList({
  lines,
  title,
  onEdit,
}: {
  lines: VisitorSummaryLine[];
  title: string;
  onEdit?: (line: VisitorSummaryLine) => void;
}) {
  if (lines.length === 0) return null;
  return (
    <section className="rounded-xl border border-border bg-surface p-4">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </h2>
      <dl className="mt-3 space-y-3">
        {lines.map((line) => (
          <div key={line.fieldKey} className="flex items-start justify-between gap-4">
            <div>
              <dt className="text-xs text-muted-foreground">{line.label}</dt>
              <dd className="text-sm text-foreground">{line.value}</dd>
              {line.needsConfirmation ? (
                <p className="mt-1 text-xs text-muted-foreground">À confirmer</p>
              ) : null}
            </div>
            {onEdit ? (
              <Button variant="ghost" size="sm" onClick={() => onEdit(line)}>
                Modifier
              </Button>
            ) : null}
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Simulation locale : uniquement si le serveur est indisponible. */
function LocalFallback({ demoHint }: { demoHint?: string | undefined }) {
  const [text, setText] = useState<string>(demoHint ?? "");
  const [done, setDone] = useState(false);
  const chips = useMemo(() => {
    if (!done) return [];
    return extractDeterministic(text, [
      "service",
      "location",
      "project_reason",
      "timeline",
    ]).extractions.map((extraction) => ({
      key: extraction.fieldKey,
      label: LOCAL_FIELD_LABELS[extraction.fieldKey] ?? extraction.fieldKey,
      value: String(extraction.value),
    }));
  }, [done, text]);

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        Démonstration locale
      </p>
      <h2 className="text-xl font-medium text-foreground">
        Le service est indisponible : voici la démonstration hors ligne.
      </h2>
      <Label htmlFor="local-text" className="sr-only">
        Décrivez votre besoin
      </Label>
      <Textarea
        id="local-text"
        rows={4}
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setDone(false);
        }}
      />
      <Button onClick={() => setDone(true)} disabled={text.trim().length < 8}>
        Analyser
      </Button>
      {done ? (
        <div className="space-y-3">
          <ul className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <li key={chip.key} className="rounded-lg border border-border bg-paper px-3 py-2">
                <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {chip.label}
                </span>
                <span className="text-sm font-medium text-foreground">{chip.value}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm font-medium text-foreground">
            Simulation terminée — aucun lead réel n’a été envoyé
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function VisitorFlow({ slug, demoHint, onLeadCreated }: VisitorFlowProps) {
  const [state, setState] = useState<VisitorState | null>(null);
  const [loading, setLoading] = useState(true);
  const [slow, setSlow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState<null | "unavailable" | "error">(null);
  const [localMode, setLocalMode] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [answer, setAnswer] = useState("");
  const [consent, setConsent] = useState(false);
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [completion, setCompletion] = useState<VisitorCompletion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (localMode) return;
    let active = true;
    setLoading(true);
    setSlow(false);
    setFailed(null);
    const slowTimer = setTimeout(() => active && setSlow(true), SLOW_AFTER_MS);

    withTimeout(startVisitorSession({ data: { slug } }), TIMEOUT_MS)
      .then((result) => {
        if (!active) return;
        if (!result) setFailed("unavailable");
        else setState(result);
      })
      .catch(() => {
        if (active) setFailed("error");
      })
      .finally(() => {
        if (!active) return;
        clearTimeout(slowTimer);
        setLoading(false);
      });

    return () => {
      active = false;
      clearTimeout(slowTimer);
    };
  }, [slug, attempt, localMode]);

  const step = state?.step;

  useEffect(() => {
    setAnswer("");
    headingRef.current?.focus();
  }, [step && step.kind === "question" ? step.question.key : step?.kind]);

  const send = useCallback(
    async (value: string | string[]) => {
      if (!state || !step || (step.kind !== "question" && step.kind !== "clarification")) return;
      setBusy(true);
      setError(null);
      try {
        const result = await withTimeout(
          submitVisitorAnswer({
            data: {
              sessionId: state.sessionId,
              token: state.token,
              questionKey: step.question.key,
              answer: value,
              freeText: Boolean(step.question.opening),
            },
          }),
          TIMEOUT_MS,
        );
        if (!result) setError("Cette session a expiré. Rechargez la page pour recommencer.");
        else setState(result);
      } catch {
        setError("Vos réponses sont conservées. Vous pouvez réessayer.");
      } finally {
        setBusy(false);
      }
    },
    [state, step],
  );

  const confirm = useCallback(async () => {
    if (!state || busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await withTimeout(
        confirmVisitorSubmission({
          data: {
            sessionId: state.sessionId,
            token: state.token,
            consent,
            corrections: Object.entries(editing).map(([fieldKey, value]) => ({ fieldKey, value })),
          },
        }),
        TIMEOUT_MS,
      );
      if ("error" in result) {
        setError(
          result.error === "contact_manquant"
            ? "Il manque encore une adresse e-mail pour pouvoir vous répondre."
            : "L’envoi n’a pas abouti. Vos réponses sont conservées, vous pouvez réessayer.",
        );
      } else {
        setCompletion(result);
        onLeadCreated?.(result.leadId);
      }
    } catch {
      setError("L’envoi n’a pas abouti. Vos réponses sont conservées, vous pouvez réessayer.");
    } finally {
      setBusy(false);
    }
  }, [state, consent, editing, onLeadCreated, busy]);

  const currentField = useMemo(() => {
    if (!state || !step || (step.kind !== "question" && step.kind !== "clarification")) return null;
    return step.question;
  }, [state, step]);

  if (localMode) return <LocalFallback demoHint={demoHint} />;

  if (loading) {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="h-2 w-40 animate-pulse rounded-full bg-border" />
        <div className="h-10 w-3/4 animate-pulse rounded-lg bg-border" />
        <div className="h-28 w-full animate-pulse rounded-xl bg-border" />
        {slow ? (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Préparation de votre demande…
          </p>
        ) : null}
      </div>
    );
  }

  if (failed || !state) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-medium text-foreground">
          {failed === "unavailable"
            ? "Ce parcours n’est pas disponible"
            : "Le parcours n’a pas pu démarrer"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {failed === "unavailable"
            ? "Le lien est peut-être expiré ou l’expérience n’est plus publiée."
            : "Le service n’a pas répondu à temps. Vous pouvez réessayer ou voir la démonstration locale."}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={() => setAttempt((value) => value + 1)}>Réessayer</Button>
          <Button variant="outline" onClick={() => setLocalMode(true)}>
            Utiliser la démonstration locale
          </Button>
        </div>
      </div>
    );
  }

  if (completion) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-medium text-foreground">
            {state.definition.completion.title}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">{state.definition.completion.body}</p>
        </div>
        <SummaryList lines={completion.lines} title="Ce qui a été transmis" />
        <p className="text-sm text-muted-foreground">{completion.summary}</p>
      </div>
    );
  }

  const showReview = step?.kind === "review" || step?.kind === "max_questions_reached";
  const understood = state.summary.length;

  return (
    <div className="space-y-8">
      <PhaseTrail state={state} />

      {understood > 0 && !showReview ? (
        <p className="text-sm font-medium text-foreground" aria-live="polite">
          J’ai déjà identifié {understood === 1 ? "un élément" : `${understood} éléments`}.
        </p>
      ) : null}

      {showReview ? (
        <div className="space-y-6">
          <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-medium outline-none">
            Voici ce qui sera transmis.
          </h1>
          {step?.kind === "max_questions_reached" && step.missingFields.length > 0 ? (
            <p className="text-sm text-muted-foreground">
              Vous pouvez envoyer votre demande telle quelle : l’entreprise complétera avec vous.
            </p>
          ) : null}
          <SummaryList
            lines={[...state.summary, ...state.suggestions]}
            title="Récapitulatif"
            onEdit={(line) =>
              setEditing((previous) => ({ ...previous, [line.fieldKey]: line.value }))
            }
          />
          {Object.entries(editing).map(([fieldKey, value]) => (
            <div key={fieldKey} className="space-y-2">
              <Label htmlFor={`edit-${fieldKey}`}>
                {state.summary.find((line) => line.fieldKey === fieldKey)?.label ?? fieldKey}
              </Label>
              <Input
                id={`edit-${fieldKey}`}
                value={value}
                onChange={(event) =>
                  setEditing((previous) => ({ ...previous, [fieldKey]: event.target.value }))
                }
              />
            </div>
          ))}
          <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked === true)}
            />
            <Label htmlFor="consent" className="text-sm leading-relaxed text-muted-foreground">
              {state.definition.consentLabel}
            </Label>
          </div>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <Button onClick={confirm} disabled={!consent || busy} size="lg">
            {busy ? "Envoi…" : "Envoyer ma demande"}
          </Button>
        </div>
      ) : currentField ? (
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (answer.trim()) void send(answer.trim());
          }}
        >
          <div>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="text-3xl font-medium leading-snug outline-none sm:text-4xl"
            >
              {currentField.question}
            </h1>
            {currentField.reason ? (
              <p className="mt-2 text-sm text-muted-foreground">{currentField.reason}</p>
            ) : null}
          </div>

          {currentField.input === "choice" && currentField.choices ? (
            <div className="flex flex-wrap gap-2">
              {currentField.choices.map((choice) => (
                <Button
                  key={choice.value}
                  type="button"
                  variant="outline"
                  disabled={busy}
                  onClick={() => void send(choice.value)}
                >
                  {choice.label}
                </Button>
              ))}
            </div>
          ) : currentField.input === "longtext" ? (
            <>
              <Label htmlFor="answer" className="sr-only">
                {currentField.question}
              </Label>
              <Textarea
                id="answer"
                rows={5}
                autoFocus
                value={answer}
                placeholder={currentField.placeholder ?? ""}
                onChange={(event) => setAnswer(event.target.value)}
                className="text-base"
              />
              <p className="text-sm text-muted-foreground">
                Vous pouvez répondre avec vos propres mots.
              </p>
              {demoHint ? (
                <button
                  type="button"
                  className="min-h-11 text-left text-sm text-muted-foreground underline underline-offset-4"
                  onClick={() => setAnswer(demoHint)}
                >
                  Utiliser un exemple
                </button>
              ) : null}
            </>
          ) : (
            <>
              <Label htmlFor="answer" className="sr-only">
                {currentField.question}
              </Label>
              <Input
                id="answer"
                autoFocus
                type={currentField.input === "email" ? "email" : "text"}
                value={answer}
                placeholder={currentField.placeholder ?? ""}
                onChange={(event) => setAnswer(event.target.value)}
              />
            </>
          )}

          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {currentField.input !== "choice" ? (
            <Button type="submit" disabled={busy || !answer.trim()} size="lg">
              {busy ? "Un instant…" : "Continuer"}
            </Button>
          ) : null}

          <SummaryList lines={state.summary} title="Déjà compris" />
          <SummaryList lines={state.suggestions} title="À confirmer" />
        </form>
      ) : null}
    </div>
  );
}

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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

function ProgressTrail({ state }: { state: VisitorState }) {
  return (
    <div>
      <p className="sr-only" aria-live="polite">
        {state.progressLabel}
      </p>
      <ol className="flex flex-wrap items-center gap-2" aria-hidden="true">
        {state.progress.map((phase) => (
          <li
            key={phase.key}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              phase.state === "done" && "border-transparent bg-accent text-accent-foreground",
              phase.state === "current" && "border-primary text-foreground",
              phase.state === "upcoming" && "border-border text-muted-foreground",
            )}
          >
            {phase.label}
          </li>
        ))}
      </ol>
    </div>
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
    <section className="rounded-xl border border-border bg-card p-4">
      <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
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

export function VisitorFlow({ slug, demoHint, onLeadCreated }: VisitorFlowProps) {
  const [state, setState] = useState<VisitorState | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [answer, setAnswer] = useState("");
  const [consent, setConsent] = useState(false);
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [completion, setCompletion] = useState<VisitorCompletion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    startVisitorSession({ data: { slug } })
      .then((result) => {
        if (!active) return;
        if (!result) setFailed(true);
        else setState(result);
      })
      .catch(() => active && setFailed(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug]);

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
        const result = await submitVisitorAnswer({
          data: {
            sessionId: state.sessionId,
            token: state.token,
            questionKey: step.question.key,
            answer: value,
            freeText: Boolean(step.question.opening),
          },
        });
        if (!result) setError("Cette session a expiré. Rechargez la page pour recommencer.");
        else setState(result);
      } catch {
        setError("La réponse n’a pas pu être enregistrée. Réessayez.");
      } finally {
        setBusy(false);
      }
    },
    [state, step],
  );

  const confirm = useCallback(async () => {
    if (!state) return;
    setBusy(true);
    setError(null);
    try {
      const result = await confirmVisitorSubmission({
        data: {
          sessionId: state.sessionId,
          token: state.token,
          consent,
          corrections: Object.entries(editing).map(([fieldKey, value]) => ({ fieldKey, value })),
        },
      });
      if ("error" in result) {
        setError(
          result.error === "contact_manquant"
            ? "Il manque encore une adresse e-mail pour pouvoir vous répondre."
            : "L’envoi n’a pas abouti. Réessayez dans un instant.",
        );
      } else {
        setCompletion(result);
        onLeadCreated?.(result.leadId);
      }
    } catch {
      setError("L’envoi n’a pas abouti. Réessayez dans un instant.");
    } finally {
      setBusy(false);
    }
  }, [state, consent, editing, onLeadCreated]);

  const currentField = useMemo(() => {
    if (!state || !step || (step.kind !== "question" && step.kind !== "clarification")) return null;
    return step.question;
  }, [state, step]);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Préparation de votre demande…</p>;
  }

  if (failed || !state) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-medium">Ce parcours n’est pas disponible</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Le lien est peut-être expiré ou l’expérience n’est plus publiée.
        </p>
      </div>
    );
  }

  if (completion) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-medium">{state.definition.completion.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{state.definition.completion.body}</p>
        </div>
        <SummaryList lines={completion.lines} title="Ce qui a été transmis" />
        <p className="text-sm text-muted-foreground">{completion.summary}</p>
      </div>
    );
  }

  const showReview = step?.kind === "review" || step?.kind === "max_questions_reached";

  return (
    <div className="space-y-6">
      <ProgressTrail state={state} />

      {showReview ? (
        <div className="space-y-6">
          <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-medium outline-none">
            Vérifions ensemble avant l’envoi.
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
          <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
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
            <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-medium outline-none">
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
              />
              {demoHint ? (
                <button
                  type="button"
                  className="text-left text-xs text-muted-foreground underline underline-offset-4"
                  onClick={() => setAnswer(demoHint)}
                >
                  Essayer avec un exemple : « {demoHint} »
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

import { useMemo, useState } from "react";

import { SignalPath, type SignalNode } from "@/components/relay/signal-path";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  buildExperienceDefinition,
  defaultSettings,
  type ExperienceSettings,
} from "@/domain/definitions/builder";

const steps = [
  { key: "identite", label: "Identité" },
  { key: "services", label: "Services" },
  { key: "zones", label: "Zones" },
  { key: "contact", label: "Coordonnées" },
  { key: "revue", label: "Revue" },
] as const;

type Mutable = {
  name: string;
  goal: string;
  services: string[];
  serviceAreas: string[];
  timelines: string[];
  askName: boolean;
  askPhone: boolean;
  askBudget: boolean;
  introPrompt: string;
  completionBody: string;
};

function toMutable(settings: ExperienceSettings): Mutable {
  return {
    name: settings.name,
    goal: settings.goal,
    services: [...settings.services],
    serviceAreas: [...settings.serviceAreas],
    timelines: [...settings.timelines],
    askName: settings.askName,
    askPhone: settings.askPhone,
    askBudget: settings.askBudget,
    introPrompt: settings.introPrompt,
    completionBody: settings.completionBody,
  };
}

function TagField({
  id,
  label,
  hint,
  values,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const value = draft.trim();
    if (value === "" || values.includes(value)) {
      setDraft("");
      return;
    }
    onChange([...values, value]);
    setDraft("");
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <p className="text-xs text-muted-foreground">{hint}</p>
      <div className="flex gap-2">
        <Input
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={add} className="min-h-11">
          Ajouter
        </Button>
      </div>
      <ul className="flex flex-wrap gap-2">
        {values.map((value) => (
          <li key={value}>
            <button
              type="button"
              onClick={() => onChange(values.filter((entry) => entry !== value))}
              className="min-h-9 rounded-full border border-border px-3 text-sm text-foreground transition-colors hover:bg-muted"
              aria-label={`Retirer ${value}`}
            >
              {value} <span aria-hidden="true">×</span>
            </button>
          </li>
        ))}
        {values.length === 0 ? (
          <li className="text-sm text-muted-foreground">Aucun élément pour le moment.</li>
        ) : null}
      </ul>
    </div>
  );
}

export interface ExperienceEditorProps {
  initialSettings?: ExperienceSettings;
  submitLabel: string;
  pending: boolean;
  errorMessage?: string | null;
  onSubmit: (settings: ExperienceSettings) => void;
}

/** Éditeur guidé : une décision à la fois, avec aperçu réel des questions générées. */
export function ExperienceEditor({
  initialSettings,
  submitLabel,
  pending,
  errorMessage,
  onSubmit,
}: ExperienceEditorProps) {
  const [state, setState] = useState<Mutable>(() => toMutable(initialSettings ?? defaultSettings));
  const [stepIndex, setStepIndex] = useState(0);
  const [validation, setValidation] = useState<string | null>(null);

  const preview = useMemo(() => buildExperienceDefinition(state), [state]);

  const nodes: SignalNode[] = steps.map((step, index) => ({
    key: step.key,
    label: step.label,
    state: index < stepIndex ? "done" : index === stepIndex ? "active" : "idle",
  }));

  const patch = (next: Partial<Mutable>) => setState((current) => ({ ...current, ...next }));

  const validate = (): string | null => {
    if (stepIndex === 0) {
      if (state.name.trim().length < 2) return "Donnez un nom à ce parcours.";
      if (state.goal.trim().length < 4) return "Décrivez l’objectif du parcours.";
    }
    if (stepIndex === 1 && state.services.length === 0) {
      return "Ajoutez au moins un service proposé.";
    }
    if (stepIndex === 2 && state.serviceAreas.length === 0) {
      return "Ajoutez au moins une zone desservie.";
    }
    return null;
  };

  const goNext = () => {
    const message = validate();
    setValidation(message);
    if (message) return;
    setStepIndex((index) => Math.min(index + 1, steps.length - 1));
  };

  const currentStep = steps[stepIndex]?.key ?? "identite";

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <SignalPath
          nodes={nodes}
          liveLabel={`Étape ${stepIndex + 1} sur ${steps.length} : ${steps[stepIndex]?.label ?? ""}`}
        />

        <div className="space-y-5 rounded-2xl border border-border bg-surface p-4 sm:p-6">
          {currentStep === "identite" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exp-name">Nom du parcours</Label>
                <Input
                  id="exp-name"
                  value={state.name}
                  onChange={(event) => patch({ name: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-goal">Objectif</Label>
                <Input
                  id="exp-goal"
                  value={state.goal}
                  onChange={(event) => patch({ goal: event.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Ce que ce parcours doit obtenir, en une phrase.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-intro">Première question posée</Label>
                <Input
                  id="exp-intro"
                  value={state.introPrompt}
                  placeholder="De quoi avez-vous besoin ?"
                  onChange={(event) => patch({ introPrompt: event.target.value })}
                />
              </div>
            </div>
          ) : null}

          {currentStep === "services" ? (
            <div className="space-y-5">
              <TagField
                id="exp-services"
                label="Services proposés"
                hint="Ils deviennent les réponses possibles et servent à juger la pertinence."
                values={state.services}
                onChange={(services) => patch({ services })}
              />
              <TagField
                id="exp-timelines"
                label="Échéances proposées"
                hint="Les trois premières sont considérées comme urgentes."
                values={state.timelines}
                onChange={(timelines) => patch({ timelines })}
              />
            </div>
          ) : null}

          {currentStep === "zones" ? (
            <TagField
              id="exp-areas"
              label="Zones desservies"
              hint="Une demande hors zone est signalée au lieu d’être notée au hasard."
              values={state.serviceAreas}
              onChange={(serviceAreas) => patch({ serviceAreas })}
            />
          ) : null}

          {currentStep === "contact" ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                L’adresse e-mail est toujours demandée : c’est la seule façon de répondre.
              </p>
              {(
                [
                  ["askName", "Demander le nom"],
                  ["askPhone", "Demander le téléphone"],
                  ["askBudget", "Demander le budget envisagé"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <Label htmlFor={`exp-${key}`}>{label}</Label>
                  <Switch
                    id={`exp-${key}`}
                    checked={state[key]}
                    onCheckedChange={(checked) => patch({ [key]: checked } as Partial<Mutable>)}
                  />
                </div>
              ))}
              <div className="space-y-2">
                <Label htmlFor="exp-completion">Message de fin</Label>
                <Textarea
                  id="exp-completion"
                  rows={3}
                  value={state.completionBody}
                  onChange={(event) => patch({ completionBody: event.target.value })}
                />
              </div>
            </div>
          ) : null}

          {currentStep === "revue" ? (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-foreground">Résumé du parcours</h2>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Nom</dt>
                  <dd className="text-foreground">{state.name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Objectif</dt>
                  <dd className="text-foreground">{state.goal}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Services</dt>
                  <dd className="text-foreground">{state.services.join(", ") || "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Zones</dt>
                  <dd className="text-foreground">{state.serviceAreas.join(", ") || "—"}</dd>
                </div>
              </dl>
            </div>
          ) : null}

          {validation ? (
            <p role="alert" className="text-sm text-destructive">
              {validation}
            </p>
          ) : null}
          {errorMessage ? (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            {stepIndex > 0 ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStepIndex((index) => Math.max(index - 1, 0))}
              >
                Retour
              </Button>
            ) : null}
            {stepIndex < steps.length - 1 ? (
              <Button type="button" onClick={goNext}>
                Continuer
              </Button>
            ) : (
              <Button type="button" disabled={pending} onClick={() => onSubmit(state)}>
                {pending ? "Enregistrement…" : submitLabel}
              </Button>
            )}
          </div>
        </div>
      </div>

      <aside className="space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Aperçu des questions</h2>
          <Badge variant="secondary">{preview.questions.length}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Relay ne pose que ce qui manque encore : cet ordre est le pire des cas.
        </p>
        <ol className="space-y-2 text-sm">
          {preview.questions.map((question, index) => (
            <li key={question.key} className="rounded-lg border border-border/70 p-3">
              <p className="text-xs text-muted-foreground">
                {index + 1}. {question.phase}
              </p>
              <p className="text-foreground">{question.question}</p>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}

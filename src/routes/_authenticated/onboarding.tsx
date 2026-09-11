import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { AppShell } from "@/components/relay/app-shell";
import { SignalPath, nodesFromIndex } from "@/components/relay/signal-path";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { industries, product } from "@/config/product";
import { createWorkspace } from "@/lib/relay/workspace.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: `Configurer votre espace — ${product.name}` },
      { name: "description", content: "Créez votre organisation Relay, une décision à la fois." },
      { property: "og:title", content: `Configurer votre espace — ${product.name}` },
      { property: "og:description", content: "Organisation, métier et zones desservies." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OnboardingPage,
});

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

const stepLabels = ["Organisation", "Métier", "Zones", "Services", "Activité"] as const;

function OnboardingPage() {
  const navigate = useNavigate();
  const submit = useServerFn(createWorkspace);

  const [stepIndex, setStepIndex] = useState(0);
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [industry, setIndustry] = useState<string>(industries[0]);
  const [serviceAreas, setServiceAreas] = useState("");
  const [services, setServices] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      submit({
        data: {
          name,
          websiteUrl,
          description,
          industries: [industry],
          serviceAreas: splitList(serviceAreas),
          services: splitList(services),
        },
      }),
    onSuccess: () => navigate({ to: "/app/inbox" }),
  });

  const canContinue = () => {
    if (stepIndex === 0) return name.trim().length >= 2;
    if (stepIndex === 2) return splitList(serviceAreas).length > 0;
    if (stepIndex === 3) return splitList(services).length > 0;
    return true;
  };

  const next = () => {
    if (!canContinue()) {
      setError(
        stepIndex === 0
          ? "Indiquez le nom de votre organisation (2 caractères minimum)."
          : "Indiquez au moins une entrée, séparée par des virgules.",
      );
      return;
    }
    setError(null);
    if (stepIndex < stepLabels.length - 1) setStepIndex(stepIndex + 1);
    else mutation.mutate();
  };

  return (
    <AppShell
      title="Configurer votre espace"
      description="Une décision à la fois. Ces réponses alimentent la qualification de vos demandes."
    >
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SignalPath orientation="vertical" nodes={nodesFromIndex([...stepLabels], stepIndex)} />
        </div>

        <form
          className="space-y-6 rounded-2xl border border-border bg-surface p-4 sm:p-6 lg:col-span-8"
          onSubmit={(event) => {
            event.preventDefault();
            next();
          }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Étape {stepIndex + 1} sur {stepLabels.length}
          </p>

          {stepIndex === 0 ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-medium text-foreground">
                Comment s’appelle votre organisation ?
              </h2>
              <div className="space-y-2">
                <Label htmlFor="org-name">Nom de l’organisation</Label>
                <Input
                  id="org-name"
                  autoFocus
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-site">Site web (optionnel)</Label>
                <Input
                  id="org-site"
                  type="url"
                  value={websiteUrl}
                  onChange={(event) => setWebsiteUrl(event.target.value)}
                />
              </div>
            </div>
          ) : null}

          {stepIndex === 1 ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-medium text-foreground">Quel est votre métier ?</h2>
              <div className="flex flex-wrap gap-2">
                {industries.map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={industry === item}
                    onClick={() => setIndustry(item)}
                    className={cn(
                      "min-h-11 rounded-full border px-4 text-sm transition-colors",
                      industry === item
                        ? "border-transparent bg-ink text-background"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {stepIndex === 2 ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-medium text-foreground">Où intervenez-vous ?</h2>
              <p className="text-sm text-muted-foreground">
                Relay s’en sert pour repérer les demandes hors zone.
              </p>
              <div className="space-y-2">
                <Label htmlFor="org-areas">Zones desservies (séparées par des virgules)</Label>
                <Input
                  id="org-areas"
                  autoFocus
                  placeholder="Brabant wallon, Bruxelles"
                  value={serviceAreas}
                  onChange={(event) => setServiceAreas(event.target.value)}
                />
              </div>
            </div>
          ) : null}

          {stepIndex === 3 ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-medium text-foreground">Que proposez-vous ?</h2>
              <div className="space-y-2">
                <Label htmlFor="org-services">Services (séparés par des virgules)</Label>
                <Input
                  id="org-services"
                  autoFocus
                  placeholder="Bornage, Mesurage, Plan d’implantation"
                  value={services}
                  onChange={(event) => setServices(event.target.value)}
                />
              </div>
            </div>
          ) : null}

          {stepIndex === 4 ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-medium text-foreground">
                Décrivez votre activité en quelques lignes.
              </h2>
              <div className="space-y-2">
                <Label htmlFor="org-description">Description (optionnelle)</Label>
                <Textarea
                  id="org-description"
                  rows={5}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
              <div className="rounded-xl border border-border bg-paper p-4 text-sm">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  Récapitulatif
                </p>
                <p className="mt-2 text-foreground">{name || "Organisation sans nom"}</p>
                <p className="text-muted-foreground">
                  {industry} · {splitList(serviceAreas).join(", ") || "zones à préciser"} ·{" "}
                  {splitList(services).join(", ") || "services à préciser"}
                </p>
              </div>
            </div>
          ) : null}

          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          {mutation.isError ? (
            <p role="alert" className="text-sm text-destructive">
              {mutation.error instanceof Error
                ? mutation.error.message
                : "Création impossible pour le moment."}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {stepIndex > 0 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setError(null);
                  setStepIndex(stepIndex - 1);
                }}
              >
                Retour
              </Button>
            ) : null}
            <Button type="submit" size="lg" disabled={mutation.isPending}>
              {mutation.isPending
                ? "Création…"
                : stepIndex === stepLabels.length - 1
                  ? "Créer mon espace"
                  : "Continuer"}
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

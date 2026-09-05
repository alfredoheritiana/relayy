import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { AppShell } from "@/components/relay/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { industries, product } from "@/config/product";
import { createWorkspace } from "@/lib/relay/workspace.functions";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: `Configurer votre espace — ${product.name}` },
      { name: "description", content: "Créez votre organisation Relay en quelques champs." },
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

function OnboardingPage() {
  const navigate = useNavigate();
  const submit = useServerFn(createWorkspace);
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState<string>(industries[0]);
  const [serviceAreas, setServiceAreas] = useState("");
  const [services, setServices] = useState("");

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

  return (
    <AppShell
      title="Configurer votre espace"
      description="Ces informations alimentent la qualification de vos demandes."
    >
      <form
        className="max-w-2xl space-y-5 rounded-lg border border-border bg-card p-6"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate();
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="org-name">Nom de l’organisation</Label>
          <Input
            id="org-name"
            required
            minLength={2}
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

        <div className="space-y-2">
          <Label htmlFor="org-industry">Secteur</Label>
          <select
            id="org-industry"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
          >
            {industries.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="org-areas">Zones desservies (séparées par des virgules)</Label>
          <Input
            id="org-areas"
            value={serviceAreas}
            onChange={(event) => setServiceAreas(event.target.value)}
            placeholder="Brabant wallon, Bruxelles"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="org-services">Services proposés (séparés par des virgules)</Label>
          <Input
            id="org-services"
            value={services}
            onChange={(event) => setServices(event.target.value)}
            placeholder="Bornage, Mesurage, Plan d’implantation"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="org-description">Description de l’activité</Label>
          <Textarea
            id="org-description"
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        {mutation.isError ? (
          <p role="alert" className="text-sm text-destructive">
            {mutation.error instanceof Error
              ? mutation.error.message
              : "Création impossible pour le moment."}
          </p>
        ) : null}

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Création…" : "Créer mon espace"}
        </Button>
      </form>
    </AppShell>
  );
}

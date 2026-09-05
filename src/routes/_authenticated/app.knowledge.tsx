import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { AppShell } from "@/components/relay/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { product } from "@/config/product";
import { addKnowledgeSource, getWorkspace, listKnowledge } from "@/lib/relay/workspace.functions";

export const Route = createFileRoute("/_authenticated/app/knowledge")({
  head: () => ({
    meta: [
      { title: `Business Brain — ${product.name}` },
      {
        name: "description",
        content: "Ce que Relay sait de votre activité : services, zones et sources de contenu.",
      },
      { property: "og:title", content: `Business Brain — ${product.name}` },
      { property: "og:description", content: "Connaissance métier utilisée pour qualifier." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: KnowledgePage,
});

function Coverage({ label, done, hint }: { label: string; done: boolean; hint: string }) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
      <span
        aria-hidden="true"
        className={
          done
            ? "mt-1 size-2.5 shrink-0 rounded-full bg-primary"
            : "mt-1 size-2.5 shrink-0 rounded-full border border-border"
        }
      />
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">
          {label}{" "}
          <span className="text-xs font-normal text-muted-foreground">
            {done ? "renseigné" : "à compléter"}
          </span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </div>
    </li>
  );
}

function KnowledgePage() {
  const queryClient = useQueryClient();
  const fetchWorkspace = useServerFn(getWorkspace);
  const fetchKnowledge = useServerFn(listKnowledge);
  const addSource = useServerFn(addKnowledgeSource);

  const workspace = useQuery({ queryKey: ["workspace"], queryFn: () => fetchWorkspace() });
  const knowledge = useQuery({ queryKey: ["knowledge"], queryFn: () => fetchKnowledge() });

  const [title, setTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [content, setContent] = useState("");

  const organizationId = workspace.data?.organization?.id ?? null;
  const profile = knowledge.data?.profile ?? null;
  const services = knowledge.data?.services ?? [];
  const sources = knowledge.data?.sources ?? [];
  const areas = profile?.service_areas ?? [];

  const mutation = useMutation({
    mutationFn: () => {
      if (!organizationId) throw new Error("Espace non configuré.");
      return addSource({
        data: {
          organizationId,
          title,
          type: sourceUrl ? "url" : "note",
          sourceUrl,
          content,
        },
      });
    },
    onSuccess: () => {
      setTitle("");
      setSourceUrl("");
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["knowledge"] });
    },
  });

  return (
    <AppShell
      title="Business Brain"
      description="Relay s’appuie sur ces éléments pour poser les bonnes questions et qualifier."
      organizationName={workspace.data?.organization?.name ?? null}
      actions={
        <Button asChild size="sm" variant="outline">
          <Link to="/app/experiences">Voir mes parcours</Link>
        </Button>
      }
    >
      {knowledge.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-3" aria-busy="true">
          {[0, 1, 2].map((index) => (
            <div key={index} className="h-40 animate-pulse rounded-2xl bg-border" />
          ))}
        </div>
      ) : knowledge.isError ? (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p role="alert" className="text-sm text-destructive">
            Votre connaissance métier n’a pas pu être chargée.
          </p>
          <Button className="mt-4" onClick={() => knowledge.refetch()}>
            Réessayer
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <ul className="grid gap-3 sm:grid-cols-3">
            <Coverage
              label="Description de l’activité"
              done={Boolean(profile?.description)}
              hint="Sert à comprendre les demandes formulées librement."
            />
            <Coverage
              label="Zones desservies"
              done={areas.length > 0}
              hint="Une demande hors zone est signalée au lieu d’être notée au hasard."
            />
            <Coverage
              label="Services"
              done={services.length > 0}
              hint="Les services deviennent les réponses proposées dans vos parcours."
            />
          </ul>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              <section className="rounded-2xl border border-border bg-surface p-5">
                <h2 className="text-sm font-semibold text-foreground">Profil d’activité</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {profile?.description ?? "Aucune description enregistrée."}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {areas.map((area: string) => (
                    <li key={area}>
                      <Badge variant="outline">{area}</Badge>
                    </li>
                  ))}
                  {areas.length === 0 ? (
                    <li className="text-xs text-muted-foreground">Aucune zone enregistrée.</li>
                  ) : null}
                </ul>
              </section>

              <section className="rounded-2xl border border-border bg-surface p-5">
                <h2 className="text-sm font-semibold text-foreground">Services</h2>
                <ul className="mt-3 divide-y divide-border text-sm">
                  {services.map((service) => (
                    <li key={service.id} className="flex items-center justify-between gap-2 py-2">
                      <span className="min-w-0 truncate text-foreground">{service.name}</span>
                      <Badge variant={service.active ? "secondary" : "outline"}>
                        {service.active ? "Actif" : "Inactif"}
                      </Badge>
                    </li>
                  ))}
                  {services.length === 0 ? (
                    <li className="py-2 text-muted-foreground">Aucun service enregistré.</li>
                  ) : null}
                </ul>
              </section>

              <section className="rounded-2xl border border-border bg-surface p-5">
                <h2 className="text-sm font-semibold text-foreground">Sources</h2>
                <ul className="mt-3 divide-y divide-border text-sm">
                  {sources.map((source) => (
                    <li key={source.id} className="flex items-center justify-between gap-2 py-2">
                      <span className="min-w-0 truncate text-foreground">{source.title}</span>
                      <Badge variant="outline">
                        {source.status === "ready" ? "Prête" : "En attente"}
                      </Badge>
                    </li>
                  ))}
                  {sources.length === 0 ? (
                    <li className="py-2 text-muted-foreground">
                      Aucune source ajoutée pour le moment.
                    </li>
                  ) : null}
                </ul>
              </section>
            </div>

            <form
              className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5"
              onSubmit={(event) => {
                event.preventDefault();
                mutation.mutate();
              }}
            >
              <div>
                <h2 className="text-sm font-semibold text-foreground">Ajouter une source</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Une page web ou une note interne : Relay s’en sert pour mieux comprendre vos
                  demandes.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source-title">Titre</Label>
                <Input
                  id="source-title"
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source-url">Adresse web (optionnel)</Label>
                <Input
                  id="source-url"
                  type="url"
                  value={sourceUrl}
                  onChange={(event) => setSourceUrl(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source-content">Contenu (optionnel)</Label>
                <Textarea
                  id="source-content"
                  rows={6}
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                />
              </div>
              {mutation.isError ? (
                <p role="alert" className="text-sm text-destructive">
                  {mutation.error instanceof Error ? mutation.error.message : "Ajout impossible."}
                </p>
              ) : null}
              {mutation.isSuccess ? (
                <p aria-live="polite" className="text-sm text-muted-foreground">
                  Source ajoutée.
                </p>
              ) : null}
              <Button type="submit" disabled={mutation.isPending || !organizationId}>
                {mutation.isPending ? "Ajout…" : "Ajouter"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { AppShell } from "@/components/relay/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { product } from "@/config/product";
import {
  addKnowledgeSource,
  getWorkspace,
  listKnowledge,
} from "@/lib/relay/workspace.functions";

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
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground">Profil d’activité</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {knowledge.data?.profile?.description ?? "Aucune description enregistrée."}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Zones : {knowledge.data?.profile?.service_areas?.join(", ") || "—"}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground">Services</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {(knowledge.data?.services ?? []).map((service) => (
                <li key={service.id} className="flex items-center justify-between gap-2">
                  <span className="text-foreground">{service.name}</span>
                  <Badge variant={service.active ? "secondary" : "outline"}>
                    {service.active ? "Actif" : "Inactif"}
                  </Badge>
                </li>
              ))}
              {(knowledge.data?.services ?? []).length === 0 ? (
                <li className="text-muted-foreground">Aucun service enregistré.</li>
              ) : null}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground">Sources</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {(knowledge.data?.sources ?? []).map((source) => (
                <li key={source.id} className="flex items-center justify-between gap-2">
                  <span className="text-foreground">{source.title}</span>
                  <Badge variant="outline">{source.status}</Badge>
                </li>
              ))}
              {(knowledge.data?.sources ?? []).length === 0 ? (
                <li className="text-muted-foreground">Aucune source ajoutée.</li>
              ) : null}
            </ul>
          </div>
        </section>

        <form
          className="space-y-4 rounded-lg border border-border bg-card p-5"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate();
          }}
        >
          <h2 className="text-sm font-semibold text-foreground">Ajouter une source</h2>
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
          <Button type="submit" disabled={mutation.isPending || !organizationId}>
            {mutation.isPending ? "Ajout…" : "Ajouter"}
          </Button>
        </form>
      </div>
    </AppShell>
  );
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { AppShell } from "@/components/relay/app-shell";
import { SignalPath } from "@/components/relay/signal-path";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { leadStatusLabels, product, recommendedActionLabels } from "@/config/product";
import { getLeadDetail, updateLeadStatus } from "@/lib/relay/workspace.functions";

export const Route = createFileRoute("/_authenticated/app/leads/$leadId")({
  head: () => ({
    meta: [
      { title: `Demande — ${product.name}` },
      { name: "description", content: "Détail d’une demande structurée reçue via Relay." },
      { property: "og:title", content: `Demande — ${product.name}` },
      { property: "og:description", content: "Action recommandée, score explicable et faits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LeadDetailPage,
});

const statuses = ["new", "to_contact", "qualified", "not_a_fit", "done"] as const;

const FIELD_LABELS: Record<string, string> = {
  service: "Projet",
  location: "Lieu",
  timeline: "Délai",
  budget: "Budget",
  project_reason: "Objectif",
  email: "E-mail",
  phone: "Téléphone",
  contact_name: "Nom",
};

const DIMENSION_LABELS: Record<string, string> = {
  fit: "Fit",
  intent: "Intent",
  urgency: "Urgency",
  completeness: "Completeness",
};

function LeadDetailPage() {
  const { leadId } = Route.useParams();
  const queryClient = useQueryClient();
  const fetchLead = useServerFn(getLeadDetail);
  const setStatus = useServerFn(updateLeadStatus);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ["lead", leadId],
    queryFn: () => fetchLead({ data: { leadId } }),
  });

  const mutation = useMutation({
    mutationFn: (status: (typeof statuses)[number]) => setStatus({ data: { leadId, status } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  const data = detail.data;

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };

  return (
    <AppShell
      title="Demande"
      description="Action recommandée, faits collectés, score explicable — la conversation en dernier."
      actions={
        <Button asChild variant="outline" size="sm">
          <Link to="/app/inbox">Retour à l’inbox</Link>
        </Button>
      }
    >
      {detail.isLoading ? (
        <div className="h-40 animate-pulse rounded-2xl bg-border" aria-busy="true" />
      ) : detail.isError ? (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p role="alert" className="text-sm text-destructive">
            Cette demande n’a pas pu être chargée.
          </p>
          <Button className="mt-4" onClick={() => detail.refetch()}>
            Réessayer
          </Button>
        </div>
      ) : !data ? (
        <p className="text-sm text-muted-foreground">Demande introuvable.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            {/* 1. Statut + action recommandée */}
            <section className="rounded-2xl border border-border bg-ink p-6 text-background">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-signal text-signal-foreground">
                  {leadStatusLabels[data.lead.status] ?? data.lead.status}
                </Badge>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-background/50">
                  Action recommandée
                </span>
              </div>
              <p className="mt-3 text-2xl font-medium">
                {data.lead.recommendedAction
                  ? (recommendedActionLabels[data.lead.recommendedAction] ??
                    data.lead.recommendedAction)
                  : "Action à définir"}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={data.lead.status === status ? "secondary" : "outline"}
                    disabled={mutation.isPending}
                    className={
                      data.lead.status === status
                        ? ""
                        : "border-background/25 bg-transparent text-background hover:bg-background/10"
                    }
                    onClick={() => mutation.mutate(status)}
                  >
                    {leadStatusLabels[status]}
                  </Button>
                ))}
              </div>
            </section>

            {/* 2. Identité et contact */}
            <section className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="text-xl font-medium text-foreground">
                {data.lead.contactName ?? data.lead.email ?? "Contact sans nom"}
              </h2>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">E-mail</dt>
                  <dd className="font-mono text-foreground">{data.lead.email ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Téléphone</dt>
                  <dd className="font-mono text-foreground">{data.lead.phone ?? "—"}</dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                {data.lead.email ? (
                  <Button size="sm" variant="outline" onClick={() => copy("email", data.lead.email!)}>
                    Copier l’e-mail
                  </Button>
                ) : null}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copy("synthese", data.lead.summary ?? data.lead.intent ?? "")}
                >
                  Copier la synthèse
                </Button>
                {copied ? (
                  <span aria-live="polite" className="self-center text-xs text-muted-foreground">
                    Copié.
                  </span>
                ) : null}
              </div>
            </section>

            {/* 3-5. Résumé, intention et faits */}
            <section className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Ce que cette personne veut
              </h3>
              <p className="mt-2 text-lg text-foreground">{data.lead.intent}</p>
              <p className="mt-4 whitespace-pre-line text-sm text-muted-foreground">
                {data.lead.summary}
              </p>

              <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                {data.values.map((value, index) => (
                  <div
                    key={`${value.fieldKey}-${index}`}
                    className="rounded-xl border border-border bg-paper p-3"
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      {FIELD_LABELS[value.fieldKey] ?? value.fieldKey}
                    </dt>
                    <dd className="mt-1 text-sm text-foreground">
                      {String(value.value)}{" "}
                      <span className="text-xs text-muted-foreground">({value.source})</span>
                    </dd>
                  </div>
                ))}
              </dl>

              {data.lead.missingFields.length > 0 ? (
                <p className="mt-5 rounded-lg border border-border bg-paper p-3 text-sm text-muted-foreground">
                  Informations manquantes :{" "}
                  {data.lead.missingFields
                    .map((field) => FIELD_LABELS[field] ?? field)
                    .join(", ")}
                </p>
              ) : null}
            </section>

            {/* 9. Transcript, fermé par défaut */}
            <section className="rounded-2xl border border-border bg-surface">
              <button
                type="button"
                aria-expanded={transcriptOpen}
                aria-controls="transcript"
                onClick={() => setTranscriptOpen((value) => !value)}
                className="flex min-h-11 w-full items-center justify-between px-6 py-4 text-left text-sm font-medium text-foreground"
              >
                Voir la conversation complète
                <span aria-hidden="true">{transcriptOpen ? "−" : "+"}</span>
              </button>
              {transcriptOpen ? (
                <ol id="transcript" className="space-y-4 border-t border-border px-6 py-5 text-sm">
                  {data.messages.map((message, index) => (
                    <li key={`${message.createdAt}-${index}`}>
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        {message.actor === "visitor" ? "Visiteur" : "Relay"}
                      </p>
                      <p className="mt-1 text-foreground">{message.content}</p>
                    </li>
                  ))}
                </ol>
              ) : null}
            </section>
          </div>

          {/* 6. Scores : rail vertical */}
          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Score global
              </h3>
              <p className="mt-2 font-mono text-4xl text-foreground">
                {data.lead.overallScore === null || data.lead.overallScore === undefined ? (
                  <span className="text-base text-muted-foreground">
                    Données insuffisantes pour calculer ce score.
                  </span>
                ) : (
                  <>
                    {data.lead.overallScore}
                    <span className="text-lg text-muted-foreground">/100</span>
                  </>
                )}
              </p>

              <div className="mt-6 flex gap-4">
                <SignalPath
                  orientation="vertical"
                  className="w-28 shrink-0"
                  nodes={data.scores.map((score) => ({
                    key: score.dimension,
                    label: DIMENSION_LABELS[score.dimension] ?? score.dimension,
                    state: score.score === null ? "idle" : "done",
                  }))}
                />
                <ul className="min-w-0 flex-1 space-y-6 text-sm">
                  {data.scores.map((score) => (
                    <li key={score.dimension}>
                      <p className="font-mono text-foreground">
                        {score.score === null ? "Données insuffisantes" : `${score.score}/100`}
                      </p>
                      <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                        {score.reasons.map((reason, index) => (
                          <li key={`${score.dimension}-${index}`}>{reason}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      )}
    </AppShell>
  );
}

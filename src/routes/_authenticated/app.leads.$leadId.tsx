import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { AppShell } from "@/components/relay/app-shell";
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
      { property: "og:description", content: "Résumé, score et historique de la demande." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LeadDetailPage,
});

const statuses = ["new", "to_contact", "qualified", "not_a_fit", "done"] as const;

function LeadDetailPage() {
  const { leadId } = Route.useParams();
  const queryClient = useQueryClient();
  const fetchLead = useServerFn(getLeadDetail);
  const setStatus = useServerFn(updateLeadStatus);

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

  return (
    <AppShell
      title="Demande"
      description="Résumé factuel, score explicable et historique de la conversation."
      actions={
        <Button asChild variant="outline" size="sm">
          <Link to="/app/inbox">Retour à l’inbox</Link>
        </Button>
      }
    >
      {detail.isLoading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : !data ? (
        <p className="text-sm text-muted-foreground">Demande introuvable.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="space-y-4 lg:col-span-2">
            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-lg font-semibold text-foreground">
                {data.lead.contactName ?? data.lead.email ?? "Contact sans nom"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{data.lead.intent}</p>
              <p className="mt-4 whitespace-pre-line text-sm text-foreground">
                {data.lead.summary}
              </p>
              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">E-mail</dt>
                  <dd className="text-foreground">{data.lead.email ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Téléphone</dt>
                  <dd className="text-foreground">{data.lead.phone ?? "—"}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground">Informations collectées</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {data.values.map((value) => (
                  <li key={value.fieldKey} className="flex flex-wrap justify-between gap-2">
                    <span className="text-muted-foreground">{value.fieldKey}</span>
                    <span className="text-foreground">
                      {value.value}{" "}
                      <span className="text-xs text-muted-foreground">({value.source})</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground">Conversation</h3>
              <ol className="mt-3 space-y-3 text-sm">
                {data.messages.map((message, index) => (
                  <li key={`${message.createdAt}-${index}`}>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {message.actor === "visitor" ? "Visiteur" : "Relay"}
                    </p>
                    <p className="text-foreground">{message.content}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground">Score</h3>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                {data.lead.overallScore ?? "—"}
                <span className="text-base text-muted-foreground">/100</span>
              </p>
              {data.lead.recommendedAction ? (
                <Badge className="mt-3">
                  {recommendedActionLabels[data.lead.recommendedAction] ??
                    data.lead.recommendedAction}
                </Badge>
              ) : null}
              <ul className="mt-4 space-y-3 text-sm">
                {data.scores.map((score) => (
                  <li key={score.dimension}>
                    <p className="font-medium text-foreground">
                      {score.dimension} : {score.score ?? "—"}
                    </p>
                    <ul className="mt-1 list-disc pl-4 text-xs text-muted-foreground">
                      {score.reasons.map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              {data.lead.missingFields.length > 0 ? (
                <p className="mt-4 text-xs text-muted-foreground">
                  Manquant : {data.lead.missingFields.join(", ")}
                </p>
              ) : null}
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground">Statut</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={data.lead.status === status ? "default" : "outline"}
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate(status)}
                  >
                    {leadStatusLabels[status]}
                  </Button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </AppShell>
  );
}

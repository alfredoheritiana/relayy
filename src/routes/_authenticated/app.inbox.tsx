import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { AppShell } from "@/components/relay/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { leadStatusLabels, product, recommendedActionLabels } from "@/config/product";
import { getWorkspace, listLeads } from "@/lib/relay/workspace.functions";

export const Route = createFileRoute("/_authenticated/app/inbox")({
  head: () => ({
    meta: [
      { title: `Inbox des demandes — ${product.name}` },
      {
        name: "description",
        content: "Consultez les demandes structurées reçues via vos parcours Relay.",
      },
      { property: "og:title", content: `Inbox des demandes — ${product.name}` },
      { property: "og:description", content: "Demandes qualifiées et priorisées." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: InboxPage,
});

const statusFilters = ["all", "new", "to_contact", "qualified", "not_a_fit", "done"] as const;

function InboxPage() {
  const [status, setStatus] = useState<string>("all");
  const fetchWorkspace = useServerFn(getWorkspace);
  const fetchLeads = useServerFn(listLeads);

  const workspace = useQuery({ queryKey: ["workspace"], queryFn: () => fetchWorkspace() });
  const leads = useQuery({
    queryKey: ["leads", status],
    queryFn: () => fetchLeads({ data: { status } }),
  });

  const organization = workspace.data?.organization ?? null;

  return (
    <AppShell
      title="Inbox"
      description="Chaque demande arrive résumée, scorée et prête à traiter."
      organizationName={organization?.name ?? null}
      actions={
        organization ? null : (
          <Button asChild size="sm">
            <Link to="/onboarding">Configurer mon espace</Link>
          </Button>
        )
      }
    >
      {!workspace.isLoading && !organization ? (
        <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          Votre espace n’est pas encore configuré.{" "}
          <Link to="/onboarding" className="underline underline-offset-4">
            Créer mon organisation
          </Link>
          .
        </p>
      ) : null}

      <div className="mb-4 flex flex-wrap gap-2">
        {statusFilters.map((value) => (
          <Button
            key={value}
            variant={status === value ? "default" : "outline"}
            size="sm"
            onClick={() => setStatus(value)}
          >
            {value === "all" ? "Toutes" : leadStatusLabels[value]}
          </Button>
        ))}
      </div>

      {leads.isLoading ? (
        <p className="text-sm text-muted-foreground">Chargement des demandes…</p>
      ) : (leads.data?.length ?? 0) === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Aucune demande pour ce filtre.
        </p>
      ) : (
        <ul className="space-y-3">
          {leads.data?.map((lead) => (
            <li key={lead.id}>
              <Link
                to="/app/leads/$leadId"
                params={{ leadId: lead.id }}
                className="block rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-foreground">
                    {lead.contactName ?? lead.email ?? "Contact sans nom"}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {leadStatusLabels[lead.status] ?? lead.status}
                    </Badge>
                    {typeof lead.overallScore === "number" ? (
                      <Badge>{lead.overallScore}/100</Badge>
                    ) : null}
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {lead.intent ?? "Intention à préciser"}
                </p>
                {lead.recommendedAction ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Action conseillée :{" "}
                    {recommendedActionLabels[lead.recommendedAction] ?? lead.recommendedAction}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}

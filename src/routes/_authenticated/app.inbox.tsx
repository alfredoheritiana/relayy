import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/relay/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { leadStatusLabels, product, recommendedActionLabels } from "@/config/product";
import { getWorkspace, listLeads } from "@/lib/relay/workspace.functions";
import { cn } from "@/lib/utils";

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
const sorts = [
  ["recent", "Plus récentes"],
  ["score", "Score le plus élevé"],
  ["action", "Action prioritaire"],
] as const;

type SortKey = (typeof sorts)[number][0];

function InboxPage() {
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");

  const fetchWorkspace = useServerFn(getWorkspace);
  const fetchLeads = useServerFn(listLeads);

  const workspace = useQuery({ queryKey: ["workspace"], queryFn: () => fetchWorkspace() });
  const leads = useQuery({
    queryKey: ["leads", status],
    queryFn: () => fetchLeads({ data: { status } }),
  });

  const organization = workspace.data?.organization ?? null;

  const visible = useMemo(() => {
    const list = [...(leads.data ?? [])];
    const term = search.trim().toLowerCase();
    const filtered = term
      ? list.filter((lead) =>
          [lead.contactName, lead.email, lead.intent]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(term)),
        )
      : list;

    if (sort === "score") {
      filtered.sort((a, b) => (b.overallScore ?? -1) - (a.overallScore ?? -1));
    } else if (sort === "action") {
      const weight: Record<string, number> = {
        high_priority_contact: 0,
        standard_follow_up: 1,
        request_missing_information: 2,
        not_a_fit: 3,
      };
      filtered.sort(
        (a, b) =>
          (weight[a.recommendedAction ?? ""] ?? 9) - (weight[b.recommendedAction ?? ""] ?? 9),
      );
    }
    return filtered;
  }, [leads.data, search, sort]);

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
        <p className="mb-6 rounded-2xl border border-border bg-surface p-6 text-sm text-muted-foreground">
          Votre espace n’est pas encore configuré.{" "}
          <Link to="/onboarding" className="underline underline-offset-4">
            Créer mon organisation
          </Link>
          .
        </p>
      ) : null}

      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="search">Rechercher</Label>
            <Input
              id="search"
              placeholder="Nom, e-mail ou intention"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <span className="text-sm font-medium text-foreground">Trier par</span>
            <div className="flex flex-wrap gap-2">
              {sorts.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={sort === value}
                  onClick={() => setSort(value)}
                  className={cn(
                    "min-h-11 rounded-lg border px-3 text-sm transition-colors",
                    sort === value
                      ? "border-transparent bg-ink text-background"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
          {statusFilters.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={status === value}
              onClick={() => setStatus(value)}
              className={cn(
                "min-h-11 rounded-full border px-4 text-sm transition-colors",
                status === value
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {value === "all" ? "Toutes" : leadStatusLabels[value]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {leads.isLoading ? (
          <ul className="space-y-3" aria-busy="true">
            {[0, 1, 2].map((index) => (
              <li key={index} className="h-24 animate-pulse rounded-2xl bg-border" />
            ))}
          </ul>
        ) : leads.isError ? (
          <div className="rounded-2xl border border-border bg-surface p-6">
            <p role="alert" className="text-sm text-destructive">
              Les demandes n’ont pas pu être chargées.
            </p>
            <Button className="mt-4" onClick={() => leads.refetch()}>
              Réessayer
            </Button>
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="text-base text-foreground">
              {search.trim()
                ? "Aucune demande ne correspond à cette recherche."
                : "Aucune demande pour ce filtre."}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Partagez le lien de votre parcours pour commencer à recevoir des demandes structurées.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button asChild size="sm">
                <Link to="/app/experiences">Voir mes expériences</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/demo">Revoir la démonstration</Link>
              </Button>
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {visible.map((lead) => (
              <li key={lead.id}>
                <Link
                  to="/app/leads/$leadId"
                  params={{ leadId: lead.id }}
                  className="block rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-primary/40"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-medium text-foreground">
                        {lead.contactName ?? lead.email ?? "Contact sans nom"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {lead.intent ?? "Intention à préciser"}
                      </p>
                      {lead.recommendedAction ? (
                        <p className="mt-3 text-sm text-foreground">
                          {recommendedActionLabels[lead.recommendedAction] ??
                            lead.recommendedAction}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant="secondary">
                        {leadStatusLabels[lead.status] ?? lead.status}
                      </Badge>
                      {typeof lead.overallScore === "number" ? (
                        <span className="font-mono text-sm text-foreground">
                          {lead.overallScore}/100
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Score indisponible</span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}

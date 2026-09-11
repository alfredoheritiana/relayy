import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/relay/app-shell";
import { LeadDetailPanel } from "@/components/relay/lead-detail-panel";
import { MagneticButton } from "@/components/relay/magnetic-button";
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

/** Split-view uniquement au-delà de 1024px. */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

function InboxPage() {
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const isDesktop = useIsDesktop();
  const navigate = useNavigate();

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

  // Sélection automatique de la première demande en split-view.
  useEffect(() => {
    if (!isDesktop) return;
    if (visible.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !visible.some((lead) => lead.id === selectedId)) {
      setSelectedId(visible[0]!.id);
    }
  }, [isDesktop, visible, selectedId]);

  const openLead = (leadId: string) => {
    if (isDesktop) setSelectedId(leadId);
    else navigate({ to: "/app/leads/$leadId", params: { leadId } });
  };

  const listContent = leads.isLoading ? (
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
          : status === "all"
            ? "Aucune demande pour le moment."
            : "Aucune demande pour ce filtre."}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Partagez le lien de votre parcours pour commencer à recevoir des demandes structurées.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <MagneticButton asChild size="sm">
          <Link to="/app/experiences">Voir mes expériences</Link>
        </MagneticButton>
        <Button asChild size="sm" variant="outline">
          <Link to="/demo">Revoir la démonstration</Link>
        </Button>
      </div>
    </div>
  ) : (
    <ul className="space-y-3">
      {visible.map((lead) => {
        const active = isDesktop && lead.id === selectedId;
        return (
          <li key={lead.id}>
            <button
              type="button"
              aria-current={active ? "true" : undefined}
              onClick={() => openLead(lead.id)}
              className={cn(
                "relay-card block w-full rounded-2xl border bg-surface p-4 text-left transition-colors sm:p-5",
                active ? "border-primary" : "border-border hover:border-primary/40",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <motion.p
                    layoutId={`lead-title-${lead.id}`}
                    className="truncate text-base font-medium text-foreground"
                  >
                    {lead.contactName ?? lead.email ?? "Contact sans nom"}
                  </motion.p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {lead.intent ?? "Intention à préciser"}
                  </p>
                  {lead.recommendedAction ? (
                    <p className="mt-3 text-sm text-foreground">
                      {recommendedActionLabels[lead.recommendedAction] ?? lead.recommendedAction}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <motion.span layoutId={`lead-status-${lead.id}`}>
                    <Badge variant="secondary">
                      {leadStatusLabels[lead.status] ?? lead.status}
                    </Badge>
                  </motion.span>
                  {typeof lead.overallScore === "number" ? (
                    <span className="font-mono text-sm text-foreground">
                      {lead.overallScore}/100
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Score indisponible</span>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <AppShell
      title="Inbox"
      description="Chaque demande arrive résumée, scorée et prête à traiter."
      organizationName={organization?.name ?? null}
      actions={
        organization ? null : (
          <MagneticButton asChild size="sm">
            <Link to="/onboarding">Configurer mon espace</Link>
          </MagneticButton>
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

      <div className="relay-card rounded-2xl border border-border bg-surface p-3 sm:p-5">
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

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4 sm:flex sm:flex-wrap">
          {statusFilters.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={status === value}
              onClick={() => setStatus(value)}
              className={cn(
                "min-h-11 rounded-full border px-2 text-xs transition-colors sm:px-4 sm:text-sm",
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

      <div className="mt-6 lg:grid lg:grid-cols-[35fr_65fr] lg:items-start lg:gap-6">
        <div className="min-w-0">{listContent}</div>
        <div className="hidden min-w-0 lg:block">
          <AnimatePresence mode="wait">
            {selectedId ? (
              <motion.div
                key={selectedId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <LeadDetailPanel leadId={selectedId} variant="split" />
              </motion.div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                Sélectionnez une demande pour voir le détail.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  );
}

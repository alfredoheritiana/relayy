import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { AppShell } from "@/components/relay/app-shell";
import { Button } from "@/components/ui/button";
import { product } from "@/config/product";
import { getAnalytics } from "@/lib/relay/workspace.functions";

export const Route = createFileRoute("/_authenticated/app/analytics")({
  head: () => ({
    meta: [
      { title: `Analytics d’intake — ${product.name}` },
      {
        name: "description",
        content: "Taux de complétion, abandons et informations manquantes de vos parcours.",
      },
      { property: "og:title", content: `Analytics d’intake — ${product.name}` },
      { property: "og:description", content: "Mesures utiles pour améliorer vos parcours." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AnalyticsPage,
});

function Metric({
  label,
  value,
  hint,
  emphasis,
}: {
  label: string;
  value: string;
  hint: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={
        emphasis
          ? "rounded-2xl border border-primary/30 bg-primary/5 p-5"
          : "rounded-2xl border border-border bg-surface p-5"
      }
    >
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function BarList({
  title,
  description,
  empty,
  items,
}: {
  title: string;
  description: string;
  empty: string;
  items: Array<{ key: string; label: string; count: number }>;
}) {
  const max = items.reduce((highest, item) => Math.max(highest, item.count), 0);

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.key} className="space-y-1">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-foreground">{item.label}</span>
              <span className="tabular-nums text-muted-foreground">{item.count}</span>
            </div>
            <div className="h-2 rounded-full bg-muted" role="presentation">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${max === 0 ? 0 : Math.round((item.count / max) * 100)}%` }}
              />
            </div>
          </li>
        ))}
        {items.length === 0 ? <li className="text-sm text-muted-foreground">{empty}</li> : null}
      </ul>
    </section>
  );
}

function AnalyticsPage() {
  const fetchAnalytics = useServerFn(getAnalytics);
  const analytics = useQuery({ queryKey: ["analytics"], queryFn: () => fetchAnalytics() });
  const data = analytics.data;

  return (
    <AppShell
      title="Analytics"
      description="Comprendre où les visiteurs s’arrêtent et ce qui manque le plus souvent."
    >
      {analytics.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-border" />
          ))}
        </div>
      ) : analytics.isError || !data ? (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p role="alert" className="text-sm text-destructive">
            Les mesures n’ont pas pu être chargées.
          </p>
          <Button className="mt-4" onClick={() => analytics.refetch()}>
            Réessayer
          </Button>
        </div>
      ) : data.started === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-base text-foreground">Aucun parcours n’a encore été démarré.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Partagez le lien public d’un parcours : les mesures apparaissent dès la première visite.
          </p>
          <Button asChild size="sm" className="mt-5">
            <Link to="/app/experiences">Voir mes parcours</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric
              label="Parcours démarrés"
              value={String(data.started)}
              hint="Visiteurs ayant écrit une première phrase."
            />
            <Metric
              label="Demandes reçues"
              value={String(data.leads)}
              hint="Parcours allés jusqu’au consentement."
            />
            <Metric
              label="Taux de complétion"
              value={`${data.completionRate}%`}
              hint={`${data.completed} terminés · ${data.abandoned} abandonnés.`}
              emphasis
            />
            <Metric
              label="Score moyen"
              value={data.averageScore === null ? "—" : `${data.averageScore}/100`}
              hint="Aucun score n’est inventé quand les données manquent."
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <BarList
              title="Informations les plus souvent manquantes"
              description="Ce que vos demandes n’apportent pas encore : à clarifier dans le parcours."
              empty="Rien à signaler."
              items={data.missingFields.map((item) => ({
                key: item.field,
                label: item.field,
                count: item.count,
              }))}
            />
            <BarList
              title="Points d’abandon"
              description="Les questions où les visiteurs s’arrêtent le plus."
              empty="Aucun abandon enregistré."
              items={data.dropOff.map((item) => ({
                key: item.questionKey,
                label: item.questionKey,
                count: item.count,
              }))}
            />
          </div>
        </div>
      )}
    </AppShell>
  );
}

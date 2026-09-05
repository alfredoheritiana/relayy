import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { AppShell } from "@/components/relay/app-shell";
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
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
      {analytics.isLoading || !data ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Parcours démarrés" value={String(data.started)} />
            <Metric label="Parcours terminés" value={String(data.completed)} />
            <Metric label="Taux de complétion" value={`${data.completionRate}%`} />
            <Metric
              label="Score moyen"
              value={data.averageScore === null ? "—" : `${data.averageScore}/100`}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-sm font-semibold text-foreground">
                Informations les plus souvent manquantes
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {data.missingFields.map((item) => (
                  <li key={item.field} className="flex justify-between gap-2">
                    <span className="text-muted-foreground">{item.field}</span>
                    <span className="text-foreground">{item.count}</span>
                  </li>
                ))}
                {data.missingFields.length === 0 ? (
                  <li className="text-muted-foreground">Rien à signaler.</li>
                ) : null}
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-sm font-semibold text-foreground">Points d’abandon</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {data.dropOff.map((item) => (
                  <li key={item.questionKey} className="flex justify-between gap-2">
                    <span className="text-muted-foreground">{item.questionKey}</span>
                    <span className="text-foreground">{item.count}</span>
                  </li>
                ))}
                {data.dropOff.length === 0 ? (
                  <li className="text-muted-foreground">Aucun abandon enregistré.</li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
